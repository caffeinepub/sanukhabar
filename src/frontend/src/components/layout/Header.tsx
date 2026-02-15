import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoryNav from './CategoryNav';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <>
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/generated/sanukhabar-logo.dim_512x160.png"
                alt="Sanukhabar"
                className="h-10 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <CategoryNav />
              {identity && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/admin/articles' })}
                >
                  Admin
                </Button>
              )}
              <LoginButton />
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <CategoryNav mobile />
                {identity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: '/admin/articles' });
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    Admin
                  </Button>
                )}
                <LoginButton />
              </nav>
            </div>
          )}
        </div>
      </header>
      <ProfileSetupModal />
    </>
  );
}
