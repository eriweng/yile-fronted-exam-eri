# 🚀 Antigravity Agent 前端代碼風格規範

本規範旨在確保 **antigravity** 專案中所有自動生成與人工編寫的代碼具備高度的**一致性**、**可讀性**與**可維護性**。

## 📑 核心原則
1.  **一致性優於個人偏好**：代碼應看起來像是由同一個人（或 agent）編寫的。
2.  **清晰性**：代碼應自帶解釋性，減少過度複雜的技巧。
3.  **自動化**：盡可能透過 Linter 與 Formatter 強制執行。

---

## 🏗 HTML 規範

| 規範項目 | 規則內容 | 範例 |
| :--- | :--- | :--- |
| **縮進** | 使用 **2 個空格**，嚴禁使用 Tab。 | `<div>  <p>...</p></div>` |
| **大小寫** | 所有標籤、屬性、命名空間一律**小寫**。 | `<div class="...">` |
| **引號** | 屬性值必須使用**雙引號** `"`。 | `<input type="text">` |
| **圖片** | 所有 `<img>` 必須提供 `alt` 屬性。 | `<img src="..." alt="說明">` |
| **結構** | 避免省略可選標籤（如 `</li>`, `</body>`）。 | 保持閉合標籤完整。 |

### 屬性排列順序建議
1.  `class` (用於樣式控制)
2.  `id`, `name` (用於識別)
3.  `data-*` (用於 JavaScript 交互)
4.  `src`, `for`, `type`, `href`, `value`
5.  `title`, `alt`, `role`, `aria-*`

---

## 🎨 CSS 規範

### 1. 格式與命名
* **命名慣例**：使用 **Kebab-case** (連字號)，例如 `.main-nav-item`。
* **縮進**：2 個空格。
* **宣告塊**：左大括號 `{` 前保留一個空格；屬性冒號 `:` 後保留一個空格。
* **分號**：每個屬性宣告末尾必須加上分號 `;`。

### 2. 數值與單位
* **0 單位**：當數值為 `0` 時，省略單位。
    * ❌ `margin: 0px;` -> ✅ `margin: 0;`
* **十六進制**：優先使用小寫，且能簡寫時盡量簡寫（如 `#fff`）。
* **引號**：在屬性值或選擇器中使用**單引號** `'`。

```css
/* ✅ 推薦範例 */
.search-results {
  display: flex;
  margin: 0 auto;
  background-color: #f0f0f0;
  content: '';
}
```

---

## ⌨️ JavaScript / TypeScript 規範

### 1. 變數與宣告
* **嚴禁 `var`**：一律使用 `const` (優先) 或 `let`。
* **命名**：
    * 變數、函式、屬性：`camelCase` (小駝峰)。
    * 類別、React 組件：`PascalCase` (大駝峰)。
    * 常數 (Constants)：`UPPER_SNAKE_CASE` (全大寫底線)。
* **分號**：**必須使用分號**，不依賴 ASI 機制。

### 2. 字串與物件
* **引號**：優先使用**單引號** `'`，僅在包含變數時使用反引號 `` ` `` (Template Literals)。
* **物件字面量**：多行物件的最後一項必須加上**尾隨逗號 (Trailing Comma)**。
* **解構賦值**：優先使用解構 (Destructuring)。

```javascript
// ✅ 推薦範例
const MAX_RETRIES = 3;

function fetchData(userId) {
  const requestConfig = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }, // 尾隨逗號
  };
  // ...
}
```

### 3. 箭頭函式
* 優先使用箭頭函式（Arrow Functions），特別是在匿名回調函式中。
* 簡單的邏輯應使用隱式回傳 (Implicit return)。

---

## ⚛️ React/現代框架補充 (antigravity 專用)

* **Props 傳遞**：優先在組件參數中直接解構。
* **TypeScript**：
    * 顯式定義 Interface 或 Type。
    * 避免使用 `any`。
* **Tailwind 應用** (如適用)：類別名稱過長時，建議分行排列或使用 `clsx`/`tailwind-merge`。

---

## 🛠 自動化工具推薦
* **ESLint**: 使用 `eslint-config-google` 或專案自定義規則。
* **Prettier**: 設定 `tabWidth: 2`, `semi: true`, `singleQuote: true`。

---