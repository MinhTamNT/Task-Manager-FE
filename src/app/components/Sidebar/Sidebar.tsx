import React, { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProjectIcon from "@mui/icons-material/Assignment";
import TeamIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Email";
import NotificationIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import { useIsMobile } from "@/app/hooks/useMobile";
import { GrClose } from "react-icons/gr";
interface SidebarItem {
  icon: React.ReactNode;
  text: string;
  url: string;
}

interface IProp {
  isOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarItems: SidebarItem[] = [
  { icon: <DashboardIcon />, text: "Dashboard", url: "/" },
  { icon: <ProjectIcon />, text: "Project", url: "/project" },
  { icon: <MessageIcon />, text: "Messages", url: "/message" },
  { icon: <NotificationIcon />, text: "Notifications", url: "/notification" },
];

export const Sidebar: React.FC<IProp> = ({ isOpen, setIsSidebarOpen }) => {
  const [selectedItem, setSelectedItem] = useState<string>(sidebarItems[0].url);
  const isMobile = useIsMobile();

  const sidebarClass =
    isOpen || !isMobile ? "hidden md:block" : "block md:block z-50 md:z-0";
  return (
    <aside
      className={`bg-white text-black w-64 h-full shadow-lg transform fixed inset-y-0 left-0 md:relative transition-transform duration-200 ease-in-out ${sidebarClass}`}
    >
      <div className="flex items-center space-x-2">
        {isMobile && (
          <>
            <img
              src="https://play-lh.googleusercontent.com/pjUulZ-Vdo7qPKxk3IRhnk8SORPlgSydSyYEjm7fGcoXO8wDyYisWXwQqEjMryZ_sqK2"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold text-indigo-600">
              Task Manager App
            </span>
            <button onClick={() => setIsSidebarOpen(false)}>
              <GrClose />
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-center md:h-16 "></div>
      <nav className="mt-6">
        <ul className="space-y-4 space-x-2">
          {sidebarItems.map((item, index) => (
            <li key={index} className="">
              <Link href={item.url}>
                <button
                  onClick={() => setSelectedItem(item.url)}
                  className={`flex items-center p-4 w-[90%] max-w-full rounded-md transition-colors duration-200 ${
                    selectedItem === item.url
                      ? "bg-indigo-600 text-white"
                      : " hover:text-indigo-600"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
