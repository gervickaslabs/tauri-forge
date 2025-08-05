import {
  useQuery as useReactQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { useForgeContext } from "@repo/forge/react/components/provider";

export const useQuery = <P = void, R = unknown>(
  key: string,
  payload?: P,
  options?: UseQueryOptions<R>
) => {
  const { client } = useForgeContext();
  if (!client) {
    throw new Error("Client is not initialized");
  }

  return useReactQuery<R>({
    ...options,
    queryKey: [key, payload],
    queryFn: () => client.query<P, R>(key, payload),
  });
};
