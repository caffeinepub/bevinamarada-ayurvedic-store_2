import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminSidebar from '../components/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  useEffect(() => {
    if (!adminLoading && isAuthenticated && isAdmin === false) {
      navigate({ to: '/admin/login' });
    }
  }, [adminLoading, isAuthenticated, isAdmin, navigate]);

  if (isInitializing || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-body text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isAdmin === false) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
