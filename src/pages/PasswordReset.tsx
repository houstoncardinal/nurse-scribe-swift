import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check for password reset URL parameters
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      // Set the session with the tokens
      authService.handlePasswordReset(accessToken, refreshToken).then(({ error }) => {
        if (error) {
          toast.error('Password reset failed', { description: error });
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!accessToken || !refreshToken || type !== 'recovery') {
      // No valid reset parameters
      setError('Invalid password reset link. Please request a new password reset from the sign-in page.');
    }
  }, [searchParams]);

  // Check if user is already authenticated after password reset
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.isAuthenticated && !state.isLoading && isSuccess) {
        // User has been successfully signed in after password reset
        toast.success('Password updated successfully!', {
          description: 'You are now signed in with your new password.'
        });
        // Redirect to app after a short delay
        setTimeout(() => {
          navigate('/app');
        }, 2000);
      }
    });

    return unsubscribe;
  }, [navigate, isSuccess]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authService.updatePassword(newPassword);

      if (error) {
        setError(error);
        toast.error('Password update failed', { description: error });
      } else {
        setIsSuccess(true);
        toast.success('Password updated successfully!', {
          description: 'Signing you in...'
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update password';
      setError(errorMessage);
      toast.error('Password update failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/auth');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Password Updated!
            </h1>
            <p className="text-muted-foreground">
              Your password has been successfully updated and you're now signed in.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Redirecting to your dashboard...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Password Reset Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !newPassword.trim() || !confirmPassword.trim()}
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleBackToSignIn}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your password reset is secure and encrypted</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
