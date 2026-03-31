import { useState, useEffect, useRef } from 'react';
import { getJobs, getEducationLevels, getSalaryLevels } from '../api';

export function useJobSearch({ isMobile }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [educationLevels, setEducationLevels] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);

  // isInitialLoading 用於首次載入或重大改變時顯示完整骨架圖
  // isFetching 用於分頁切換時，畫面保留並變半透明
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [draftCompany, setDraftCompany] = useState('');
  const [draftEducation, setDraftEducation] = useState('');
  const [draftSalary, setDraftSalary] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  const perPage = isMobile ? 4 : 6;
  const totalPages = Math.ceil(total / perPage) || 1;
  const cacheRef = useRef({});

  useEffect(() => {
    Promise.all([getEducationLevels(), getSalaryLevels()]).then(
      ([eduData, salData]) => {
        setEducationLevels(eduData);
        setSalaryLevels(salData);
      },
    );
  }, []);

  useEffect(() => {
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

  const getCacheKey = (p) => `${p}_${perPage}_${filterCompany}_${filterEducation}_${filterSalary}`;

  useEffect(() => {
    const currentCacheKey = getCacheKey(page);

    const fetchJobs = async () => {
      setError(null);

      // 若快取中已有，瞬間切換，並背景觸發預載下一頁
      if (cacheRef.current[currentCacheKey]) {
        const cached = cacheRef.current[currentCacheKey];
        setJobs(cached.data);
        setTotal(cached.total);
        if (page < Math.ceil(cached.total / perPage)) {
          prefetchNextPage(page + 1);
        }
        return;
      }

      // 若無快取，決定 UI 狀態：若是第一頁或畫面沒有資料，顯示大骨架圖；否則只顯示半透明
      if (jobs.length === 0 || page === 1) {
        setIsInitialLoading(true);
      } else {
        setIsFetching(true);
      }

      try {
        const res = await getJobs({
          pre_page: perPage,
          page,
          ...(filterEducation && { education_level: filterEducation }),
          ...(filterCompany && { company_name: filterCompany }),
          ...(filterSalary && { salary_level: filterSalary }),
        });

        // 存入快取
        cacheRef.current[currentCacheKey] = { data: res.data, total: res.total };

        setJobs(res.data);
        setTotal(res.total);

        // 如果還有下一頁，背景預載
        if (page < Math.ceil(res.total / perPage)) {
          prefetchNextPage(page + 1);
        }
      } catch (err) {
        setError(err.message || '無法取得職缺資料，請稍後再試。');
        if (jobs.length === 0) setJobs([]);
      } finally {
        setIsInitialLoading(false);
        setIsFetching(false);
      }
    };

    const prefetchNextPage = async (nextPage) => {
      const nextCacheKey = getCacheKey(nextPage);
      if (cacheRef.current[nextCacheKey]) return;
      try {
        const res = await getJobs({
          pre_page: perPage,
          page: nextPage,
          ...(filterEducation && { education_level: filterEducation }),
          ...(filterCompany && { company_name: filterCompany }),
          ...(filterSalary && { salary_level: filterSalary }),
        });
        if (res.data && res.data.length > 0) {
           cacheRef.current[nextCacheKey] = { data: res.data, total: res.total };
        }
      } catch (e) {
        console.warn('背景預獲取下一頁失敗:', e);
      }
    };

    fetchJobs();
  }, [page, filterEducation, filterCompany, filterSalary, isMobile]);

  const handleClear = () => {
    setDraftCompany('');
    setDraftEducation('');
    setDraftSalary('');
    setPage(1);
  };

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

  const getLabel = (list, id, fallback) =>
    list.find((item) => Number(item.id) === Number(id))?.label || fallback;

  return {
    jobs,
    page,
    setPage,
    total,
    totalPages,
    perPage,
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
  };
}
