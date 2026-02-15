import { useState, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetArticlesByCategory } from '../hooks/useArticles';
import { useGetCategories } from '../hooks/useCategories';
import ArticleCard from '../components/news/ArticleCard';
import ArticleListToolbar from '../components/news/ArticleListToolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CategoryPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const categoryIdBigInt = BigInt(categoryId);
  const { data: articles, isLoading: articlesLoading, error: articlesError } = useGetArticlesByCategory(categoryIdBigInt);
  const { data: categories } = useGetCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  const category = categories?.find((cat) => cat.id === categoryIdBigInt);

  const filteredAndSortedArticles = useMemo(() => {
    if (!articles) return [];

    let filtered = articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = articles.filter((article) => article.title.toLowerCase().includes(query));
    }

    const sorted = [...filtered].sort((a, b) => {
      const timeA = Number(a.publishedAt);
      const timeB = Number(b.publishedAt);
      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  }, [articles, searchQuery, sortOrder]);

  if (articlesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load articles. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">
          {category ? category.name : 'Category'}
        </h1>
        <p className="text-muted-foreground">Browse articles in this category</p>
      </div>

      <ArticleListToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {articlesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {searchQuery ? 'No articles found matching your search.' : 'No articles in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map((article) => (
            <ArticleCard key={article.id.toString()} article={article} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
