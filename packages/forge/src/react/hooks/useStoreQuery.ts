import { useForgeContext } from "@repo/forge/react/components/provider";
import {
  useQuery as useReactQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useStoreQuery<P = void, R = unknown>(
  key: string,
  payload?: P,
  options?: UseQueryOptions<R>
) {
  const { store } = useForgeContext();

  if (!store) {
    throw new Error("Store is not initialized");
  }

  return useReactQuery<R>({
    ...options,
    queryKey: [key, payload],
    queryFn: () => store.retrieveRecord<P, R>(key, payload),
  });
}
