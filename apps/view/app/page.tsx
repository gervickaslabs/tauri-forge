"use client";

import { useQuery } from "@repo/forge/react/hooks/useQuery";
import { useStoreQuery } from "@repo/forge/react/hooks/useStoreQuery";
import { useMutation } from "@repo/forge/react/hooks/useMutation";
import { useStoreMutation } from "@repo/forge/react/hooks/useStoreMutation";

const Home = () => {
  /// simulate query and mutation using Tauri
  const { data: queriedData } = useQuery<{ name: string }, string>("greet", {
    name: "tauriforge",
  });

  const { mutate: simulateMutate, data: mutatedData } = useMutation<
    { name: string },
    string
  >("greet");

  const handleMutate = () => {
    simulateMutate({ name: "tauriforge" });
  };

  /// simulate insert and retrieve using Stronghold
  const { data: persistedData, refetch: simulatePersistedRefetch } =
    useStoreQuery<void, { name: string }>("persisted");

  const { mutate: simulateStoreMutate, data: mutatedPersistedData } =
    useStoreMutation<
      { name: string },
      {
        name: string;
      }
    >("persisted");

  const handleStoreMutate = () => {
    simulateStoreMutate({ name: "tauriforge" });
  };

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Features</h1>
        <div>
          <h2 className="text-3xl">Query and mutation using Tauri</h2>
          <div>Greeet from query: {queriedData}</div>
          <div>Greeet from mutate: {mutatedData}</div>
          <div>
            <button type="button" onClick={handleMutate}>
              Mutate
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-3xl">Insert and retrieve using Stronghold</h2>
          <div>persisted: {persistedData?.name}</div>
          <div>
            <button type="button" onClick={() => simulatePersistedRefetch()}>
              Refetch
            </button>
          </div>
          <div>persisted: {mutatedPersistedData?.name}</div>
          <div>
            <button type="button" onClick={handleStoreMutate}>
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
