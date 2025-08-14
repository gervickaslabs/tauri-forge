"use client";

import { ForgeProvider } from "@tauriforge/forge/react/components/provider";
import config from "@forge-config";

import "./globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ForgeProvider config={config}>{children}</ForgeProvider>
      </body>
    </html>
  );
}
