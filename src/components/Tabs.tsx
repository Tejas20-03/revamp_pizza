import React, { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useTheme } from "@/app/ThemeContext";

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
      ? scrollPosition > 0
        ? `rgba(32, 32, 32, ${Math.min(scrollPosition / 200, 0.7)})`
        : "rgba(32, 32, 32, 0.7)"
      : scrollPosition > 0
      ? `rgba(255, 255, 255, ${Math.min(scrollPosition / 200, 0.7)})`
      : "transparent",
    backdropFilter: scrollPosition > 0 ? "blur(2px)" : "none",
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
      className="sticky top-[0px] p-0 z-20 w-full"
      style={backgroundStyle}
    >
      <div className="max-w-[1700px] mx-auto px-4 md:pl-12 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 py-2">
          {tabs.map((item) => (
            <button
              key={item}
              ref={(el) => {
                if (el) tabRefs.current[item] = el;
              }}
              onClick={() => handleTabClick(item)}
              className={`text-nowrap rounded-[10px] px-[14px] py-[8px] text-[14px] shadow-[2px_5px_8px_rgba(0,0,0,0.08)] 
                transition-all duration-300 whitespace-nowrap 
                
                hover:shadow-[1px_7px_19px_0px_rgba(255,197,0,1)] dark:hover:bg-[#FFC714] hover:bg-[#FFC714] ${
                  activeTab === item
                    ? "bg-[#FFC714] dark:text-[#121212]"
                    : "bg-white dark:bg-[#121212] dark:text-white"
                } `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Tabs);
