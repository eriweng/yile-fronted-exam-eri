const BASE = import.meta.env.BASE_URL;

const PersonIcon = () => (
  <img src={`${BASE}person-outline.png`} className="w-[18px] h-[18px]" alt="" />
);

const BookIcon = () => (
  <img src={`${BASE}book-outline.png`} className="w-[18px] h-[18px]" alt="" />
);

const MoneyIcon = () => (
  <img src={`${BASE}coin-outline.png`} className="w-[18px] h-[18px]" alt="" />
);

export default function JobCard({
  job,
  education,
  salary,
  onViewDetails,
}) {
  const { companyName, jobTitle, preview } = job;
  
  return (
    <div 
      className="flex flex-col w-full min-h-[220px] rounded-[6px] border border-[1px] border-gray-500 p-[16px] gap-[10px] bg-white hover:shadow-custom-glow transition-shadow duration-200 cursor-pointer group"
      onClick={() => onViewDetails?.(job)}
    >
      <h5 className="text-display-5 font-bold text-gray-1000 group-hover:text-[#ee8927] transition-colors">{companyName}</h5>

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <PersonIcon />
          <span className="items-center">{jobTitle}</span>
        </div>
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <BookIcon />
          <span className="items-center">{education}</span>
        </div>
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <MoneyIcon />
          <span className="items-center -ml-[1px]">{salary}</span>
        </div>
      </div>

      <p className="w-full h-[40px] text-body-sm text-gray-1000 line-clamp-2">
        {preview}
      </p>

      <div className="text-center font-bold text-[#ee8927] text-body-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
        查看細節內容及組件更新
      </div>
    </div>
  );
}
