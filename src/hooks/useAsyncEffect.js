import { useEffect } from 'react';

export const useAsyncEffect = (effect: () => Promise<void>, deps: any[]) => {
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
