'use client';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { BsTwitterX, BsFacebook, BsLinkedin, BsWhatsapp } from 'react-icons/bs';
import { IoMdPaperPlane } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';

export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isModelShow, setIsModelShow] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyClick = (event: MouseEvent) => {
      if (!sectionRef.current?.contains(event.target as Node)) {
        if (isModelShow === true) setIsModelShow(false);
      }
    };

    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  }, [isModelShow]);

  const handleCopyUrl = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="relative">
      <p
        onClick={() => setIsModelShow(!isModelShow)}
        className="text-sm border border-gray-500 cursor-pointer flex gap-2 items-center bg-[#f1f1f1] p-1 px-2 rounded-md transition hover:scale-105"
      >
        <IoMdPaperPlane size={20} />
        <span>Share</span>
      </p>

      {isModelShow && (
        <div
          ref={sectionRef}
          className="space-y-4 absolute top-10 left-1/2 -translate-x-1/2 bg-[#f8f7fa] border border-gray-200 p-4 rounded-md"
        >
          <div className="space-x-8 flex justify-center items-center ">
            <TwitterShareButton url={url}>
              <BsTwitterX size={30} />
            </TwitterShareButton>
            <FacebookShareButton url={url}>
              <BsFacebook size={30} />
            </FacebookShareButton>
            <LinkedinShareButton url={url}>
              <BsLinkedin size={30} />
            </LinkedinShareButton>
            <WhatsappShareButton url={url}>
              <BsWhatsapp size={30} />
            </WhatsappShareButton>
          </div>
          <button
            disabled={copied}
            onClick={handleCopyUrl}
            className="w-full bg-black text-white rounded-md uppercase cursor-pointer hover:bg-black/70 p-2 disabled:bg-black/70 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      )}
    </div>
  );
}
