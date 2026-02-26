import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Leaf, Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';

  useEffect(() => {
    if (isAuthenticated && !adminLoading && isAdmin === true) {
      navigate({ to: '/admin/dashboard' });
    }
  }, [isAuthenticated, adminLoading, isAdmin, navigate]);

  const handleLogin = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background texture */}
      <div className="absolute inset-0 leaf-pattern opacity-5 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
            <img
              src="/assets/generated/store-logo.dim_256x256.png"
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Leaf className="h-8 w-8 text-primary hidden" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Bevinamarada Ayurvedic Store</p>
        </div>

        <Card className="shadow-leaf border-border">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading text-lg">Secure Admin Login</CardTitle>
            </div>
            <CardDescription className="font-body text-sm">
              Sign in with your Internet Identity to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoginError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="font-body text-sm text-destructive text-center">
                  Login failed. Please try again.
                </p>
              </div>
            )}

            {isAuthenticated && !adminLoading && isAdmin === false && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="font-body text-sm text-destructive text-center">
                  Access denied. This account does not have admin privileges.
                </p>
              </div>
            )}

            {isAuthenticated && adminLoading && (
              <div className="flex items-center justify-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="font-body text-sm text-muted-foreground">Verifying admin access...</span>
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn || (isAuthenticated && adminLoading)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-medium"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : isAuthenticated ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Switch Account
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            <p className="font-body text-xs text-muted-foreground text-center">
              Only authorized administrators can access this panel.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a
            href="/"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
