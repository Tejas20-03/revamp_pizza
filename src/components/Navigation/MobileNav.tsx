"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import { MdOutlinePushPin } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";
import {
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";

const ICON_SIZE = 22;

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
            className={`flex items-center justify-center rounded-full
            ${
              title === "Bar"
                ? "bg-black w-[42px] h-[42px]"
                : isActive
                ? "bg-[#FFC714] w-[32px] h-[32px]"
                : "bg-[#656565] w-[32px] h-[32px]"
            }`}
          >
            <Icon
              size={ICON_SIZE}
              height={ICON_SIZE}
              width={ICON_SIZE}
              color={title === "Bar" ? "white" : isActive ? "black" : "white"}
            />
          </div>
          {title === "Cart" && cartData.cartProducts.length >= 0 && (
            <div className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center bg-[#FFC714] rounded-full bounce">
              <span className="text-xs text-[var(--text-primary)]">
                {cartData.cartProducts.length}
              </span>
            </div>
          )}
        </div>
        {title !== "Bar" && (
          <span className="text-xs text-white mt-1">{title}</span>
        )}
      </Link>
    </div>
  );
};

interface MobileNavProps {
  toggleMenu: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ toggleMenu }) => {
  const pathname = usePathname();
  const { userData } = useSelector((state: StoreState) => state.auth);

  const navItems = [
    { href: "/", icon: AiOutlineMenu, title: "Bar" },
    { href: "/", icon: AiOutlineHome, title: "Order" },
    { href: "/menu", icon: HiOutlineDocumentText, title: "Menu" },
    { href: "/cart", icon: AiOutlineShoppingCart, title: "Cart" },
    { href: "/location", icon: MdOutlinePushPin, title: "Locations" },
    {
      href: "/profile",
      icon: AiOutlineUser,
      title: userData?.name || "Profile",
    },
  ];

  return (
    <div className="fixed bottom-1 left-0 w-full px-4 z-50 lg:hidden">
      <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 max-w-md mx-auto shadow-lg">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavItem
              key={item.title}
              {...item}
              isActive={pathname === item.href}
              onClick={item.title === "Bar" ? toggleMenu : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
