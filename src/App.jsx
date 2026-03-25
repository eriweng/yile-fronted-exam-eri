import { useState, useEffect } from 'react';
import JobCard from './components/JobCard';
import SelectField from './components/SelectField';
import InputField from './components/InputField';
import { getJobs, getEducationLevels, getSalaryLevels } from './api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1440);
  const [educationLevels, setEducationLevels] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);
  const [filterEducation, setFilterEducation] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  useEffect(() => {
    // 取得學歷與薪資等級清單
    Promise.all([getEducationLevels(), getSalaryLevels()]).then(
      ([eduData, salData]) => {
        setEducationLevels(eduData);
        setSalaryLevels(salData);
      },
    );
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1440);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 取得工作資料 (包含篩選條件)
    getJobs({
      pre_page: 4,
      page,
      ...(filterEducation && { education_level: filterEducation }),
      ...(filterCompany && { company_name: filterCompany }),
    }).then((data) => {
      setJobs(data.data);
      setTotal(data.total);
    });
  }, [page, filterEducation, filterCompany]);

  // 簡易計算總頁數
  const totalPages = Math.ceil(total / 4) || 6;

  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    const maxDisplay = isMobile ? 6 : 9;
    let start = Math.max(1, page - Math.floor(maxDisplay / 2));
    let end = start + maxDisplay - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxDisplay + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getPageNumbers();

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-white shadow-xl flex flex-col overflow-hidden relative">
      {/* 頂部 Hero 區塊 (使用 bg-gray-500 暫代) */}
      <div className="h-[200px] w-full bg-gray-500 flex-shrink-0 relative">
        {/* 手機版模擬圖佔位 */}
        <div className="absolute top-2 left-2 bg-gray-400 text-white text-xs px-2 py-1 rounded">
          Mobile
        </div>
      </div>

      {/* 內容區塊 */}
      <div className="p-[16px] mb-[12px] flex flex-col flex-grow gap-[12px] bg-white border-t border-b border-gray-500 shadow-content-card">
        {/* 段落標題 */}
        <div className="flex items-center self-start gap-[8px] mb-[16px]">
          <div className="h-[20px] w-[4px] rounded bg-orange-500" />
          <h2 className="text-display-6 font-bold text-gray-700">
            適合前端工程師的好工作
          </h2>
        </div>

        {/* 篩選列 */}
        <div className="flex flex-col gap-[12px] mb-[4px]">
          <SelectField
            label="教育程度"
            value={filterEducation}
            onChange={(val) => {
              setFilterEducation(val);
              setPage(1);
            }}
            options={educationLevels}
            placeholder="請選擇教育程度"
          />
          <InputField
            label="名稱"
            value={filterCompany}
            onChange={(val) => {
              setFilterCompany(val);
              setPage(1);
            }}
            placeholder="請輸入數値"
          />
        </div>

        {/* 卡片列表 */}
        <div className="flex flex-col gap-[16px] w-full items-center">
          {jobs.map((job) => {
            const eduLabel =
              educationLevels.find(
                (e) => Number(e.id) === Number(job.educationId),
              )?.label || '不限學歷';
            const salLabel =
              salaryLevels.find((s) => Number(s.id) === Number(job.salaryId))
                ?.label || '面議';

            return (
              <JobCard
                key={job.id}
                companyName={job.companyName}
                jobTitle={job.jobTitle}
                education={eduLabel}
                salary={salLabel}
                description={job.preview}
              />
            );
          })}
        </div>

        {/* 分頁元件 */}
        <div className="px-[6px] h-[32px] flex justify-center items-center gap-[6px]">
          {/* 上一頁 */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
              page === 1 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-1000'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          </button>

          {/* 頁碼 */}
          {visiblePages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-body-sm flex-shrink-0 text-gray-1000 ${
                page === p ? 'bg-gray-300' : ''
              }`}
            >
              {p}
            </button>
          ))}

          {/* 下一頁 */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
              page === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-1000'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
