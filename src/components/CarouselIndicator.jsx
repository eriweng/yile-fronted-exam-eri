import React from 'react';

/**
 * CarouselIndicator - 自動輪播的分頁指示器元件內容及組件更新
 * 
 * @param {boolean} active - 是否為當前選中狀態內容及組件更新
 * 
 * 規格：內容及組件更新
 * - false (未選中): 寬 6px, 高 6px, 圓角 18px, 顏色 gray/500
 * - true (已選中): 寬 24px, 高 6px, 圓角 18px, 顏色 orange/700
 */
export default function CarouselIndicator({ active }) {
  return (
    <div
      className={`h-[6px] rounded-[18px] transition-all duration-300 ${
        active ? 'w-[24px] bg-orange-700' : 'w-[6px] bg-gray-500'
      }`}
    />
  );
}
