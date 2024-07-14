"use client";
import { useSession } from "next-auth/react";
import { Header } from "./components/Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && !sessionStorage.getItem("toastShown")) {
      toast.success(`Hey, Welcome Back ${session?.user?.name}`);
      sessionStorage.setItem("toastShown", "true");
    }
  }, [status, session]);
  return (
    <main className="">
      <ToastContainer />
      <Header />
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-300 "></div>
      </div>
    </main>
  );
}
