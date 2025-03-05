import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory.stories[currentImageIndex];

  const handleMediaEnd = () => {
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
  };

  useEffect(() => {
    if (currentMedia.mediaType === 'image') {
      const duration = currentMedia.duration;
      const interval = 100;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setProgress((currentStep / steps) * 100);

        if (currentStep >= steps) {
          handleMediaEnd();
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [currentMedia, currentImageIndex, currentStoryIndex]);

  useEffect(() => {
    if (videoRef.current && currentMedia.mediaType === 'video') {
      videoRef.current.currentTime = 0;
      videoRef.current.play();

      const updateProgress = () => {
        if (videoRef.current) {
          const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setProgress(progress);
        }
      };

      videoRef.current.addEventListener('timeupdate', updateProgress);
      videoRef.current.addEventListener('ended', handleMediaEnd);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', updateProgress);
          videoRef.current.removeEventListener('ended', handleMediaEnd);
        }
      };
    }
  }, [currentMedia]);

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
      handleMediaEnd();
    }
  };

  const renderMedia = () => {
    if (currentMedia.mediaType === 'video') {
      return (
        <video
          ref={videoRef}
          src={currentMedia.mediaUrl}
          className="w-full h-full object-contain"
          playsInline
          muted
          autoPlay
        />
      );
    }
    return (
      <Image
        src={currentMedia.mediaUrl}
        alt={currentStory.title}
        fill
        className="object-contain"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{
          backgroundImage: `url(${currentMedia.mediaUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.3)",
        }}
      />

      <div className="relative md:w-[400px] md:h-[600px] w-full h-full bg-black rounded-xl overflow-hidden z-10">
        {currentStoryIndex > 0 && (
          <button
            onClick={() => {
              setCurrentStoryIndex((prev) => prev - 1);
              setCurrentImageIndex(0);
              setProgress(0);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-[#FFC714] font-bold"
          >
            <IoIosArrowBack size={40} />
          </button>
        )}

        {currentStoryIndex < stories.length - 1 && (
          <button
            onClick={() => {
              setCurrentStoryIndex((prev) => prev + 1);
              setCurrentImageIndex(0);
              setProgress(0);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-[#FFC714] font-bold"
          >
            <IoIosArrowForward size={40} />
          </button>
        )}
        
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

          {renderMedia()}
        </div>
      </div>
    </div>
  );
};

export default StoriesViewer;
