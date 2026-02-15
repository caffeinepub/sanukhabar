import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ArticleState, ArticleInput, CategoryId } from '../backend';

export function useGetArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<ArticleState[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticlesByCategory(categoryId: CategoryId) {
  const { actor, isFetching } = useActor();

  return useQuery<ArticleState[]>({
    queryKey: ['articles', 'category', categoryId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticlesByCategory(categoryId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ArticleInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createArticle(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ArticleInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArticle(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
