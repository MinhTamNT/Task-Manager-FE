import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./components/Provider";
import { Header } from "./components/Header/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Mananger App",
  description:
    "Task manager was built to help users manage the project and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="header">
            <Header />
            <div className="md:flex items-center px-2 py-1">
              <div className="w-[30%]">
                <Sidebar />
              </div>
              <div className="content w-[70%]">{children}</div>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
