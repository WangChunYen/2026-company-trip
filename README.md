# 2026_公司旅遊

2026 宇宙科技公司活動報名頁面。網站使用 GitHub Pages，報名資料由 Google Apps Script 寫入私人 Google 試算表。

## Google 試算表與 Apps Script

1. 到 [Google Apps Script](https://script.google.com/) 建立新專案，將本專案的 `Code.gs` 貼到編輯器並儲存。
2. 在「專案設定」→「指令碼屬性」新增 `REGISTRATION_FOLDER_ID`，值為指定 Google Drive 資料夾網址中 `/folders/` 後面的 ID。此 ID 只存在 Apps Script 私有屬性，不會放進公開網站程式碼。
3. 在函式選單選擇 `setup` 並按「執行」。首次執行時登入 Google 帳號並授權；執行記錄會提供新建的「2026_公司旅遊」試算表網址。試算表第一列是欄位標題，電話欄會以純文字格式儲存。
4. 選擇「部署」→「新增部署」→「網頁應用程式」，執行身分選「我」，存取權選「所有人」，然後部署並完成 Google 授權。
5. 複製部署畫面提供的網頁應用程式網址，在 `index.html` 中將 `YOUR_APPS_SCRIPT_WEB_APP_URL` 替換為該網址。網址應以 `/exec` 結尾。

## GitHub Pages

1. 將本專案推送到 GitHub repository `2026-company-trip`；不要加入 `spec/`。GitHub repository 名稱只接受英數字、句點、連字號及底線，因此使用英文名稱；Google 試算表仍命名為 `2026_公司旅遊`。
2. 到 repository 的「Settings」→「Pages」，將來源設為 `Deploy from a branch`、分支設為 `main`、資料夾設為 `/(root)`，再儲存。
3. Pages 部署完成後，使用下方網址開啟網站。

網站網址：https://wangchunyen.github.io/2026-company-trip/

## 報名欄位

姓名、Email、電話為必填；單位與職稱為選填。送出資料只用於本次活動聯繫與行政作業。
