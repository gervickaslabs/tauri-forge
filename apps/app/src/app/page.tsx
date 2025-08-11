"use client";

import { Card } from "@repo/ui/components/card";
import { useForge } from "@repo/forge/react/hooks/useForge";

import config from "../../forge.config";

const Home = () => {
  const forge = useForge(config);

  const handleCommandMutate = async () => {
    console.log(
      "command mutate",
      await forge?.api?.command?.mutate("greet", { name: "world" })
    );
  };

  const handCommandQuery = async () => {
    console.log("command query", await forge?.api?.command?.query("greet_2"));
  };

  return (
    <Card>
      <div>
        <h1 className="text-4xl font-bold">Tauri forge</h1>
        <h2>features</h2>
        <h2 className="text-3xl">Query and mutation using command</h2>
        <ul>
          <li>
            <button onClick={handCommandQuery}>greet query</button>
          </li>
          <li>
            <button onClick={handleCommandMutate}>greet mutate</button>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default Home;
