"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import logo from "../../public/assets/broadwayPizzaLogo.png";
import { usePathname, useRouter } from "next/navigation";
import { PiNavigationArrowThin } from "react-icons/pi";
import HeaderPopup from "./Popup/HeaderPopup";
import { StoreState } from "@/redux/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/auth/slice";
import { addressesActions } from "@/redux/address/slice";
import { useTheme } from "@/app/ThemeContext";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const { isAuthenticated } = useSelector((state: StoreState) => state.auth);
  const address = useSelector((state: StoreState) => state.address);
  const { userData } = useSelector((state: StoreState) => state.auth);

  const [scrollPosition, setScrollPosition] = useState(0);

  const isPage = {
    menu: pathname === "/menu",
    cart: pathname === "/cart",
    location: pathname === "/location",
    profile: pathname === "/profile",
    placeOrder: pathname === "/place-order",
    blog: pathname === "/blogs",
    about: pathname === "/about",
    thankyou: pathname === "/thankyou",
  };

  const isThankYouPage = pathname === "/thankyou";

  const handleScroll = useCallback(() => {
    const position = window.scrollY;
    requestAnimationFrame(() => {
      setScrollPosition(position);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? scrollPosition > 0
        ? `rgba(32, 32, 32, ${Math.min(scrollPosition / 200, 0.7)})`
        : "rgba(32, 32, 32, 0.7)"
      : scrollPosition > 0
      ? `rgba(255, 255, 255, ${Math.min(scrollPosition / 200, 0.7)})`
      : "transparent",
    backdropFilter: scrollPosition > 0 ? "blur(2px)" : "none",
    transition: "all 0.3s ease",
  };

  const handleOpenPopup = () => {
    dispatch(addressesActions.setAddresses({ modalOpen: true }));
  };

  return (
    <>
      <header
        className="w-full relative top-0 z-20 h-[60px] sm:h-[70px] lg:h-[70px] mb-2 sm:mb-1 dark:bg-[#202020]"
        style={backgroundStyle}
      >
        <nav className="w-full h-full px-3 max-w-[1300px] mx-auto">
          <div className="flex items-center justify-between h-full relative">
            {isThankYouPage ? (
              <>
                <Link href="/" className="cursor-pointer">
                  <IoArrowBack className="text-2xl dark:text-white" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/">
                  <Image
                    src="/assets/broadwayPizzaLogo.png"
                    alt="Broadway Pizza"
                    width={150}
                    height={40}
                    className="h-auto w-28 sm:w-32" // Increased width for mobile, maintains smaller size on larger screens
                    priority // Ensures faster loading of logo
                    quality={100} // Maximum image quality
                  />
                </Link>
              </>
            )}
            {(isPage.menu ||
              isPage.location ||
              isPage.blog ||
              isPage.about ||
              isPage.thankyou) && (
              <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] lg:text-[26px] font-extrabold text-[var(--text-primary)]/80 dark:text-white tracking-wide">
                {isPage.menu
                  ? "Menu"
                  : isPage.blog
                  ? "Blog"
                  : isPage.about
                  ? "About Broadway"
                  : isPage.thankyou
                  ? "Order Details"
                  : "Locations"}
              </h1>
            )}

            {!isPage.menu &&
              !isPage.cart &&
              !isPage.location &&
              !isPage.profile &&
              !isPage.placeOrder &&
              !isPage.blog &&
              !isPage.about &&
              !isPage.thankyou && (
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    onClick={handleOpenPopup}
                  >
                    <div className="flex items-center">
                      <PiNavigationArrowThin className="text-[var(--text-primary)] text-lg rotate-90" />
                      <span className="hidden text-[13px] text-[var(--text-primary)] md:block">
                        {address.addressType || "Select"}
                      </span>
                    </div>
                    <div className="bg-[var(--primary)] text-[var(--text-primary)] dark:text-black px-1 lg:px-3 sm:py-1 rounded flex items-center gap-2">
                      <span className="text-[13px] font-semibold whitespace-nowrap">
                        {(address.area || address.outlet || "Delivery / Pickup")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ").length > (windowWidth >= 1024 ? 20 : 12)
                          ? (
                              address.area ||
                              address.outlet ||
                              "Delivery / Pickup"
                            )
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")
                              .slice(0, windowWidth >= 1024 ? 20 : 12) + "..."
                          : (
                              address.area ||
                              address.outlet ||
                              "Delivery / Pickup"
                            )
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")}
                      </span>
                    </div>
                  </button>

                  <Link
                    href="/profile"
                    className="hidden md:block bg-[var(--primary)] text-[var(--text-primary)] dark:text-black px-4 py-1 rounded hover:opacity-90 transition-opacity"
                  >
                    <span className="text-[13px] font-semibold">
                      {userData?.name || "Login"}
                    </span>
                  </Link>
                </div>
              )}

            {isPage.profile && isAuthenticated && (
              <button
                className="bg-[var(--primary-light)] text-[var(--text-primary)] md:px-12 px-4 py-1 rounded-full transition-colors opacity-70"
                onClick={() => {
                  dispatch(logout());
                  router.push("/");
                }}
              >
                <span className="text-sm font-medium uppercase ">Logout</span>
              </button>
            )}
          </div>
        </nav>
      </header>
      <HeaderPopup />
    </>
  );
};

export default Header;
