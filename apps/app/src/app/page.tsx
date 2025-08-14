"use client";

import { Card } from "@tauriforge/ui/components/card";
import { useForgeContext } from "@tauriforge/forge/react/components/provider";

const Home = () => {
  const { forge } = useForgeContext();

  const handleCommandMutate = async () => {
    console.log(
      "command mutate",
      await forge?.command?.mutate("greet", { name: "world" }),
    );
  };

  const handCommandQuery = async () => {
    console.log("command query", await forge?.command?.query("greet_2"));
  };

  return (
    <Card>
      <div>
        <h1 id="title" className="text-4xl font-bold">
          Tauri forge
        </h1>
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
