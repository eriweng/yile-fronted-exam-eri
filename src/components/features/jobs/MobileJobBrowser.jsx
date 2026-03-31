import { useState } from 'react';
import HeroBanner from './HeroBanner';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import Pagination from '../../common/Pagination';
import JobCardSkeleton from '../../common/JobCardSkeleton';
import Toast from '../../common/Toast';
import { getJobById } from '../../../api';

export default function MobileJobBrowser({ state }) {
  const {
    jobs,
    page,
    setPage,
    totalPages,
    educationLevels,
    salaryLevels,
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
    <div className="mx-auto min-h-screen min-w-[375px] bg-white shadow-xl flex flex-col overflow-hidden">
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

        <div className={`flex flex-col gap-[16px] w-full items-center transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
          {isInitialLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <JobCardSkeleton key={idx} />
            ))
          ) : jobs.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-gray-700 text-body-lg">
              無資料
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                companyName={job.companyName}
                jobTitle={job.jobTitle}
                education={getLabel(educationLevels, job.educationId, '不限學歷')}
                salary={getLabel(salaryLevels, job.salaryId, '面議')}
                description={job.preview}
                onClick={() => handleJobClick(job)}
              />
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          visiblePages={visiblePages}
        />
      </div>
      
      {selectedJobDetails && (
        <JobDetailsModal
          job={selectedJobDetails}
          isLoading={isDetailLoading}
          onClose={() => setSelectedJobDetails(null)}
        />
      )}
      
      <Toast message={error} onClose={() => setError(null)} />
    </div>
  );
}
