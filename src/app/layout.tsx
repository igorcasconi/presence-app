import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Presence App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer position="top-center" />
      </body>
    </html>
  );
}
