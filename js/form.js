export function sendToGoogleForm(data) {
  const formData = new FormData();
 formData.append("entry.1235081500", data.name);           // 氏名（正）
  formData.append("entry.2085125757", data.attendance);     // 練習区分（正）
  formData.append("entry.2025397394", data.pitches);        // 球数
  formData.append("entry.360519448", data.latitude);        // 緯度
  formData.append("entry.658296585", data.longitude);       // 経度（ID修正済み）

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSegSTTLeL75exvNWpF2iEQqdP8nUC4p55TBLpjvPR1WGefBCA/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}
