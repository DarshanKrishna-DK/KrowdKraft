/**
 * Bound to the "KrowdKraft membership" spreadsheet.
 * Deploy as a web app: execute as the owner, access by anyone.
 * The site posts JSON to the deployed /exec URL.
 */
function doPost(event) {
  var data = JSON.parse(event.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    new Date(),
    data.path || '',
    data.fullName || '',
    data.email || '',
    data.occupation || '',
    data.organization || '',
    data.linkedin || '',
    data.github || '',
    data.video || '',
    data.activeConversation || '',
    data.ownGoal || '',
    data.coreContribution || '',
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
