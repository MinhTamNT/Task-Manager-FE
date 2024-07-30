import { useIsMobile } from "@/app/hooks/useMobile";
import React from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { SignInButton } from "../SiginInButton/SignInButton";
interface IHeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<IHeaderProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();
  return (
    <header
      className={`bg-white fixed top-0 left-0 right-0 shadow-md h-[60px] flex items-center justify-between px-4 ${
        isMobile ? "z-20" : "z-50"
      } `}
    >
      <div className="flex items-center space-x-2">
        {isMobile ? (
          <>
            <button onClick={onMenuClick}>
              <RiMenu2Fill size={24} />
            </button>
          </>
        ) : (
          <>
            <img
              src="https://play-lh.googleusercontent.com/pjUulZ-Vdo7qPKxk3IRhnk8SORPlgSydSyYEjm7fGcoXO8wDyYisWXwQqEjMryZ_sqK2"
              alt="Logo"
              className="h-8 w-8"
            />
          </>
        )}
        {isMobile ? (
          <></>
        ) : (
          <>
            <span className="text-xl font-semibold text-indigo-600">
              Task Manager App
            </span>
          </>
        )}
      </div>
      <SignInButton />
    </header>
  );
};
