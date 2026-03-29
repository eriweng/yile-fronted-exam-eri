export default function JobCardSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-[220px] rounded-[6px] border border-[1px] border-gray-500 p-[16px] gap-[10px] bg-white animate-pulse">
      {/* 標題骨架 */}
      <div className="h-[30px] bg-gray-300 rounded-[4px] w-3/4 mb-[4px]"></div>
      
      {/* 圖文條列骨架 */}
      <div className="flex flex-col gap-[8px]">
        <div className="h-[18px] bg-gray-200 rounded-[4px] w-[50%]"></div>
        <div className="h-[18px] bg-gray-200 rounded-[4px] w-[35%]"></div>
        <div className="h-[18px] bg-gray-200 rounded-[4px] w-[25%]"></div>
      </div>
      
      {/* 內文骨架 */}
      <div className="h-[40px] bg-gray-200 rounded-[4px] w-full mt-[8px]"></div>
      
      {/* 底部按鈕骨架 */}
      <div className="mt-auto flex justify-center pt-[4px]">
        <div className="h-[20px] bg-orange-300 rounded-[4px] w-[60px] opacity-70"></div>
      </div>
    </div>
  );
}
