import { useParams, Link } from '@tanstack/react-router';
import { useGetArticle } from '../hooks/useArticle';
import { useGetCategories } from '../hooks/useCategories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function ArticleDetailPage() {
  const { articleId } = useParams({ from: '/article/$articleId' });
  const articleIdBigInt = BigInt(articleId);
  const { data: article, isLoading, error } = useGetArticle(articleIdBigInt);
  const { data: categories } = useGetCategories();

  const category = categories?.find((cat) => cat.id === article?.category);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
        <Skeleton className="aspect-video w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Article Not Found</AlertTitle>
          <AlertDescription>
            The article you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {category && <Badge variant="secondary">{category.name}</Badge>}
          <span className="text-sm text-muted-foreground">{formatDate(article.publishedAt)}</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
        <p className="text-muted-foreground">By {article.author}</p>
      </header>

      {article.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img src={article.imageUrl} alt={article.title} className="w-full h-auto" />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-foreground leading-relaxed">{article.content}</div>
      </div>
    </article>
  );
}
