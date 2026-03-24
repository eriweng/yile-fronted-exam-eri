import { useState, useEffect } from 'react';
import JobCard from './components/JobCard';

function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // 取得工作資料
    fetch(`/api/v1/jobs?pre_page=4&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data);
        setTotal(data.total);
      });
  }, [page]);

  // 簡易計算總頁數，若需要精確呈現亦可使用 total
  const totalPages = Math.ceil(total / 4) || 6;

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
      <div className="px-[16px] py-[20px] flex flex-col flex-grow items-center">
        {/* 段落標題 */}
        <div className="flex items-center self-start gap-[8px] mb-[16px]">
          <div className="h-[20px] w-[4px] rounded bg-orange-500" />
          <h2 className="text-[20px] font-bold text-gray-700">
            適合前端工程師的好工作
          </h2>
        </div>

        {/* 卡片列表 */}
        <div className="flex flex-col gap-[16px] w-full items-center">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              companyName={job.companyName}
              jobTitle={job.jobTitle}
              description={job.preview}
              /* 這裡先使用預設或簡單名稱，若需查詢字典，後續可再更新 */
            />
          ))}
        </div>

        {/* 分頁元件 */}
        <div className="mt-[24px] mb-[16px] flex justify-center items-center gap-[12px] text-gray-500 text-body-lg">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-[24px] h-[24px] flex items-center justify-center hover:bg-gray-200 rounded-full"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                  page === p
                    ? 'bg-gray-300 text-gray-900 font-bold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-[24px] h-[24px] flex items-center justify-center hover:bg-gray-200 rounded-full"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
