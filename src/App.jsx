import { useState, useEffect } from 'react';
import JobCard from './components/JobCard';
import SelectField from './components/SelectField';
import InputField from './components/InputField';
import HeroBanner from './components/HeroBanner';
import JobDetailsModal from './components/JobDetailsModal';
import { getJobs, getEducationLevels, getSalaryLevels } from './api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1440);
  const [educationLevels, setEducationLevels] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  // 篩選暫存值（桌機點搜尋才套用）
  const [draftCompany, setDraftCompany] = useState('');
  const [draftEducation, setDraftEducation] = useState('');
  const [draftSalary, setDraftSalary] = useState('');

  // 已套用的篩選值
  const [filterCompany, setFilterCompany] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    Promise.all([getEducationLevels(), getSalaryLevels()]).then(
      ([eduData, salData]) => {
        setEducationLevels(eduData);
        setSalaryLevels(salData);
      },
    );
  }, []);

  // ── 監聽篩選條件變化（即時搜尋） ─────────────────────────────────────────
  useEffect(() => {
    // 學歷與薪水即時更新，並重置分頁
    setFilterEducation(draftEducation);
    setFilterSalary(draftSalary);
    setPage(1);
  }, [draftEducation, draftSalary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterCompany(draftCompany);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [draftCompany]);

  useEffect(() => {
    getJobs({
      pre_page: perPage,
      page,
      ...(filterEducation && { education_level: filterEducation }),
      ...(filterCompany && { company_name: filterCompany }),
      ...(filterSalary && { salary_level: filterSalary }),
    }).then((data) => {
      setJobs(data.data);
      setTotal(data.total);
    });
  }, [page, filterEducation, filterCompany, filterSalary, isMobile]);

  const perPage = isMobile ? 4 : 6;
  const totalPages = Math.ceil(total / perPage) || 1;

  const getPageNumbers = () => {
    const maxDisplay = isMobile ? 6 : 9;
    let start = Math.max(1, page - Math.floor(maxDisplay / 2));
    let end = start + maxDisplay - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxDisplay + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getPageNumbers();

  const handleClear = () => {
    setDraftCompany('');
    setDraftEducation('');
    setDraftSalary('');
    setPage(1);
  };
  // ── 取得職業、薪水內容 ─────────────────────────────────────────
  const getLabel = (list, id, fallback) =>
    list.find((item) => Number(item.id) === Number(id))?.label || fallback;

  // ── 分頁按鈕 ─────────────────────────────────────────
  const PrevBtn = () => (
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
  );

  const NextBtn = () => (
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
  );

  // ── 分頁元件 ─────────────────────────────────────────
  const Pagination = () => (
    <div className="px-[6px] h-[32px] flex justify-center items-center gap-[6px]">
      <PrevBtn />
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
      <NextBtn />
    </div>
  );

  // ── Mobile ────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="mx-auto min-h-screen max-w-[375px] bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Hero */}
        <HeroBanner />

        {/* 內容區塊 */}
        <div className="p-[16px] mb-[12px] flex flex-col flex-grow gap-[12px] bg-white border-t border-b border-gray-500 shadow-content-card">
          <div className="flex items-center self-start gap-[8px] mb-[4px]">
            <div className="h-[16px] w-[4px] rounded bg-orange-700" />
            <h2 className="text-display-6 font-bold text-gray-700">
              適合前端工程師的好工作
            </h2>
          </div>

          <div className="flex flex-col gap-[16px] w-full items-center">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                companyName={job.companyName}
                jobTitle={job.jobTitle}
                education={getLabel(
                  educationLevels,
                  job.educationId,
                  '不限學歷',
                )}
                salary={getLabel(salaryLevels, job.salaryId, '面議')}
                description={job.preview}
              />
            ))}
          </div>

          <Pagination />
        </div>
      </div>
    );
  }

  // ── Desktop ───────────────────────────────────────────
  return (
    <>
      <div
        className="min-h-screen pb-[28px]"
        style={{
          background:
            'linear-gradient(90.51deg, #868686 1.54%, #5C5C5C 101.46%)',
        }}
      >
        {/* Hero（等比例縮放，正常文件流） */}
        <HeroBanner />
        {/* 內容卡（Hero 下方浮動） */}
        <div className="relative z-70 mx-[28px]">
          <div className="bg-white rounded-[12px] border border-[1px] border-gray-300 shadow-desktop-card p-[24px] flex flex-col gap-[20px] h-[676px] overflow-hidden">
            {/* 標題列 */}
            <div className="flex items-center gap-[8px]">
              <div className="h-[16px] w-[4px] rounded bg-orange-700" />
              <h2 className="text-display-6 font-bold text-gray-700">
                適合前端工程師的好工作
              </h2>
            </div>

            {/* 篩選列 */}
            <div className="flex items-center gap-[18px]">
              <div className="flex-1">
                <InputField
                  label="公司名稱"
                  value={draftCompany}
                  onChange={setDraftCompany}
                  placeholder="請輸入公司名稱" 
                />
              </div>
              <div className="w-[200px]">
                <SelectField
                  label="教育程度"
                  value={draftEducation}
                  onChange={setDraftEducation}
                  options={educationLevels}
                  placeholder="不限"
                /> 
              </div>
              <div className="w-[200px]">
                <SelectField
                  label="薪水範圍"
                  value={draftSalary}
                  onChange={setDraftSalary}
                  options={salaryLevels}
                  placeholder="不限"
                />
              </div>
              <button
                onClick={handleClear}
                className="h-[56px] px-[24px] bg-gray-700 hover:bg-gray-800 text-gray-100 text-body-lg rounded-[6px] flex-shrink-0 transition-colors"
              >
                條件清除
              </button>
            </div>

            {/* 卡片格 */}
            <div className="h-[502px] overflow-auto">
              {jobs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-700 text-body-lg border border-[1px] border-gray-500 rounded-[6px]">
                  無資料
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-[12px]">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      companyName={job.companyName}
                      jobTitle={job.jobTitle}
                      education={getLabel(
                        educationLevels,
                        job.educationId,
                        '不限學歷',
                      )}
                      salary={getLabel(salaryLevels, job.salaryId, '面議')}
                      description={job.preview}
                      onClick={() => setSelectedJobDetails({
                        companyName: job.companyName,
                        jobTitle: job.jobTitle,
                        description: job.description || job.preview || '無詳細工作內容',
                      })}
                    />
                  ))}
                </div>
              )}
            </div>

            <Pagination />
          </div>
        </div>
      </div>

      {selectedJobDetails && (
        <JobDetailsModal
          job={selectedJobDetails}
          onClose={() => setSelectedJobDetails(null)}
        />
      )}
    </>
  );
}

export default App;
