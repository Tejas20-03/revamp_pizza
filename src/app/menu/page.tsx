import React from "react";
import Image from "next/image";
import { getMenuImage } from "@/services/Home/services";
import DownloadButton from "@/components/Navigation/DownloadButton";

export default async function Menu() {
  const data = await getMenuImage({});

  return (
    <div className="w-full px-4 flex flex-col items-center justify-center">
      {/* Download Button */}
      <div className="w-full flex justify-center mb-4">
        <DownloadButton />
      </div>

      {/* Image Container */}
      <div className="w-full max-w-[750px] px-2">
        <Image
          className="w-full h-auto object-contain"
          width={800}
          height={4948}
          //@ts-ignore
          src={data?.Data[0]?.value || ""}
          alt="menu"
          priority
        />
      </div>
    </div>
  );
}
