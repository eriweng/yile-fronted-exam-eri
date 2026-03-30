import { useState } from 'react';
import HeroBanner from './HeroBanner';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import InputField from '../../common/InputField';
import SelectField from '../../common/SelectField';
import Pagination from '../../common/Pagination';
import JobCardSkeleton from '../../common/JobCardSkeleton';
import Toast from '../../common/Toast';
import { getJobById } from '../../../api';

export default function DesktopJobBrowser({ state }) {
  const {
    jobs,
    page,
    setPage,
    totalPages,
    educationLevels,
    salaryLevels,
    draftCompany,
    setDraftCompany,
    draftEducation,
    setDraftEducation,
    draftSalary,
    setDraftSalary,
    handleClear,
    visiblePages,
    getLabel,
    isInitialLoading,
    isFetching,
    error,
    setError,
  } = state;

  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const handleJobClick = async (job) => {
    // 立即開啟 Modal 並顯示基本資料與骨架圖
    setIsDetailLoading(true);
    setSelectedJobDetails(job);
    
    try {
      const detail = await getJobById(job.id);
      setSelectedJobDetails({
        companyName: detail.companyName,
        jobTitle: detail.jobTitle,
        description: detail.description || '無詳細工作內容',
        companyPhoto: detail.companyPhoto,
      });
    } catch (err) {
      console.error(err);
      setError('無法取得職缺詳細資料');
      setSelectedJobDetails(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen pb-[28px]"
        style={{
          background: 'linear-gradient(90.51deg, #868686 1.54%, #5C5C5C 101.46%)',
        }}
      >
        <HeroBanner />
        
        <div className="relative mx-[28px]">
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
            <div className={`h-[458px] overflow-hidden transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              {isInitialLoading ? (
                <div className="grid grid-cols-3 gap-[12px]">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <JobCardSkeleton key={idx} />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
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
                      education={getLabel(educationLevels, job.educationId, '不限學歷')}
                      salary={getLabel(salaryLevels, job.salaryId, '面議')}
                      description={job.preview}
                      onClick={() => handleJobClick(job)}
                    />
                  ))}
                </div>
              )}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              visiblePages={visiblePages}
            />
          </div>
        </div>
      </div>

      {selectedJobDetails && (
        <JobDetailsModal
          job={selectedJobDetails}
          isLoading={isDetailLoading}
          onClose={() => setSelectedJobDetails(null)}
        />
      )}
      
      <Toast message={error} onClose={() => setError(null)} />
    </>
  );
}
