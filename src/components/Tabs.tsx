import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/app/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { BsArrowRightShort } from "react-icons/bs";
import { toggleCart } from "@/redux/toaster/slice";

type TabsProps = {
  tabs: string[];
  isLoading: boolean;
};

const Tabs: React.FC<TabsProps> = ({ tabs, isLoading }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<string>(tabs[0] || "");
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabRefs = useRef<Record<string, HTMLButtonElement>>({});
  const observer = useRef<IntersectionObserver | null>(null);
  const cartData = useSelector((state: StoreState) => state.cart);
  const dispatch = useDispatch<StoreDispatch>();

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

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? scrollPosition > 30
        ? `rgba(32, 32, 32, ${Math.min(scrollPosition / 200, 0.9)})`
        : "rgba(32, 32, 32, 0.7)"
      : scrollPosition > 30
      ? `rgba(255, 255, 255, ${Math.min(scrollPosition / 200, 0.9)})`
      : "transparent",
    backdropFilter: scrollPosition > 30 ? "blur(4px)" : "none",
    boxShadow:
      scrollPosition > 30 ? "0px 4px 30px rgba(6, 5, 50, 0.1)" : "none",
    transition: "all 0.3s ease",
  };

  const handleTabClick = useCallback((item: string) => {
    const section = document.getElementById(item);
    if (section) {
      const offset = window.innerWidth < 768 ? 100 : 120;
      window.scrollTo({
        top: section.offsetTop - offset,
        behavior: "smooth",
      });
      setActiveTab(item);
    }
  }, []);

  useEffect(() => {
    if (!tabs.length) return;

    // Using a more strict threshold and rootMargin
    observer.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let maxVisibility = 0;
        let mostVisibleTab = activeTab;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            mostVisibleTab = entry.target.id;
          }
        });

        // Only update if we found a more visible section
        if (maxVisibility > 0) {
          setActiveTab(mostVisibleTab);

          // Scroll active tab into view
          const tabElement = tabRefs.current[mostVisibleTab];
          if (tabElement) {
            tabElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    tabs.forEach((tab) => {
      const section = document.getElementById(tab);
      if (section) observer.current?.observe(section);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [tabs]);

  if (isLoading) return null;

  return (
    <div
      className="sticky top-[0px] p-2 md:p-0 z-20 w-full"
      style={backgroundStyle}
    >
      <div className="max-w-[1300px] mx-auto flex justify-between items-center">
        <div className="w-full md:w-[80%] overflow-x-auto no-scrollbar">
          <div className="flex gap-1 md:py-2">
            {tabs.map((item) => (
              <button
                key={item}
                ref={(el) => {
                  if (el) tabRefs.current[item] = el;
                }}
                onClick={() => handleTabClick(item)}
                className={`text-nowrap px-[10px] py-[12px] md:py-[16px] text-[14px] font-semibold leading-[1]
                transition-all duration-300 whitespace-nowrap rounded-full md:bg-transparent
                md:hover:text-[#FFC714]     ${
                  activeTab === item
                    ? "bg-[#FFF5D6] text-[#E5B30D] md:bg-transparent md:text-[#FFC714]"
                    : "bg-[#F5F5F5] text-black dark:text-gray-300 md:bg-transparent"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:w-[20%] md:flex justify-end px-4">
          <button
            onClick={() => dispatch(toggleCart(true))}
            className="bg-[#FFC714] text-white rounded-full px-6 py-2 flex items-center gap-2 group"
          >
            <span className="text-[16px] leading-[24px] flex items-center">
              Basket
              {cartData.cartProducts.length > 0 && (
                <>
                  <span className="mx-2 w-[1px] h-6 bg-gray-200"></span>
                  <span className="w-[24px] flex items-center justify-center relative">
                    <span className="absolute group-hover:opacity-0 transition-opacity">
                      {cartData.cartProducts.length}
                    </span>
                    <BsArrowRightShort
                      className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
                      size={24}
                    />
                  </span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Tabs);
