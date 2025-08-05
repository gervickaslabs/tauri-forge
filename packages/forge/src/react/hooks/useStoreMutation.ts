import { useForgeContext } from "@repo/forge/react/components/provider";
import {
  useMutation as useReactMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

export function useStoreMutation<P = void, R = unknown>(
  key: string,
  options?: UseMutationOptions<R, unknown, P>
) {
  const { store } = useForgeContext();

  return useReactMutation<R, unknown, P>({
    ...options,
    mutationKey: [key],
    mutationFn: store
      ? (record) => store.insertRecord<P, R>(key, record)
      : undefined,
  });
}
