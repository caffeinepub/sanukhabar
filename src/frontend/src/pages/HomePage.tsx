import { useState, useMemo } from 'react';
import { useGetArticles } from '../hooks/useArticles';
import { useGetCategories } from '../hooks/useCategories';
import ArticleCard from '../components/news/ArticleCard';
import ArticleListToolbar from '../components/news/ArticleListToolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const { data: articles, isLoading: articlesLoading, error: articlesError } = useGetArticles();
  const { data: categories } = useGetCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

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

  const getCategoryById = (categoryId: bigint) => {
    return categories?.find((cat) => cat.id === categoryId);
  };

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
        <img
          src="/assets/generated/sanukhabar-hero.dim_1600x600.png"
          alt="Sanukhabar News"
          className="w-full h-auto rounded-lg shadow-sm"
        />
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Latest News</h1>
        <p className="text-muted-foreground">Stay informed with the latest updates from around the world</p>
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
            {searchQuery ? 'No articles found matching your search.' : 'No articles available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map((article) => (
            <ArticleCard key={article.id.toString()} article={article} category={getCategoryById(article.category)} />
          ))}
        </div>
      )}
    </div>
  );
}
