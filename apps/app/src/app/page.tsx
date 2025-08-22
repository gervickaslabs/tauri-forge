"use client";

import { Card } from "@tauriforge/ui/components/card";
import { useForgeContext } from "@tauriforge/forge/react/components/provider";

import type { BaseCommandAdapter } from "@tauriforge/forge/adapters";

const Home = () => {
  const { forge } = useForgeContext();

  const commandAdapter = forge?.getAdapter<BaseCommandAdapter>("command");

  const handleCommandMutate = async () => {
    console.log(
      "command mutate",
      await commandAdapter?.mutate("greet", { name: "world" }),
    );
  };

  const handCommandQuery = async () => {
    console.log("command query", await commandAdapter?.query("greet_2"));
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <div>
          <h1 id="title" className="text-4xl font-bold">
            Tauri forge
          </h1>
          <h2>features</h2>
          <h2 className="text-3xl">Query and mutation using command</h2>
          <Card className="p-6 m-6">
            <ul>
              <li>
                <button onClick={handCommandQuery}>greet query</button>
              </li>
              <li>
                <button onClick={handleCommandMutate}>greet mutate</button>
              </li>
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Home;
