import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/redux/Provider";
import SideNav from "@/components/Navigation/SideNav";
import Header from "@/components/Header";
import GetApp from "@/components/GetApp";
import { Manrope } from "next/font/google";
import Toaster from "@/components/UI/Toaster";
import { ThemeProvider } from "./ThemeContext";
import SuccessToast from "@/components/UI/SuccessToast";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import ProgressLoader from "@/components/UI/ProgressLoader";
import localFont from "next/font/local";
import TopHeader from "@/components/TopHeader";
import SlideCart from "@/components/SlideCart";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const dodo = localFont({
  src: "../fonts/Dodo.ttf",
  variable: "--font-dodo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Broadway Pizza",
  description:
    "Broadway Pizza is offering online ordering services in Pakistan. Order now and get amazing discounts and coupons on pizza deals and other fast food.",
  icons: {
    icon: [{ url: "/assets/broadwayPizzaLogo.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <html lang="en" suppressHydrationWarning>
          <ThemeProvider>
            <body
              className={`${dodo.variable} antialiased`}
              suppressHydrationWarning
            >
              <SideNav />
              <main className="main-content">
                <TopHeader />
                <Header />
                <Toaster />
                <SuccessToast />
                <LoadingSpinner />
                <ProgressLoader />
                <SlideCart/>
                {children}
                <GetApp isFooter={true} />
              </main>
            </body>
          </ThemeProvider>
        </html>
      </Providers>
    </>
  );
}
