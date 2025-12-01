import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPage, Testimonial } from '@/components/ui/sign-in';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

export function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.isAuthenticated && !state.isLoading) {
        navigate('/app');
      }
    });

    // Check current state
    const currentState = authService.getAuthState();
    if (currentState.isAuthenticated && !currentState.isLoading) {
      navigate('/app');
    }

    return unsubscribe;
  }, [navigate]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        setError(error);
        toast.error('Sign in failed', { description: error });
      } else if (user) {
        toast.success('Welcome back!', { description: `Signed in as ${user.name || user.email}` });
        navigate('/app');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Sign in failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Sign up failed', { description: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Sign up failed', { description: 'Password must be at least 6 characters long' });
      setIsLoading(false);
      return;
    }

    try {
      const { user, error } = await authService.signUp(signUpData.email, signUpData.password, signUpData.name);

      if (error) {
        setError(error);
        toast.error('Sign up failed', { description: error });
      } else if (user) {
        toast.success('Account created successfully!', {
          description: 'Please check your email to confirm your account, then sign in.'
        });
        // Switch back to sign-in mode
        setIsSignUp(false);
        setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Sign up failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        toast.error('Google sign in failed', { description: error });
      }
      // OAuth will handle the redirect
    } catch (err: any) {
      toast.error('Google sign in failed', { description: err.message });
    }
  };

  const handleResetPassword = async () => {
    // For now, just show a message. In a real app, you'd collect the email first
    toast.info('Password reset', { description: 'Check your email for reset instructions' });
  };

  const handleCreateAccount = () => {
    // Toggle between sign-in and sign-up modes
    setIsSignUp(!isSignUp);
    setError(null);
    if (!isSignUp) {
      // Switching to sign-up, reset form
      setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <SignInPage
      title={<span className="font-light text-foreground tracking-tighter">Welcome to Raha</span>}
      description="AI-Powered Clinical Documentation Platform"
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={sampleTestimonials}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
      isSignUp={isSignUp}
      signUpData={signUpData}
      onSignUpDataChange={setSignUpData}
    />
  );
}
