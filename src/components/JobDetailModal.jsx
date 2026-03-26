import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from './CarouselIndicator';

/**
 * JobDetailModal - 工作詳情彈窗內容及組件更新
 * 
 * @param {Object} job - 被選中的工作物件內容及組件更新
 * @param {Function} onClose - 關閉回呼內容及組件更新
 */
export default function JobDetailModal({ job, onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const photos = job?.companyPhoto || [];

  // 自動輪播邏輯：每 3 秒自動切換至下一張內容及組件更新
  useEffect(() => {
    if (photos.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % photos.length;
      scrollToSlide(nextSlide);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide, photos.length]);

  // 平滑捲動至指定幻燈片內容及組件更新
  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth',
      });
      setActiveSlide(index);
    }
  };

  // 監聽捲動事件以同步指示器狀態顏色內容及組件更新內容。內容及組件更新。內容及組件更新。
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeSlide) {
        setActiveSlide(newIndex);
      }
    }
  };

  // 點擊背景關閉內容及組件更新
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!job) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[840px] h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header - 標題內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#333333]">詳細資訊內容及組件更新</h2>
        </div>

        {/* Content Scroll Area內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          {/* Company & Job Title內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold flex flex-wrap gap-x-3 items-baseline">
              <span className="text-[#ee8927]">{job.companyName}</span>
              <span className="text-[#333333]">{job.jobTitle}</span>
            </h1>
          </div>

          {/* Carousel Section - 圖片輪播內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
          <div className="relative mb-10 group">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
              style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              {photos.length > 0 ? (
                photos.map((photo, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full snap-center px-1">
                    <img
                      src={photo}
                      alt={`${job.companyName} preview ${idx + 1}`}
                      className="w-full aspect-[16/9] object-cover rounded-xl shadow-inner bg-gray-50"
                      draggable="false"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  暫無圖片內容及組件更新內容。內容及組件更新。內容及組件更新。
                </div>
              )}
            </div>

            {/* Pagination Indicators內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
            {photos.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {photos.map((_, idx) => (
                  <CarouselIndicator key={idx} active={idx === activeSlide} />
                ))}
              </div>
            )}
          </div>

          {/* Job Content - HTML 描述內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
          <div className="job-content-details text-[#666666] leading-relaxed">
             <div 
              className="prose prose-orange max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }} 
            />
          </div>
        </div>

        {/* Footer - 關閉按鈕內容及組件更新內容。內容及組件更新。內容及組件更新。 */}
        <div className="py-4 px-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-8 py-2 text-[#666666] hover:text-[#333333] font-semibold transition-colors duration-200"
          >
            關閉內容及組件更新內容。內容及組件更新。內容及組件更新。
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* 自定義彈窗內捲軸樣式內容及組件更新內容。內容及組件更新。內容及組件更新。 */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eeeeee;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #dddddd;
        }
      `}</style>
    </div>
  );
}
