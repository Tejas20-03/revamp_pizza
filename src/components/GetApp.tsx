"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface GetAppProps {
  showFullContent?: boolean;
  isFooter?: boolean;
}

const GetApp: React.FC<GetAppProps> = ({
  showFullContent = true,
  isFooter = false,
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (pathname === "/profile" || pathname === "/cart" || pathname === "/place-order" || pathname === '/thankyou') {
    return null;
  }

  if (isFooter) {
    return (
      <div className="w-full py-5 bottom-0 left-0 bg-white dark:bg-[#121212] z-40">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative w-full pl-24 box-border">
              <Image
                alt="mobile app"
                src="/mobile.png"
                className="absolute left-0 w-[56px] h-auto"
                width={146}
                height={232}
              />
              <h2 className="text-[20px] font-semibold mt-1 mb-0 text-[#1BA5AF]">
                Get the App!
              </h2>
              <p className="my-1 opacity-50 max-w-[260px] text-[14px] dark:text-white">
                App is where the fun is! It's Easy, Fast and Convenient.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 items-start mt-2">
                <Link href="https://play.google.com/store/apps/details?id=com.broadwaypizza.app">
                  <Image
                    alt="Google Play"
                    src="/google-play.png"
                    className="w-[120px] h-auto"
                    width={316}
                    height={96}
                  />
                </Link>
                <Link href="https://apps.apple.com/tt/app/broadway-pizza-official/id1559366003">
                  <Image
                    alt="App Store"
                    src="/apple.png"
                    className="w-[120px] h-auto"
                    width={324}
                    height={100}
                  />
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="text-[14px] opacity-50 md:text-left text-center max-w-[600px] dark:text-white">
                Copyright © Broadway Pizza Pakistan [J & S CORPORATION]. All
                rights reserved. Created and managed with care by{" "}
                <Link
                  href={"https://megnus.app"}
                  target="_blank"
                  className="font-bold text-[#4b0082] text-bold"
                >
                  Megnus
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showFullContent) {
    return (
      <div className="max-w-[1700px] mx-auto px-2">
        <div className="flex justify-between items-center p-[18px] mt-[10px] w-full rounded bg-[var(--primary-light)]">
          <h2 className="text-[20px] font-bold dark:text-white">Get the App!</h2>
          <div className="mr-2">
            {isIOS ? (
              <Link href="https://apps.apple.com/tt/app/broadway-pizza-official/id1559366003">
                <Image
                  alt="App Store"
                  src="/apple.png"
                  width={100}
                  height={30}
                />
              </Link>
            ) : (
              <Link href="https://play.google.com/store/apps/details?id=com.broadwaypizza.app">
                <Image
                  alt="Google Play"
                  src="/google-play.png"
                  width={100}
                  height={30}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GetApp;
