import React, { useState, useEffect, useRef } from 'react';
import CarouselIndicator from '../../common/CarouselIndicator';
import JobDetailsSkeleton from '../../common/JobDetailsSkeleton';

const BASE = import.meta.env.BASE_URL;

export default function JobDetailsModal({ job, onClose, isLoading }) {
  const hasPhotos = job.companyPhoto && job.companyPhoto.length > 0;
  const originalImages = hasPhotos ? job.companyPhoto : [null];
  const N = originalImages.length;
  
  // 若有多張圖片，複製三份製造「無限循環」陣列 [ ...原圖, ...原圖, ...原圖 ]
  const displayImages = N > 1 ? [...originalImages, ...originalImages, ...originalImages] : originalImages;

  // 無限輪播起始點設定在中間那個區塊的第一張 (即 index = N)
  const [currentIndex, setCurrentIndex] = useState(N > 1 ? N : 0);
  const [hasTransition, setHasTransition] = useState(true);

  // 拖曳狀態
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // --- 無縫切換 (Infinite Loop) 邏輯 ---
  const handleTransitionEnd = () => {
    if (N <= 1) return;
    // 如果滑到了最前面的複製區塊
    if (currentIndex < N) {
      setHasTransition(false); // 關閉動畫
      setCurrentIndex(currentIndex + N); // 瞬間跳回中間區塊的對應位置
    } 
    // 如果滑到了最後面的複製區塊
    else if (currentIndex >= 2 * N) {
      setHasTransition(false);
      setCurrentIndex(currentIndex - N);
    }
  };

  // 每次跳轉(沒有動畫的瞬間)結束後，需要把動畫加回來
  useEffect(() => {
    if (!hasTransition) {
      const timer = setTimeout(() => {
        setHasTransition(true);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [hasTransition]);

  // --- 自動輪播 ---
  useEffect(() => {
    if (N <= 1 || isDragging) return;
    const interval = setInterval(() => {
      setHasTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [N, isDragging]);

  // --- 滑鼠與觸控拖曳邏輯 ---
  const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

  const handleStart = (e) => {
    if (N <= 1) return;
    setIsDragging(true);
    setStartX(getX(e));
    setDragOffset(0);
    setHasTransition(false); // 拖曳時關閉動畫，跟從手指/滑鼠
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    setDragOffset(getX(e) - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setHasTransition(true);
    
    // 依據拖曳距離決定翻頁方向
    if (dragOffset > 50) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragOffset < -50) {
      setCurrentIndex((prev) => prev + 1);
    }
    setDragOffset(0);
  };

  // --- 指示點點擊 ---
  const scrollToOriginal = (origIndex) => {
    setHasTransition(true);
    // 強制跳轉至中間正常區塊的該對應圖片
    setCurrentIndex(N + origIndex);
  };

  // 背景點擊關閉
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 顯示下方的活耀點
  const activeIndicator = currentIndex % N;

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
                {/* 輪播視窗：取消原生捲動與 Padding，只保留溢位隱藏 */}
                <div className="relative w-full h-[150px] overflow-hidden rounded-[8px]">
                  {/* 使用 CSS Transform 移動整條軌道 */}
                  <div
                    className="absolute left-1/2 flex h-full gap-[8px] cursor-grab active:cursor-grabbing"
                    style={{
                      // 置中數學公式：-(自身圖片一半寬度 125px) - (累積的寬度含 gap：258 * Index) + 拖曳偏移
                      transform: `translateX(calc(${-125 - currentIndex * 258 + dragOffset}px))`,
                      transition: hasTransition ? 'transform 0.3s ease-out' : 'none',
                      width: 'max-content',
                      touchAction: 'pan-y' // 允許原生的上下捲動，但橫向讓程式接管 
                    }}
                    onTransitionEnd={handleTransitionEnd}
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
                        className="w-[250px] h-[150px] flex-shrink-0 select-none overflow-hidden"
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
                </div>

                {/* 只有多張圖片時才顯示指示點 */}
                {hasPhotos && N > 1 && (
                  <div className="absolute bottom-[12px] left-0 w-full flex justify-center gap-[6px]">
                    {originalImages.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => scrollToOriginal(i)}
                        className="cursor-pointer p-1"
                      >
                        <CarouselIndicator active={i === activeIndicator} />
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
