import { useCallback } from 'react';
import Pubsub from 'pubsub-js';

export interface UseToast {
  toast: ({ color, text }: { color: string, text: string }) => void;
}

export function useToast(): UseToast {
  const toast = useCallback(({ color, text }: { color: string, text: string }) => {
    Pubsub.publish('TOAST', { color, text });
  }, []);

  return { toast };
}

export default useToast;
