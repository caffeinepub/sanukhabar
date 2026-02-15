import { Link } from '@tanstack/react-router';
import { ArticleState, Category } from '../../backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../../lib/utils';

interface ArticleCardProps {
  article: ArticleState;
  category?: Category;
}

export default function ArticleCard({ article, category }: ArticleCardProps) {
  return (
    <Link to="/article/$articleId" params={{ articleId: article.id.toString() }}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
        {article.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
          </div>
          <h3 className="font-serif text-xl font-bold leading-tight line-clamp-2">{article.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.content.substring(0, 150)}...
          </p>
          <p className="text-xs text-muted-foreground mt-2">By {article.author}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
