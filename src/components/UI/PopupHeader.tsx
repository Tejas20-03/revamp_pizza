import React from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface PopupHeaderProps {
  onClose: () => void;
  showLogo?: boolean;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ onClose, showLogo = true }) => {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#202020] flex justify-between items-center p-2">
      {showLogo && (
        <div className="left-4 top-4">
          <Image
            src="/assets/broadwayPizzaLogo.png"
            alt="Broadway Pizza Logo"
            width={120}
            height={53}
            quality={100}
          />
        </div>
      )}
      <button
        onClick={onClose}
        className="right-4 top-4 p-2 bg-[var(--primary-light)] dark:text-white rounded-full transition-colors"
      >
        <IoClose size={24} />
      </button>
    </div>
  );
};

export default PopupHeader;
