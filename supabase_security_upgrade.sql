-- =====================================================
-- SECURITY UPGRADE: User Roles Separation
-- =====================================================
-- This migration addresses privilege escalation vulnerabilities
-- by separating user roles into a dedicated table with proper
-- security definer functions to prevent RLS recursion.
-- =====================================================

-- 1. CREATE ROLE ENUM TYPE
CREATE TYPE public.app_role AS ENUM ('admin', 'nurse', 'instructor', 'student', 'auditor', 'manager', 'supervisor', 'owner');

-- 2. CREATE DEDICATED USER ROLES TABLE
-- Roles MUST be stored separately from user_profiles for security
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE (user_id, role, organization_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. CREATE SECURITY DEFINER FUNCTION TO CHECK ROLES
-- This prevents RLS recursion and privilege escalation
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Function to get user's primary role (highest privilege)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'owner' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'supervisor' THEN 3
      WHEN 'manager' THEN 4
      WHEN 'instructor' THEN 5
      WHEN 'nurse' THEN 6
      WHEN 'student' THEN 7
      WHEN 'auditor' THEN 8
    END
  LIMIT 1
$$;

-- 4. RLS POLICIES FOR USER_ROLES TABLE
-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

-- Admins can manage roles (using security definer function)
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON public.user_roles
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 5. UPDATE EXISTING RLS POLICIES TO USE SECURITY DEFINER FUNCTIONS
-- Drop problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create new non-recursive admin policy
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin update policy
CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- 6. AUDIT LOG FOR ROLE CHANGES
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
        VALUES (
            auth.uid(),
            'ROLE_GRANTED',
            'user_role',
            NEW.id,
            jsonb_build_object(
                'target_user', NEW.user_id,
                'role', NEW.role,
                'organization_id', NEW.organization_id
            )
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
        VALUES (
            auth.uid(),
            'ROLE_REVOKED',
            'user_role',
            OLD.id,
            jsonb_build_object(
                'target_user', OLD.user_id,
                'role', OLD.role,
                'organization_id', OLD.organization_id
            )
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER on_role_change
    AFTER INSERT OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- 7. MIGRATE EXISTING ROLES FROM user_profiles TO user_roles
-- Run this after the above structures are in place
INSERT INTO public.user_roles (user_id, role, organization_id)
SELECT 
    up.id::uuid as user_id,
    up.role::app_role as role,
    up.organization_id
FROM user_profiles up
WHERE up.role IS NOT NULL
ON CONFLICT (user_id, role, organization_id) DO NOTHING;

-- 8. INDEX FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_org ON public.user_roles(organization_id);

-- 9. HELPER VIEW FOR EASY ACCESS (Optional)
CREATE OR REPLACE VIEW public.user_with_roles AS
SELECT 
    up.*,
    COALESCE(
        (SELECT array_agg(ur.role) FROM user_roles ur WHERE ur.user_id = up.id::uuid),
        ARRAY[]::app_role[]
    ) as roles
FROM user_profiles up;

COMMENT ON TABLE public.user_roles IS 'Separate role storage for security - prevents privilege escalation';
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check roles without RLS recursion';
