// components/Header/Header.tsx
import React from "react";
import { SignInButton } from "../SiginInButton/SignInButton";

export const Header = () => {
  return (
    <header className="bg-white fixed top-0 left-0 right-0 shadow-md h-[60px] flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-2">
        <img
          src="https://play-lh.googleusercontent.com/pjUulZ-Vdo7qPKxk3IRhnk8SORPlgSydSyYEjm7fGcoXO8wDyYisWXwQqEjMryZ_sqK2"
          alt="Logo"
          className="h-8 w-8"
        />
        <span className="text-xl font-semibold text-indigo-600">
          Task Manager App
        </span>
      </div>
      <SignInButton />
    </header>
  );
};
