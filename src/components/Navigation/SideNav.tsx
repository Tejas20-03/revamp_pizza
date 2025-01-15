"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import {
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { MdOutlinePushPin } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import MobileNav from "./MobileNav";
import CateringPopup from "../Popup/CateringPopup";
import Image from "next/image";
import BirthdayPopup from "../Popup/BirthdayPopup";
import FeedbackPopup from "../Popup/FeedbackPopup";
import CorporatePopup from "../Popup/CorporatePopup";
import FranchisePopup from "../Popup/FranchisePopup";
import ContactPopup from "../Popup/ContactPopup";
import { IoMenu } from "react-icons/io5";
import { TiDocumentText } from "react-icons/ti";
import { useTheme } from "@/app/ThemeContext";

const ICON_SIZE = 28;

const NavItem = ({ href, icon: Icon, title, isActive, onClick }: any) => {
  const cartData = useSelector((state: StoreState) => state.cart);
  return (
    <div className="group relative" onClick={onClick}>
      <Link
        href={title === "Bar" ? "#" : href}
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={(e) => {
          if (title === "Bar") {
            e.preventDefault();
          }
        }}
      >
        <div className="relative">
          <div
            className={`flex items-center justify-center  rounded-full
            ${
              title === "Bar"
                ? "bg-black w-[44px] h-[44px]"
                : isActive
                ? "bg-[#FFC714] w-[38px] h-[38px]"
                : "bg-transparent"
            }`}
          >
            <Icon
              size={ICON_SIZE}
              height={ICON_SIZE}
              width={ICON_SIZE}
              className={`${
                title === "Bar"
                  ? "text-white"
                  : "text-[#212121] dark:text-white"
              }`}
            />
          </div>
          {title === "Cart" && cartData.cartProducts.length >= 0 && (
            <div className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center bg-[#FFC714] rounded-full bounce">
              <span className="text-xs text-[var(--text-primary)] dark:text-black">
                {cartData.cartProducts.length}
              </span>
            </div>
          )}
        </div>
        {title !== "Bar" && (
          <span className="text-sm opacity-70 font-normal text-[var(--text-primary)]">
            {title}
          </span>
        )}
      </Link>
    </div>
  );
};

const SideNav = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCateringOpen, setIsCateringOpen] = useState<boolean>(false);
  const [isBirthdayOpen, setIsBirthdayOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState<boolean>(false);
  const [isFranchiseOpen, setIsFranchiseOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { userData } = useSelector((state: StoreState) => state.auth);

  useEffect(() => {
    if (
      isCateringOpen ||
      isMenuOpen ||
      isBirthdayOpen ||
      isFeedbackOpen ||
      isCorporateOpen ||
      isFranchiseOpen ||
      isContactOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isCateringOpen,
    isMenuOpen,
    isBirthdayOpen,
    isFeedbackOpen,
    isCorporateOpen,
    isFranchiseOpen,
    isContactOpen,
  ]);

  const navItems = [
    { href: "/", icon: IoMenu, title: "Bar" },
    { href: "/", icon: AiOutlineHome, title: "Order" },
    { href: "/menu", icon: TiDocumentText, title: "Menu" },
    { href: "/cart", icon: AiOutlineShoppingCart, title: "Cart" },
    { href: "/location", icon: MdOutlinePushPin, title: "Location" },
    { href: "/blogs", icon: HiOutlineChatBubbleLeftRight, title: "Blogs" },
    {
      href: "/profile",
      icon: AiOutlineUser,
      title: userData?.name || "Profile",
    },
  ];

  const menuItems = [
    {
      icon: (props: any) => (
        <Image src="/assets/about.svg" width={40} height={40} alt="About" />
      ),
      text: "About",
      href: "/about",
    },
    {
      icon: (props: any) => (
        <Image src="/assets/menu.svg" width={40} height={40} alt="Blogs" />
      ),
      text: "Blog",
      href: "/blogs",
    },
    {
      icon: (props: any) => (
        <Image
          src="/assets/feedback.svg"
          width={40}
          height={40}
          alt="Feedback"
        />
      ),
      text: "Feedback",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsFeedbackOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
    {
      icon: (props: any) => (
        <Image
          src="/assets/catering.svg"
          width={40}
          height={40}
          alt="Catering"
        />
      ),
      text: "Catering",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsCateringOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
    {
      icon: (props: any) => (
        <Image
          src="/assets/birthday1.svg"
          width={40}
          height={40}
          alt="Birthday"
        />
      ),
      text: "Birthday",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsBirthdayOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
    {
      icon: (props: any) => (
        <Image
          src="/assets/corporate.svg"
          width={40}
          height={40}
          alt="Corporate"
        />
      ),
      text: "Corporate",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsCorporateOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
    {
      icon: (props: any) => (
        <Image
          src="/assets/franchise.svg"
          width={40}
          height={40}
          alt="Franchise"
        />
      ),
      text: "Franchise",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsFranchiseOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
    {
      icon: (props: any) => (
        <Image src="/assets/contact.svg" width={40} height={40} alt="Call" />
      ),
      text: "Contact",
      href: "#",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsContactOpen(true);
        setIsLoading(false);
        toggleMenu();
      },
    },
  ];

  return (
    <>
      <nav className="fixed left-0 top-0 h-screen w-[62px] hidden lg:hidden flex-col m-auto bg-white dark:bg-[#202020] shadow-sm border-r border-[#9f9f9f1a] z-40">
        <div className="flex flex-col justify-between h-full py-2">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <NavItem
                key={item.title}
                {...item}
                isActive={
                  pathname === item.href ||
                  (item.href === "/cart" && pathname === "/place-order")
                }
                onClick={item.title === "Bar" ? toggleMenu : undefined}
              />
            ))}
          </div>
        </div>
      </nav>

      <MobileNav toggleMenu={toggleMenu} />

      <div
        className={`fixed left-0 top-0 h-screen w-[260px] bg-white dark:bg-[#121212] shadow-lg transition-transform duration-300 ease-in-out z-[60] transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white/80 dark:bg-[#202020] backdrop-blur-sm p-6 border-b dark:border-[#121212] flex justify-between items-center">
          <h2 className="font-extrabold text-[26px] flex-1 text-center dark:text-white">
            Menu
          </h2>
        </div>

        <div className=" overflow-y-auto h-[calc(100vh-80px)] mt-4 ">
          <div className="space-y-1 dark:bg-[#202020]">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center justify-between p-1 border-b border-gray-200 dark:border-[#121212]"
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  } else {
                    toggleMenu();
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <item.icon size={20} className="text-[#FFC714]" />
                  <span className="dark:text-white">{item.text}</span>
                </div>
                <IoIosArrowForward className="text-gray-400 dark:text-white" />
              </Link>
            ))}
          </div>
          <div className="space-y-1 mb-8 mt-4 dark:bg-[#202020]">
            <div className="mt-4 py-2">
              <h3 className="px-2 text-gray-400 dark:text-white font-light text-[14px]">
                Connect with us
              </h3>
            </div>
            {[
              {
                icon: (props: any) => (
                  <Image src="/assets/fb.svg" width={40} height={40} alt="fb" />
                ),
                text: "Facebook",
                href: "https://www.facebook.com/Broadwaypizzaa",
              },
              {
                icon: (props: any) => (
                  <Image
                    src="/assets/insta.svg"
                    width={40}
                    height={40}
                    alt="insta"
                  />
                ),
                text: "Instagram",
                href: "https://www.instagram.com/broadwaypizzaa/?theme=dark",
              },
              {
                icon: (props: any) => (
                  <Image
                    src="/assets/whatsapp.svg"
                    width={40}
                    height={40}
                    alt="whatsapp"
                  />
                ),
                text: "WhatsApp",
                href: "https://wa.me/+9221111339339",
              },
              {
                icon: (props: any) => (
                  <Image
                    src="/assets/call.svg"
                    width={40}
                    height={40}
                    alt="call"
                  />
                ),
                text: "Call Us",
                href: "tel://021-111-339-339",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target="_blank"
                className="flex items-center justify-between p-1 dark:bg-[#202020]  border-b border-gray-200 dark:border-[#121212]"
                onClick={toggleMenu}
              >
                <div className="flex items-center gap-1">
                  <item.icon size={20} className="text-[#FFC714]" />
                  <span className="dark:text-white">{item.text}</span>
                </div>
                <IoIosArrowForward className="text-gray-400" />
              </Link>
            ))}
          </div>

          <div className="border-t border-b dark:border-[#121212] py-4 px-3 mb-6 dark:bg-[#202020]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[--var(--text-primary)] font-normal text-[16px] dark:text-white">
                Dark Mode
              </span>
              <button
                onClick={toggleDarkMode}
                className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none"
              >
                <div
                  className={`w-6 h-6 bg-white dark:bg-[#ffc714] rounded-full absolute top-0 shadow-md transform transition-all duration-300 ease-in-out
    ${isDarkMode ? "translate-x-6" : "translate-x-0"}
    before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
    hover:scale-110`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
        </div>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
      <CateringPopup
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
      />
      <BirthdayPopup
        isOpen={isBirthdayOpen}
        onClose={() => setIsBirthdayOpen(false)}
      />
      <CorporatePopup
        isOpen={isCorporateOpen}
        onClose={() => setIsCorporateOpen(false)}
      />
      <FranchisePopup
        isOpen={isFranchiseOpen}
        onClose={() => setIsFranchiseOpen(false)}
      />
      <ContactPopup
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};

export default SideNav;
