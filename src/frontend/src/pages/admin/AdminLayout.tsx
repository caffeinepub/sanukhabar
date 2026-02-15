import { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileText, FolderOpen } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/articles">
            <Button variant={location.pathname === '/admin/articles' ? 'default' : 'outline'} size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Articles
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant={location.pathname === '/admin/categories' ? 'default' : 'outline'} size="sm">
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
