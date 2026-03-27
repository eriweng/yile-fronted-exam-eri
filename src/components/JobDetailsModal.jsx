import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from './CarouselIndicator';

const BASE = import.meta.env.BASE_URL;

// 把輔助函式放在組件外，避免每次渲染都重新定義
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export default function JobDetailsModal({ job, onClose }) {

  const companyName = job.companyName || 'Unknown';
  const initial = companyName.charAt(0).toUpperCase();
  const bgColor = stringToColor(companyName);


  // 如果沒圖片，我們放一個 [null] 作為佔位符標記
  const hasPhotos = job.companyPhoto && job.companyPhoto.length > 0;
  const displayImages = hasPhotos ? job.companyPhoto : [null];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // ── 拖曳與滾動邏輯 ─────────────────────────────
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!hasPhotos) return; // 沒圖片就不需要拖曳
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !hasPhotos) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startX;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollPosition = carouselRef.current.scrollLeft;
    const slideWidth = carouselRef.current.offsetWidth;
    const index = Math.round(scrollPosition / slideWidth);
    setCurrentIndex(index);
  };

  // 3. 自動輪播邏輯：只有在有圖片時才跑
  useEffect(() => {
    if (isDragging || !hasPhotos || displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % displayImages.length;
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
  }, [displayImages.length, isDragging, hasPhotos]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-gray-1000/50 flex items-center justify-center p-[16px]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[500px] h-full max-h-[768px] rounded-[16px] shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-[24px] py-[16px] border-b border-gray-300">
          <h3 className="text-display-5 font-bold text-gray-1000">詳細資訊</h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[8px]">
              <h2 className="text-display-5 font-bold text-gray-1000">
                {companyName}
              </h2>
              <p className="text-display-6 text-gray-1000">{job.jobTitle}</p>
            </div>

            {/* Carousel 區域 */}
            <div className="relative w-full aspect-[16/10] rounded-[8px] overflow-hidden bg-gray-100">
              <div
                ref={carouselRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onScroll={handleScroll}
              >
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full flex-shrink-0 snap-center select-none"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        draggable="false"
                      />
                    ) : (
                      /* 專業 UX 提升：沒圖片時顯示縮寫頭像 */
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-50">
                        <div
                          style={{ backgroundColor: bgColor }}
                          className="flex items-center justify-center rounded-full text-white text-4xl font-bold w-24 h-24 shadow-lg"
                        >
                          {initial}
                        </div>
                        <p className="text-gray-400 text-sm">暫無公司照片</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 只有多張圖片時才顯示指示點 */}
              {hasPhotos && displayImages.length > 1 && (
                <div className="absolute bottom-[12px] left-0 w-full flex justify-center gap-[6px]">
                  {displayImages.map((_, i) => (
                    <CarouselIndicator active={i === currentIndex} key={i} />
                  ))}
                </div>
              )}
            </div>

            {/* 工作內容 */}
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-display-6 font-bold text-gray-1100">工作內容</h4>
              <div
                className="text-gray-800 text-body-lg leading-relaxed [&_h1]:text-body-lg [&_h1]:font-bold [&_h2]:text-body-lg [&_h2]:font-bold [&_h3]:text-body-lg [&_h3]:font-bold [&_p]:text-body-lg [&_li]:text-body-lg [&_a]:text-body-lg"
                dangerouslySetInnerHTML={{
                  __html: job.description || '無詳細工作內容',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-[24px] py-[16px] border-t border-gray-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
