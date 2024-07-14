"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
export const SignInButton = () => {
  const { data: session } = useSession();
  console.log({ session });

  if (session) {
    return (
      <div className=" absolute right-4 top-4">
        <button
          onClick={() => {
            signOut();
          }}
          className="text-black bg-white shadow-sm py-1 px-2 border-2 rounded-md border-black"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className=" absolute right-4 top-4">
      <button
        onClick={() => {
          signIn();
        }}
        className="text-black bg-white shadow-sm py-1 px-2 border-2 rounded-md border-black"
      >
        Sign in
      </button>
    </div>
  );
};
