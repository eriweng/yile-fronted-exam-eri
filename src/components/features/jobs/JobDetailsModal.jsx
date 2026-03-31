import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from '../../common/CarouselIndicator';
import JobDetailsSkeleton from '../../common/JobDetailsSkeleton';

const BASE = import.meta.env.BASE_URL;

export default function JobDetailsModal({ job, onClose, isLoading }) {
  const hasPhotos = job.companyPhoto && job.companyPhoto.length > 0;
  const displayImages = hasPhotos ? job.companyPhoto : [null];
  const N = displayImages.length;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  // --- Scroll & Active Detection ---
  const handleScroll = () => {
    if (!carouselRef.current || !hasPhotos) return;
    const { scrollLeft: sLeft, clientWidth, scrollWidth } = carouselRef.current;
    
    // 預防 iOS 回彈產生負值，並確保在最左邊時必定是選中第一張 (無 padding 狀態下)
    if (sLeft <= 0) {
      setCurrentIndex(0);
      return;
    }
    
    // 如果捲動到了最底 (無 padding 狀態下)
    if (Math.ceil(sLeft + clientWidth) >= scrollWidth) {
      setCurrentIndex(N - 1);
      return;
    }

    // 中間項目中心點判定 (致中邏輯)
    const containerCenter = sLeft + clientWidth / 2;
    let closestIdx = currentIndex;
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

  // 點擊指示點與自動輪播滾動 (帶有 snap-center)
  const scrollTo = (index) => {
    if (!slideRefs.current[index]) return;
    // 使用原生行為，邊緣時自動靠齊左/右界，中間的對象自動居中
    slideRefs.current[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  // 自動輪播
  useEffect(() => {
    if (N <= 1 || isDragging) return;
    const timer = setInterval(() => {
      const next = (currentIndex + 1) % N;
      scrollTo(next);
    }, 3000);
    return () => clearInterval(timer);
  }, [N, isDragging, currentIndex]);

  // --- 滑鼠與觸控拖曳邏輯 ---
  const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

  const handleStart = (e) => {
    if (N <= 1) return;
    setIsDragging(true);
    setStartX(getX(e));
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const x = getX(e);
    const walk = x - startX; // 移動量
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // 背景點擊關閉
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
                  className={`flex w-full h-[150px] gap-[8px] ${hasPhotos ? 'overflow-x-auto snap-x snap-mandatory' : 'overflow-hidden justify-center'} scroll-smooth cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden`}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={handleScroll}
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                >
                  {displayImages.map((img, idx) => (
                    <div
                      key={idx}
                      ref={(el) => (slideRefs.current[idx] = el)}
                      className="w-[250px] h-[150px] flex-shrink-0 snap-center select-none overflow-hidden"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                          draggable="false"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 pointer-events-none">
                          <span className="text-gray-400 text-body-lg font-medium">
                            暫無圖片
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 只有多張圖片時才顯示指示點 */}
                {hasPhotos && N > 1 && (
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
