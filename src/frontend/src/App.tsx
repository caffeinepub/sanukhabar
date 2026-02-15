import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import SiteLayout from './components/layout/SiteLayout';
import AdminRoute from './components/auth/AdminRoute';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryPage,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/article/$articleId',
  component: ArticleDetailPage,
});

const adminArticlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/articles',
  component: () => (
    <AdminRoute>
      <AdminArticlesPage />
    </AdminRoute>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <AdminRoute>
      <AdminCategoriesPage />
    </AdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  articleRoute,
  adminArticlesRoute,
  adminCategoriesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
