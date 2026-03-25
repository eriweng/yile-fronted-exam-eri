import React from 'react';

const PersonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#808080"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#808080"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const MoneyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#808080"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1v22"></path>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function JobCard({
  companyName,
  jobTitle,
  education,
  salary,
  description,
}) {
  return (
    <div className="flex flex-col w-full min-h-[220px] rounded-[6px] border border-[1px] border-gray-500 p-[16px] gap-[10px] bg-white hover:shadow-custom-glow transition-shadow duration-200 cursor-pointer">
      <h5 className="text-display-5 font-bold text-gray-1000">{companyName}</h5>

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <PersonIcon />
          <span>{jobTitle}</span>
        </div>
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <BookIcon />
          <span>{education}</span>
        </div>
        <div className="flex items-center gap-[6px] text-gray-800 text-body-sm">
          <MoneyIcon />
          <span>{salary}</span>
        </div>
      </div>

      <p className="w-full text-body-sm text-gray-1000 line-clamp-2 gap-[8px]">
        {description}
      </p>

      <div className="text-center font-bold text-orange-700 text-body-sm gap-[8px]">
        查看細節
      </div>
    </div>
  );
}
