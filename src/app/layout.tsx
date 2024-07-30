"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Provider } from "./components/Provider";
import { Sidebar } from "./components/Sidebar/Sidebar";
import "./globals.css";
import { metadata } from "./lib/meta";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "./components/configs/apollo-client";
import { ProjectProvider } from "./components/Context/ProjectContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Provider>
          <ApolloProvider client={client}>
            <ProjectProvider>
              <ToastContainer />
              <div className="header">
                <Header onMenuClick={handleMenuClick} />
                <div className={`md:flex min-h-screen pt-[60px]`}>
                  <div className={`md:block`}>
                    <Sidebar
                      isOpen={isSidebarOpen}
                      setIsSidebarOpen={handleMenuClick}
                    />
                  </div>
                  <div className="content mx-auto p-2 w-full">{children}</div>
                </div>
              </div>
            </ProjectProvider>
          </ApolloProvider>
        </Provider>
      </body>
    </html>
  );
}
