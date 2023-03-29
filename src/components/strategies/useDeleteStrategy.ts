import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useDeleteStrategyQuery,
  useQueryClient,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const useDeleteStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const deleteMutation = useDeleteStrategyQuery();
  const cache = useQueryClient();

  const deleteStrategy = async (strategy: Strategy) => {
    const { base, quote, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in delete strategy: missing data ');
    }

    deleteMutation.mutate(
      {
        id,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('deleteStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('delete mutation failed', e);
        },
      }
    );
  };

  return {
    deleteStrategy,
  };
};
