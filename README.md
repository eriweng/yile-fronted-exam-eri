# Yile Frontend Exam 實作專案

這是一份 Yile 前端工程師的面試實作專案，基於 React 18 搭配 Vite 進行開發，並選用 Tailwind CSS 作為主要的樣式解決方案。專案已完成指定的 RWD 頁面切版、API 串接，同時針對程式碼架構、使用者體驗 (UX) 及網頁效能進行了優化。

## 線上預覽

專案已部署至 GitHub Pages：
[https://eriweng.github.io/yile-fronted-exam-eri/](https://eriweng.github.io/yile-fronted-exam-eri/)

GitHub Repository：
[https://github.com/eriweng/yile-fronted-exam-eri](https://github.com/eriweng/yile-fronted-exam-eri)

---

## 如何執行此專案

### 環境需求

- Node.js (推薦 v18 以上版本)
- npm 或 yarn

### 執行步驟

1. **Clone 專案與切換目錄**

   ```bash
   git clone https://github.com/eriweng/yile-fronted-exam-eri.git
   cd web-frontend-exam-main
   ```

2. **安裝依賴套件**

   ```bash
   npm install
   ```

3. **啟動本地開發伺服器**

   ```bash
   npm run dev
   ```

   _伺服器啟動後，請於瀏覽器開啟 `http://localhost:5173`。專案已掛載內建的 MirageJS Mock API 作為後端控制器。_

4. **編譯與部署 (Build & Deploy)**
   ```bash
   npm run build
   # 如有設定 Github Pages，也可執行 npm run deploy 自動發布
   ```

---

## 專案架構與邏輯說明

為了提升專案的可維護性、可讀性與未來擴充能力，我打破了原本全部擠在 `App.jsx` 的狀態結構，實行了**『職責分離 (Separation of Concerns)』**設計模式。

### 目錄結構

- `src/api/`：Axios interceptors (攔截器)。
- `src/components/common/`：高重用性的 UI 元件。
- `src/components/features/jobs/`：業務型元件。
- `src/hooks/`：所有與狀態管理、API 互動的邏輯被統一抽離成 Custom Hooks (`useJobSearch.js`, `useWindowSize.js`)。

### 設計模式與實作策略

1. **職責分離與 Container-Presenter Pattern**
   `App` 元件做為 Controller (Container)，專職處理環境判斷 (`useWindowSize`) 與資料流派發 (`useJobSearch`)。UI 的渲染邏輯則下放至 `DesktopJobBrowser` 與 `MobileJobBrowser` (Presenters)，避免 RWD 邏輯導致過度擁擠的條件渲染，提高元件獨立性與擴展性。

2. **自訂 Hook (Custom Hooks) 封裝**
   - **狀態與副作用管理**：過濾參數 (`company_name`, `education_level`, `salary_level`) 與 API 呼叫流程均封裝於 `useJobSearch` 中。
   - **Debounce 實作**：使用原生 `setTimeout` 與 `useEffect` 的 Cleanup 機制實作防抖，控制 `filterCompany` 的更新頻率，避免高頻繁的 Input 變更過度消耗 API 請求資源。
   - **併發處理**：對於互相獨立的資源 (如學歷與薪資選單)，採用 `Promise.all` 進行並行請求，避免 Waterfall 效應縮短網路等待時間。

3. **狀態與效能管理 (State & Performance)**
   - **載入過渡期 (Stale-While-Revalidate & Skeleton)**：精細區分初次載入 (`isInitialLoading`) 與分頁切換 (`isFetching`)。當頁碼切換時，畫面不立即卸載現有節點，而是以 `opacity` 漸變過渡至新內容；初次載入或觸發 Modal 事件時，則迅速佈局 Skeleton 組件，減輕非同步的延遲感。
   - **非同步快取與 Prefetch 策略**：利用 `useRef` 構建輕量級的 Local Cache，並在當前頁面資料載入完成時接續執行 `prefetchNextPage`。系統會在背景預先抓取下一頁資源，降低使用者後續交互的等待時間。
   - **資源優先級配置**：於 Entry 階段採用 `preload` 提前下載關鍵呈現資源 (如 Hero Banner 原件)，並在非首屏的影像 (如 Modal 內的附圖) 設定原生 `loading="lazy"`，降低首屏 Initial Load 的頻寬壓力。

---

## 遇到的困難、問題及解決方法

### 1. 困難一：龐大的 `App.jsx` 難以維護並阻礙擴充

- **問題**：開發初期，所有的 API 呼叫、過濾器狀態儲存、RWD 版型的 `if-else` 判斷全部塞在單一檔案中。程式碼高強度耦合，導致牽一髮動全身的風險急遽升高。
- **解決方法**：執行全站架構重構。將狀態資料儲存與 API 機制提取封裝成 `useJobSearch` Hook；同時配合 `useWindowSize`，利用 Container-Presenter 概念在 `App.jsx` 入口判斷裝置，直接導流至對應的 View 元件進行渲染。

### 2. 困難二：網路延遲使 UX 產生強烈割裂感

- **問題**：如果在行動裝置或慢速網路下，切換分頁或是點開「職缺細節 (`JobDetailsModal`)」的瞬間，使用者由於乾等 API 傳輸而會遇到白畫面，容易產生「是不是壞了」的錯覺。
- **解決方法**：
  - 設計具備現代感的 **Skeleton 骨架圖** 閃爍效果。
  - 重構 `JobDetailsModal` 邏輯：點擊「查看細節」不傻等資料回傳，而是**彈窗秒開並顯示骨架圖**，待非同步 API 讀完後才滑出真實內容。
  - 當 API 拋出 Exception 時，利用建立好的 `Toast` 浮層反饋錯誤提示，確保系統穩定性。

### 3. 困難三：極致的網頁連線與加載效能瓶頸

- **問題**：首屏最大的一張插圖載入過慢導致 LCP 分數下降；且使用者頻繁點擊下一頁或上一頁時效能不夠流暢。
- **解決方法 (效能三連擊)**：
  1.  **原生渲染加速**：直接在 `index.html` 的 `<head>` 區增設多行 `<link rel="preload">` 來強制預載首屏大圖片；並針對需捲動/彈窗才出現的相關附圖加上 `<img loading="lazy">` 釋放頻寬 Bundler。
  2.  **背景資料預先獲取 (Prefetching)**：在 `useJobSearch` 偷偷埋入了預加載機制。當使用者在閱讀第 1 頁時，系統會在背景底層靜默發送 API 去拉第 2 頁的資料並存進 Cache 字典。
  3.  **Stale-While-Revalidate UX**：結合 Cache，當使用者點下下一頁時直接命中記憶體，體驗**零毫秒切換**！如果是未被緩存的跳頁，卡片區塊不會清空突兀跳頻，而是自動轉為 50% 降低不透明度 (`opacity-50`)，等新資料再平滑取代舊資料。

---
