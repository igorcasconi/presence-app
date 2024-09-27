import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "@/contexts/AuthContext";

import { Footer, Header } from "@/components";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Presence App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Header>{children}</Header>
          <ToastContainer position="top-center" />

          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
