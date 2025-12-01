import React, { useState } from 'react';
import { Eye, EyeOff, X, Mail, ArrowLeft } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: (email: string) => Promise<{ error: string | null }>;
  onUpdatePassword?: (password: string) => Promise<{ error: string | null }>;
  onCreateAccount?: () => void;
  isSignUp?: boolean;
  isPasswordReset?: boolean;
  newPassword?: string;
  confirmNewPassword?: string;
  onNewPasswordChange?: (password: string) => void;
  onConfirmNewPasswordChange?: (password: string) => void;
  signUpData?: { name: string; email: string; password: string; confirmPassword: string };
  onSignUpDataChange?: (data: { name: string; email: string; password: string; confirmPassword: string }) => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const ResetPasswordModal = ({
  isOpen,
  onClose,
  onResetPassword
}: {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (email: string) => Promise<{ error: string | null }>;
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onResetPassword(email.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">Reset Password</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                  Check your email
                </h3>
                <p className="text-muted-foreground">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Email'}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-violet-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const PasswordResetForm = ({
  newPassword,
  confirmNewPassword,
  onNewPasswordChange,
  onConfirmNewPasswordChange,
  onUpdatePassword
}: {
  newPassword: string;
  confirmNewPassword: string;
  onNewPasswordChange?: (password: string) => void;
  onConfirmNewPasswordChange?: (password: string) => void;
  onUpdatePassword?: (password: string) => Promise<{ error: string | null }>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await onUpdatePassword?.(newPassword);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="animate-element animate-delay-250">
        <label className="text-sm font-medium text-muted-foreground">New Password</label>
        <GlassInputWrapper>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => onNewPasswordChange?.(e.target.value)}
              placeholder="Enter your new password"
              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
              required
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
              {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
            </button>
          </div>
        </GlassInputWrapper>
      </div>

      <div className="animate-element animate-delay-350">
        <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
        <GlassInputWrapper>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => onConfirmNewPasswordChange?.(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
              required
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center">
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
            </button>
          </div>
        </GlassInputWrapper>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !newPassword.trim() || !confirmNewPassword.trim()}
        className="animate-element animate-delay-450 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onResetPassword,
  onUpdatePassword,
  onCreateAccount,
  isSignUp = false,
  isPasswordReset = false,
  newPassword = '',
  confirmNewPassword = '',
  onNewPasswordChange,
  onConfirmNewPasswordChange,
  signUpData,
  onSignUpDataChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const handleSignUpDataChange = (field: string, value: string) => {
    if (onSignUpDataChange && signUpData) {
      onSignUpDataChange({
        ...signUpData,
        [field]: value
      });
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Left column: auth form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {isPasswordReset ? 'Reset Your Password' : title}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              {isPasswordReset ? 'Enter your new password below' : description}
            </p>

            {isPasswordReset ? (
              <PasswordResetForm
                newPassword={newPassword}
                confirmNewPassword={confirmNewPassword}
                onNewPasswordChange={onNewPasswordChange}
                onConfirmNewPasswordChange={onConfirmNewPasswordChange}
                onUpdatePassword={onUpdatePassword}
              />
            ) : (
              <>
                <form className="space-y-5" onSubmit={isSignUp ? onSignUp : onSignIn}>
                  {isSignUp && (
                    <div className="animate-element animate-delay-250">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <GlassInputWrapper>
                        <input
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signUpData?.name || ''}
                          onChange={(e) => handleSignUpDataChange('name', e.target.value)}
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                          required
                        />
                      </GlassInputWrapper>
                    </div>
                  )}

                  <div className="animate-element animate-delay-300">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <GlassInputWrapper>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={isSignUp ? signUpData?.email || '' : undefined}
                        onChange={isSignUp ? (e) => handleSignUpDataChange('email', e.target.value) : undefined}
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        required
                      />
                    </GlassInputWrapper>
                  </div>

                  <div className="animate-element animate-delay-400">
                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={isSignUp ? signUpData?.password || '' : undefined}
                          onChange={isSignUp ? (e) => handleSignUpDataChange('password', e.target.value) : undefined}
                          className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                          {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                        </button>
                      </div>
                    </GlassInputWrapper>
                  </div>

                  {isSignUp && (
                    <div className="animate-element animate-delay-450">
                      <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                      <GlassInputWrapper>
                        <div className="relative">
                          <input
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={signUpData?.confirmPassword || ''}
                            onChange={(e) => handleSignUpDataChange('confirmPassword', e.target.value)}
                            className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                            required
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center">
                            {showConfirmPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                          </button>
                        </div>
                      </GlassInputWrapper>
                    </div>
                  )}

                  {!isSignUp && (
                    <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                        <span className="text-foreground/90">Keep me signed in</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowResetPasswordModal(true)}
                        className="hover:underline text-violet-400 transition-colors"
                      >
                        Reset password
                      </button>
                    </div>
                  )}

                  <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <div className="animate-element animate-delay-700 relative flex items-center justify-center">
                  <span className="w-full border-t border-border"></span>
                  <span className="px-4 text-sm text-muted-foreground bg-background absolute">Or continue with</span>
                </div>

                <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors">
                    <GoogleIcon />
                    Continue with Google
                </button>

                <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
                  {isSignUp ? (
                    <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-violet-400 hover:underline transition-colors">Sign In</a></>
                  ) : (
                    <>New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-violet-400 hover:underline transition-colors">Create Account</a></>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
            </div>
          )}
        </section>
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onResetPassword={onResetPassword || (async () => ({ error: 'Reset password not available' }))}
      />
    </div>
  );
};
