import { Link } from '@tanstack/react-router';
import { useGetCategories } from '../../hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryNavProps {
  mobile?: boolean;
}

export default function CategoryNav({ mobile = false }: CategoryNavProps) {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <div className={mobile ? 'flex flex-col gap-2' : 'flex gap-4'}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const containerClass = mobile ? 'flex flex-col gap-2' : 'flex gap-4 items-center';
  const linkClass = mobile
    ? 'text-sm font-medium hover:text-primary transition-colors py-2'
    : 'text-sm font-medium hover:text-primary transition-colors';

  return (
    <div className={containerClass}>
      {categories.map((category) => (
        <Link
          key={category.id.toString()}
          to="/category/$categoryId"
          params={{ categoryId: category.id.toString() }}
          className={linkClass}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
