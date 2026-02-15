import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ArticleState, ArticleId } from '../backend';

export function useGetArticle(id: ArticleId) {
  const { actor, isFetching } = useActor();

  return useQuery<ArticleState>({
    queryKey: ['article', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
