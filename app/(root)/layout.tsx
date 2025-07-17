"use client";

import { useLocalStorageWatcher } from "@/hooks/localstorage-watcher";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const playerName = useLocalStorageWatcher("playerName", null);
  const router = useRouter();

  useEffect(() => {
    if (typeof playerName === "string" && playerName.trim() !== "") {
      console.log("Player found:", playerName);
    } else if (playerName !== null) {
      router.push("/");
    }
  }, [playerName, router]);

  if (playerName === null) {
    router.push("/");
  }

  return <div>{children}</div>;
};

export default RootLayout;
