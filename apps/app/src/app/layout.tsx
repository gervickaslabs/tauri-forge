"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Tauri } from "@repo/forge/lib/clients/tauri";
import { Stronghold } from "@repo/forge/lib/stores/stronghold";
import { ForgeProvider } from "@repo/forge/react/components/provider";

import "./globals.css";
import {
  // use,
  useEffect,
} from "react";
const queryClient = new QueryClient();
const store = new Stronghold();
const client = new Tauri();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    store.init();
  }, []);

  // const getForge = async ({ config: any }) => {
  //   return true;
  // };

  // const forge = use(
  //   getForge({
  //     config: {},
  //   })
  // );

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ForgeProvider client={client} store={store}>
            {children}
          </ForgeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
