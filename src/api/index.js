import axios from 'axios';

// 建立 axios 實體
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 定義 HTTP 狀態碼處理方式 (攔截器)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          console.error('錯誤請求 (400)');
          break;
        case 401:
          console.error('未授權，請重新登入 (401)');
          break;
        case 403:
          console.error('拒絕存取 (403)');
          break;
        case 404:
          console.error('找不到資源 (404)');
          break;
        case 500:
          console.error('伺服器內部錯誤 (500)');
          break;
        default:
          console.error(`連線錯誤 (${status})`);
      }
    } else if (error.request) {
      console.error('未收到伺服器回應');
    } else {
      console.error('請求設定錯誤:', error.message);
    }
    return Promise.reject(error);
  },
);

// 封裝各個 API 呼叫
/**
 * 取得工作列表
 * @param {Object} params - 查詢參數 (pre_page, page)
 * @return {Promise}
 */
export const getJobs = (params) => {
  return apiClient.get('/jobs', { params });
};

/**
 * 取得學歷等級列表
 * @return {Promise}
 */
export const getEducationLevels = () => {
  return apiClient.get('/educationLevelList');
};

/**
 * 取得薪資等級列表
 * @return {Promise}
 */
export const getSalaryLevels = () => {
  return apiClient.get('/salaryLevelList');
};

export default apiClient;
