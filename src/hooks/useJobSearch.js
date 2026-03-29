import { useState, useEffect } from 'react';
import { getJobs, getEducationLevels, getSalaryLevels } from '../api';

export function useJobSearch({ isMobile }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [educationLevels, setEducationLevels] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);

  // 篩選暫存值（桌機點搜尋才套用）
  const [draftCompany, setDraftCompany] = useState('');
  const [draftEducation, setDraftEducation] = useState('');
  const [draftSalary, setDraftSalary] = useState('');

  // 已套用的篩選值
  const [filterCompany, setFilterCompany] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  const perPage = isMobile ? 4 : 6;
  const totalPages = Math.ceil(total / perPage) || 1;

  useEffect(() => {
    Promise.all([getEducationLevels(), getSalaryLevels()]).then(
      ([eduData, salData]) => {
        setEducationLevels(eduData);
        setSalaryLevels(salData);
      },
    );
  }, []);

  // 監聽篩選條件變化（即時搜尋）
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
  };
}
