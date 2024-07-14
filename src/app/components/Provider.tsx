"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
interface IProp {
  children: React.ReactNode;
}

export const Provider: React.FC<IProp> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
