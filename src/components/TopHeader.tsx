"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import FeedbackPopup from "./Popup/FeedbackPopup";
import CateringPopup from "./Popup/CateringPopup";
import BirthdayPopup from "./Popup/BirthdayPopup";
import CorporatePopup from "./Popup/CorporatePopup";
import FranchisePopup from "./Popup/FranchisePopup";
import ContactPopup from "./Popup/ContactPopup";

const TopHeader = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [isFranchiseOpen, setIsFranchiseOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Blog",
      href: "/blogs",
    },
    {
      text: "Feedback",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsFeedbackOpen(true);
        setIsLoading(false);
      },
    },
    {
      text: "Catering",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsCateringOpen(true);
        setIsLoading(false);
      },
    },
    {
      text: "Birthday",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsBirthdayOpen(true);
        setIsLoading(false);
      },
    },
    {
      text: "Corporate",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsCorporateOpen(true);
        setIsLoading(false);
      },
    },
    {
      text: "Franchise",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsFranchiseOpen(true);
        setIsLoading(false);
      },
    },
    {
      text: "Contact",
      onClick: async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsContactOpen(true);
        setIsLoading(false);
      },
    },
  ];

  const socialLinks = [
    {
      icon: "/assets/fb.svg",
      href: "https://www.facebook.com/Broadwaypizzaa",
      alt: "Facebook",
    },
    {
      icon: "/assets/insta.svg", 
      href: "https://www.instagram.com/broadwaypizzaa/?theme=dark",
      alt: "Instagram",
    },
    {
      icon: "/assets/whatsapp.svg",
      href: "https://wa.me/+9221111339339",
      alt: "WhatsApp", 
    },
    {
      icon: "/assets/call.svg",
      href: "tel://021-111-339-339",
      alt: "Call",
    },
  ];

  return (
    <div className="hidden lg:block w-full bg-white dark:bg-[#202020] border-b dark:border-[#121212]">
      <div className="max-w-[1300px] mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            {menuItems.map((item, index) => (
              item.onClick ? (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="text-sm font-semibold hover:text-[#FFC714] dark:text-white dark:hover:text-[#FFC714] transition-colors"
                >
                  {item.text}
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className="text-sm font-semibold hover:text-[#FFC714] dark:text-white dark:hover:text-[#FFC714] transition-colors"
                >
                  {item.text}
                </Link>
              )
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src={link.icon}
                  alt={link.alt}
                  width={25}
                  height={25}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
        </div>
      )}

      <FeedbackPopup isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <CateringPopup isOpen={isCateringOpen} onClose={() => setIsCateringOpen(false)} />
      <BirthdayPopup isOpen={isBirthdayOpen} onClose={() => setIsBirthdayOpen(false)} />
      <CorporatePopup isOpen={isCorporateOpen} onClose={() => setIsCorporateOpen(false)} />
      <FranchisePopup isOpen={isFranchiseOpen} onClose={() => setIsFranchiseOpen(false)} />
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

export default TopHeader;
