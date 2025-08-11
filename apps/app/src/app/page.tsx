"use client";

import { useQuery } from "@repo/forge/react/hooks/useQuery";
import { useStoreQuery } from "@repo/forge/react/hooks/useStoreQuery";
import { useMutation } from "@repo/forge/react/hooks/useMutation";
import { useStoreMutation } from "@repo/forge/react/hooks/useStoreMutation";
import { useForgeContext } from "@repo/forge/react/components/provider";
// import { useEffect } from "react";
import { Card } from "@repo/ui/components/card";

const Home = () => {
  const {
    // client,
    store,
  } = useForgeContext();

  const simulateStoreQuery = async () => {
    console.log("greet", await store?.retrieveRecord("greet"));
  };
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

  console.log("persistedData", persistedData);

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

  console.log("mutatedPersistedData", mutatedPersistedData);

  return (
    <Card>
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
          <div>muted persisted: {mutatedPersistedData?.name}</div>
          <div>
            <button type="button" onClick={handleStoreMutate}>
              Insert
            </button>
          </div>
        </div>
        <button type="button" onClick={() => simulateStoreQuery()}>
          simulate
        </button>
      </div>
    </Card>
  );
};

export default Home;
