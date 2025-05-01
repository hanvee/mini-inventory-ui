import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "@/components/common/QueryClientProvider";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory Management",
  description:
    "Inventory Management System for managing customers, products, and sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </QueryClientProvider>
      </body>
    </html>
  );
}