import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminSalesPage from './pages/AdminSalesPage';
import AdminEnquiriesPage from './pages/AdminEnquiriesPage';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Customer routes
const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'customer-layout',
  component: CustomerLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/about',
  component: AboutPage,
});

const productsRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/contact',
  component: ContactPage,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/products',
  component: AdminProductsPage,
});

const adminSalesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/sales',
  component: AdminSalesPage,
});

const adminEnquiriesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/enquiries',
  component: AdminEnquiriesPage,
});

// Redirect /admin to /admin/dashboard
const adminRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    throw redirect({ to: '/admin/dashboard' });
  },
});

const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    homeRoute,
    aboutRoute,
    productsRoute,
    contactRoute,
  ]),
  adminLoginRoute,
  adminRedirectRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminSalesRoute,
    adminEnquiriesRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
