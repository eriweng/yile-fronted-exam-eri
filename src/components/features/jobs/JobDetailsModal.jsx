import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from '../../common/CarouselIndicator';
import JobDetailsSkeleton from '../../common/JobDetailsSkeleton';

const BASE = import.meta.env.BASE_URL;

export default function JobDetailsModal({ job, onClose, isLoading }) {
  const hasPhotos = job.companyPhoto && job.companyPhoto.length > 0;

  // 若沒圖片，陣列放一個 [null] 確保 map 能執行一次來渲染「暫無圖片」
  const displayImages = hasPhotos ? job.companyPhoto : [null];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  // 每個 slide 的 ref，用於精準 scrollIntoView
  const slideRefs = useRef([]);

  const scrollTo = (index) => {
    if (!slideRefs.current[index]) return;
    slideRefs.current[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    setCurrentIndex(index);
  };

  // 拖曳與滾動邏輯 (僅在有圖片時啟用)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!hasPhotos) return;
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
    if (!carouselRef.current || !hasPhotos) return;
    // 比較每張圖的中心與容器中心的距離，找出最靠近的那張
    const containerCenter =
      carouselRef.current.scrollLeft + carouselRef.current.offsetWidth / 2;
    let closestIdx = 0;
    let minDist = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(elCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });
    setCurrentIndex(closestIdx);
  };

  // 自動輪播邏輯：只有在多張圖片時才執行
  useEffect(() => {
    if (isDragging || !hasPhotos || displayImages.length <= 1) return;
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % displayImages.length;
      scrollTo(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayImages.length, isDragging, hasPhotos, currentIndex]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] min-h-screen bg-black/50 flex items-center justify-center px-[16px]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full h-full max-w-[750px] max-h-[768px] rounded-[4px] shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-[24px] py-[16px] border-b border-gray-300">
          <h3 className="text-display-5 font-bold text-gray-1000">詳細資訊</h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <JobDetailsSkeleton />
          ) : (
            <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="text-display-5 font-bold text-gray-1000">
                  {job.companyName || 'Unknown'}
                </h2>
                <p className="text-display-6 text-gray-1000">{job.jobTitle}</p>
              </div>

              {/* Carousel 區域 */}
              <div className="relative w-full pb-[28px] mt-[-8px]">
                <div
                  ref={carouselRef}
                  className={`flex w-full h-[150px] gap-[12px] ${hasPhotos ? 'overflow-x-auto snap-x snap-mandatory' : 'overflow-hidden justify-center'} scroll-smooth [&::-webkit-scrollbar]:hidden`}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // 動態計算左右 padding 讓首尾圖片能置中：(100% - 圖片寬度) / 2
                    paddingLeft: hasPhotos ? 'calc((100% - 250px) / 2)' : '0',
                    paddingRight: hasPhotos ? 'calc((100% - 250px) / 2)' : '0',
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onScroll={handleScroll}
                >
                  {displayImages.map((img, idx) => (
                    <div
                      key={idx}
                      ref={(el) => (slideRefs.current[idx] = el)}
                      className="w-[250px] h-[150px] flex-shrink-0 snap-center select-none rounded-[8px] overflow-hidden"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                          draggable="false"
                          loading="lazy"
                        />
                      ) : (
                        /* 垂直水平置中的「暫無圖片」 */
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-body-lg font-medium">
                            暫無圖片
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 只有多張圖片時才顯示指示點 */}
                {hasPhotos && displayImages.length > 1 && (
                  <div className="absolute bottom-[12px] left-0 w-full flex justify-center gap-[6px]">
                    {displayImages.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => scrollTo(i)}
                        className="cursor-pointer p-1"
                      >
                        <CarouselIndicator active={i === currentIndex} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 工作內容 */}
              <div className="flex flex-col gap-[12px]">
                <h4 className="text-display-6 font-bold text-gray-1100">
                  工作內容
                </h4>
                <div
                  className="text-gray-800 text-body-lg leading-relaxed [&_h1]:text-body-lg [&_h1]:font-bold [&_h2]:text-body-lg [&_h2]:font-bold [&_h3]:text-body-lg [&_h3]:font-bold [&_p]:text-body-lg [&_li]:text-body-lg [&_a]:text-body-lg"
                  dangerouslySetInnerHTML={{
                    __html: job.description || '無詳細工作內容',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-[24px] py-[16px] border-t border-gray-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-body-lg text-gray-1000 hover:text-gray-800 cursor-pointer transition-colors transform hover:scale-110 duration-300 ease-out"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
