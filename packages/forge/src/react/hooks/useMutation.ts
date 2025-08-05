import {
  useMutation as useReactMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useForgeContext } from "@repo/forge/react/components/provider";

export function useMutation<P = void, R = unknown>(
  key: string,
  options?: UseMutationOptions<R, unknown, P>
) {
  const { client } = useForgeContext();

  return useReactMutation<R, unknown, P>({
    ...options,
    mutationKey: [key],
    mutationFn: client
      ? (payload) => client.mutate<P, R>(key, payload)
      : undefined,
  });
}
