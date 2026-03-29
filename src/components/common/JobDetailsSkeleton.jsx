import React from 'react';

export default function JobDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-[20px] px-[24px] py-[20px] animate-pulse">
      {/* 標題骨架 (公司名 與 職稱) */}
      <div className="flex items-center gap-[8px]">
        <div className="h-[30px] bg-gray-300 rounded-[4px] w-[150px]"></div>
        <div className="h-[24px] bg-gray-200 rounded-[4px] w-[100px]"></div>
      </div>

      {/* 輪播區域骨架 */}
      <div className="relative w-full pb-[28px] mt-[-8px]">
        <div className="flex w-full h-[150px] gap-[12px] overflow-hidden">
          <div className="w-[250px] h-[150px] flex-shrink-0 bg-gray-200 rounded-[8px]"></div>
          <div className="w-[250px] h-[150px] flex-shrink-0 bg-gray-100 rounded-[8px]"></div>
          <div className="w-[250px] h-[150px] flex-shrink-0 bg-gray-50 rounded-[8px]"></div>
        </div>
        {/* 指示點骨架 */}
        <div className="absolute bottom-[12px] left-0 w-full flex justify-center gap-[6px]">
          <div className="w-[8px] h-[8px] rounded-full bg-gray-200"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-gray-200"></div>
          <div className="w-[8px] h-[8px] rounded-full bg-gray-200"></div>
        </div>
      </div>

      {/* 工作內容標題骨架 */}
      <div className="flex flex-col gap-[12px]">
        <div className="h-[24px] bg-gray-300 rounded-[4px] w-[80px]"></div>
        {/* 多行內文骨架 */}
        <div className="flex flex-col gap-[8px]">
          <div className="h-[18px] bg-gray-200 rounded-[4px] w-full"></div>
          <div className="h-[18px] bg-gray-200 rounded-[4px] w-[95%]"></div>
          <div className="h-[18px] bg-gray-200 rounded-[4px] w-[90%]"></div>
          <div className="h-[18px] bg-gray-200 rounded-[4px] w-[98%]"></div>
          <div className="h-[18px] bg-gray-200 rounded-[4px] w-[85%]"></div>
        </div>
      </div>
    </div>
  );
}
