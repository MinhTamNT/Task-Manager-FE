import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProjectIcon from "@mui/icons-material/Assignment";
import TeamIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Email";
import NotificationIcon from "@mui/icons-material/Notifications";
import Link from "next/link";

interface SidebarItem {
  icon: React.ReactNode;
  text: string;
  url: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: <DashboardIcon />, text: "Dashboard", url: "/" },
  { icon: <ProjectIcon />, text: "Project", url: "/project" },
  { icon: <TeamIcon />, text: "Team", url: "/" },
  { icon: <MessageIcon />, text: "Messages", url: "/" },
  { icon: <NotificationIcon />, text: "Notifications", url: "/" },
];

export const Sidebar = () => {
  return (
    <aside className="bg-white text-black w-64 h-full shadow-lg transform fixed inset-y-0 left-0 md:relative transition-transform duration-200 ease-in-out">
      <div className="flex items-center justify-center h-16"></div>
      <nav className="mt-6">
        <ul className="space-y-4">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link href={item.url}>
                <button className="flex items-center text-gray-800 hover:text-indigo-600 py-2 px-4 transition-colors duration-200">
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
