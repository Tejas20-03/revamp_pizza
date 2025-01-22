import { useState } from "react";
import Image from "next/image";
import StoriesViewer from "./StoriesViewer";

interface Story {
  id: number;
  coverImage: string;
  title: string;
  visited: boolean;
  stories: {
    id: string;
    image: string;
    duration: number;
  }[];
}

const stories: Story[] = [
  {
    id: 1,
    coverImage: "/stories/story1.jpeg",
    title: "New Deals",
    visited: false,
    stories: [
      { id: "s1", image: "/stories/story1.jpeg", duration: 3000 },
      { id: "s2", image: "/stories/story2.jpg", duration: 3000 },
    ],
  },
  {
    id: 2,
    coverImage: "/stories/story2.jpg",
    title: "Special Offers",
    visited: false,
    stories: [
      { id: "s3", image: "/stories/story1.jpeg", duration: 3000 },
      { id: "s4", image: "/stories/story2.jpg", duration: 3000 },
    ],
  },
  {
    id: 3,
    coverImage: "/stories/story1.jpeg",
    title: "Combos",
    visited: false,
    stories: [{ id: "s5", image: "/stories/story1.jpeg", duration: 3000 }],
  },
  {
    id: 4,
    coverImage: "/stories/story2.jpg",
    title: "Family Deals",
    visited: false,
    stories: [{ id: "s6", image: "/stories/story1.jpeg", duration: 3000 }],
  },
  {
    id: 5,
    coverImage: "/stories/story1.jpeg",
    title: "Party Pack",
    visited: false,
    stories: [{ id: "s7", image: "/stories/story2.jpg", duration: 3000 }],
  },
];

const StoriesCard = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );
  const [storyData, setStoryData] = useState<Story[]>(stories);

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
      <div className="md:hidden overflow-x-auto px-4">
        <div className="flex gap-2 pb-2">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-shrink-0 w-[72px] cursor-pointer"
              onClick={() => handleStoryClick(index)}
            >
              <div className="w-[72px] h-[100px] rounded-2xl overflow-hidden">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  width={72}
                  height={100}
                  className="w-full h-full object-cover"
                />
                {story.visited && (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-500/30 to-gray-700/30 transition-all duration-300" />
                )}
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
