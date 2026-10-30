const SPREADSHEET_NAME = '2026_公司旅遊';
const SPREADSHEET_ID_PROPERTY = 'REGISTRATION_SPREADSHEET_ID';
const SPREADSHEET_FOLDER_ID_PROPERTY = 'REGISTRATION_FOLDER_ID';
const HEADERS = ['姓名', 'Email', '單位', '電話', '職稱'];

function setup() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(SPREADSHEET_ID_PROPERTY);
  if (existingId) {
    const existing = SpreadsheetApp.openById(existingId);
    Logger.log('報名試算表已設定：' + existing.getUrl());
    return existing.getUrl();
  }

  const folderId = properties.getProperty(SPREADSHEET_FOLDER_ID_PROPERTY);
  if (!folderId) {
    throw new Error('請先在 Apps Script 專案設定的指令碼屬性中設定 REGISTRATION_FOLDER_ID。');
  }
  const folder = DriveApp.getFolderById(folderId);

  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName('報名資料');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange('D:D').setNumberFormat('@');
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  properties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  Logger.log('已建立報名試算表：' + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doGet() {
  return HtmlService.createHtmlOutput('報名服務已就緒。');
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const requestId = String(parameters.requestId || '');
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(requestId)) {
    return createResponse(false, '');
  }

  try {
    const name = String(parameters.name || '').trim();
    const email = String(parameters.email || '').trim();
    const department = String(parameters.department || '').trim();
    const phone = String(parameters.phone || '').trim();
    const jobTitle = String(parameters.jobTitle || '').trim();
    if (!name || !email || !phone || email.length > 254 || phone.length > 40) {
      return createResponse(false, requestId);
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_ID_PROPERTY);
    if (!spreadsheetId) {
      throw new Error('尚未設定報名試算表，請先執行 setup()。');
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('報名資料');
    if (!sheet) {
      throw new Error('找不到「報名資料」工作表。');
    }
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 4).setNumberFormat('@');
    sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
      name,
      email,
      department,
      phone,
      jobTitle
    ]]);
    return createResponse(true, requestId);
  } catch (error) {
    Logger.log('報名資料寫入失敗：' + (error && error.stack ? error.stack : error));
    return createResponse(false, requestId);
  }
}

function createResponse(success, requestId) {
  const payload = JSON.stringify({
    type: 'signup-result',
    status: success ? 'success' : 'error',
    requestId: requestId
  });
  const html = '<!doctype html><html><body><script>window.parent.postMessage(' +
    payload +
    ', "*");</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
