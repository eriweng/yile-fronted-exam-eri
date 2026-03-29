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
  companyName,
  jobTitle,
  education,
  salary,
  description,
  onClick,
}) {
  return (
    <div className="flex flex-col w-full min-h-[220px] rounded-[6px] border border-[1px] border-gray-500 p-[16px] gap-[10px] bg-white hover:shadow-custom-glow transition-shadow duration-200">
      <h5 className="text-display-5 font-bold text-gray-1000">{companyName}</h5>
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
        {description}
      </p>
      <div
        className="text-center font-bold text-orange-700 text-body-sm mt-auto cursor-pointer transform transition-colors hover:scale-110 duration-300 ease-out"
        onClick={onClick}
      >
        查看細節
      </div>
    </div>
  );
}
