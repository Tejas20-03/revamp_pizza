import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import StoriesViewer from "./StoriesViewer";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Story {
  id: number;
  coverImage: string;
  title: string;
  visited: boolean;
  stories: {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    duration: number;
  }[];
}

const stories: Story[] = [
  {
    id: 1,
    coverImage: "/stories/story1.webp",
    title: "New Deals",
    visited: false,
    stories: [
      {
        id: "s1",
        mediaUrl: "/stories/story1.webp",
        mediaType: "image",
        duration: 3000,
      },
      {
        id: "s2",
        mediaUrl: "/stories/video1.mp4",
        mediaType: "video",
        duration: 0,
      },
    ],
  },
  {
    id: 2,
    coverImage: "/stories/story2.webp",
    title: "Special Offers",
    visited: false,
    stories: [
      {
        id: "s3",
        mediaUrl: "/stories/story2.webp",
        mediaType: "image",
        duration: 3000,
      },
      {
        id: "s4",
        mediaUrl: "/stories/video2.mp4",
        mediaType: "video",
        duration: 0,
      },
    ],
  },
  {
    id: 3,
    coverImage: "/stories/story3.webp",
    title: "Combos",
    visited: false,
    stories: [
      {
        id: "s5",
        mediaUrl: "/stories/story3.webp",
        mediaType: "image",
        duration: 3000,
      },
      {
        id: "s6",
        mediaUrl: "/stories/video3.mp4",
        mediaType: "video",
        duration: 0,
      },
    ],
  },
  {
    id: 4,
    coverImage: "/stories/story4.webp",
    title: "Family Deals",
    visited: false,
    stories: [
      {
        id: "s7",
        mediaUrl: "/stories/story4.webp",
        mediaType: "image",
        duration: 3000,
      },
    ],
  },
  {
    id: 5,
    coverImage: "/stories/story5.webp",
    title: "Party Pack",
    visited: false,
    stories: [
      {
        id: "s8",
        mediaUrl: "/stories/story5.webp",
        mediaType: "image",
        duration: 3000,
      },
    ],
  },
  {
    id: 6,
    coverImage: "/stories/story6.webp",
    title: "Party Pack",
    visited: false,
    stories: [
      {
        id: "s9",
        mediaUrl: "/stories/story6.webp",
        mediaType: "image",
        duration: 3000,
      },
    ],
  },
  {
    id: 7,
    coverImage: "/stories/story7.webp",
    title: "Party Pack",
    visited: false,
    stories: [
      {
        id: "s10",
        mediaUrl: "/stories/story7.webp",
        mediaType: "image",
        duration: 3000,
      },
    ],
  },
  {
    id: 8,
    coverImage: "/stories/story8.webp",
    title: "Party Pack",
    visited: false,
    stories: [
      {
        id: "s11",
        mediaUrl: "/stories/story8.webp",
        mediaType: "image",
        duration: 3000,
      },
    ],
  },
];

const StoriesCard = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );
  const [storyData, setStoryData] = useState<Story[]>(stories);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkForArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkForArrows();
    window.addEventListener("resize", checkForArrows);
    return () => window.removeEventListener("resize", checkForArrows);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    const updatedStories = [...storyData];
    updatedStories[index].visited = true;
    setStoryData(updatedStories);
  };

  const handleCloseStories = () => {
    setSelectedStoryIndex(null);
  };

  return (
    <>
      <div className="relative max-w-[1300px] mx-auto px-2 sm:px-4">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="hidden sm:absolute sm:block -left-8 top-1/2 -translate-y-1/2 z-10 text-[#FFC714] font-bold"
          >
            <IoIosArrowBack size={40} />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="hidden sm:absolute sm:block -right-8 top-1/2 -translate-y-1/2 z-10 text-[#FFC714] font-bold"
          >
            <IoIosArrowForward size={40} />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex gap-1 md:gap-3 pb-4 pt-2 overflow-x-auto scrollbar-hide"
          onScroll={checkForArrows}
        >
          {" "}
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => handleStoryClick(index)}
            >
              <div
                className={`
      h-[110px] w-[80px]
      sm:h-[254px] sm:w-[190px] // Desktop dimensions
      rounded-3xl overflow-hidden 
    `}
              >
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  width={100}
                  height={100}
                  className={`
                    w-full h-full object-cover 
                    transition-transform duration-300 
                    ${story.visited ? "opacity-70" : "opacity-100"}
                  `}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <StoriesViewer
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={handleCloseStories}
        />
      )}
    </>
  );
};

export default StoriesCard;
