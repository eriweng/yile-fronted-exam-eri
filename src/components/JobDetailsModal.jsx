import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from './CarouselIndicator';

const BASE = import.meta.env.BASE_URL;

export default function JobDetailsModal({ job, onClose }) {
  // 使用現有圖檔作為輪播圖預設佔位
  const images = [
    `${BASE}hero-bg.png`,
    `${BASE}hero-silhouette.png`,
    `${BASE}hero-character.png`,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // 滑鼠拖曳狀態
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startX;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // 滾動同步 Index
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollPosition = carouselRef.current.scrollLeft;
    const slideWidth = carouselRef.current.offsetWidth;
    const index = Math.round(scrollPosition / slideWidth);
    setCurrentIndex(index);
  };

  // 自動輪播
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        if (carouselRef.current) {
          const slideWidth = carouselRef.current.offsetWidth;
          carouselRef.current.scrollTo({
            left: next * slideWidth,
            behavior: 'smooth',
          });
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, isDragging]);

  // 背景點擊關閉視窗
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-[16px] transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[500px] h-full max-h-[90vh] md:h-auto md:max-h-[90vh] rounded-[16px] shadow-lg flex flex-col overflow-hidden transform transition-transform">
        
        {/* Header */}
        <div className="px-[24px] py-[16px] border-b border-gray-300">
          <h3 className="text-display-5 font-bold text-gray-1000">詳細資訊</h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">
            {/* Title Section */}
            <div>
              <h2 className="text-display-3 font-bold text-gray-1000 mb-[4px]">
                {job.companyName}
              </h2>
              <p className="text-body-lg text-gray-1000">{job.jobTitle}</p>
            </div>

            {/* Carousel */}
            <div className="relative w-full aspect-[16/10] rounded-[8px] overflow-hidden bg-gray-200">
              <div
                ref={carouselRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onScroll={handleScroll}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
              >
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover flex-shrink-0 snap-center select-none"
                    draggable="false"
                  />
                ))}
              </div>
              
              <div className="absolute bottom-[12px] left-0 w-full flex justify-center gap-[6px]">
                {images.map((_, i) => (
                  <CarouselIndicator active={i === currentIndex} key={i} />
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-display-5 font-bold text-gray-1000">工作內容</h4>
              <div className="text-body-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                【職位：{job.jobTitle}】<br /><br />
                【工作地點：公司總部 - 台北市】<br /><br />
                【職責與要求】<br />
                {job.description}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-[24px] py-[16px] border-t border-gray-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-[24px] py-[8px] text-gray-1000 bg-white border border-[1px] border-gray-500 hover:bg-gray-100 rounded-[6px] text-body-lg transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
