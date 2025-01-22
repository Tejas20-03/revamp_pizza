import { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface StoriesViewerProps {
  stories: any[];
  initialStoryIndex: number;
  onClose: () => void;
}

const StoriesViewer = ({
  stories,
  initialStoryIndex,
  onClose,
}: StoriesViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const currentImage = currentStory.stories[currentImageIndex];

  useEffect(() => {
    const duration = currentImage.duration;
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        if (currentImageIndex < currentStory.stories.length - 1) {
          setCurrentImageIndex((prev) => prev + 1);
          setProgress(0);
        } else if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex((prev) => prev + 1);
          setCurrentImageIndex(0);
          setProgress(0);
        } else {
          onClose();
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [
    currentImage,
    currentImageIndex,
    currentStoryIndex,
    currentStory.stories.length,
    stories.length,
    onClose,
  ]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;

    if (touch.clientX < screenWidth / 2) {
      if (currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      } else if (currentStoryIndex > 0) {
        setCurrentStoryIndex((prev) => prev - 1);
        setCurrentImageIndex(stories[currentStoryIndex - 1].stories.length - 1);
      }
    } else {
      if (currentImageIndex < currentStory.stories.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      } else if (currentStoryIndex < stories.length - 1) {
        setCurrentStoryIndex((prev) => prev + 1);
        setCurrentImageIndex(0);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white"
      >
        <IoClose size={24} />
      </button>

      <div className="w-full h-full relative" onTouchStart={handleTouchStart}>
        <div className="absolute top-0 left-0 right-0 z-20 p-2 flex gap-1">
          {currentStory.stories.map((_: any, index: number) => (
            <div
              key={index}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: `${
                    index === currentImageIndex
                      ? progress
                      : index < currentImageIndex
                      ? "100"
                      : "0"
                  }%`,
                }}
              />
            </div>
          ))}
        </div>

        <Image
          src={currentImage.image}
          alt={currentStory.title}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default StoriesViewer;
