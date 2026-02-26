import { Outlet } from '@tanstack/react-router';
import CustomerHeader from '../components/CustomerHeader';
import CustomerFooter from '../components/CustomerFooter';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
