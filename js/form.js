export function sendToGoogleForm(data) {
  const formData = new FormData();
 formData.append("entry.411119479", data.name);           // 氏名（正）
  formData.append("entry.1823206220", data.attendance);     // 練習区分（正）
  formData.append("entry.114182324", data.pitches);        // 球数
  formData.append("entry.1124427894", data.latitude);        // 緯度
  formData.append("entry.792823488", data.longitude);       // 経度（ID修正済み）

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSegSTTLeL75exvNWpF2iEQqdP8nUC4p55TBLpjvPR1WGefBCA/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}
