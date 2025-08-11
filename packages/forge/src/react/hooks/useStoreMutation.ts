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
  if (!store) {
    throw new Error("Store is not initialized");
  }

  return useReactMutation<R, unknown, P>({
    ...options,
    mutationKey: [key],
    mutationFn: (record) => store.insertRecord<P, R>(key, record),
  });
}
