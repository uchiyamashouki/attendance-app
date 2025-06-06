export function sendToGoogleForm(data) {
  const formData = new FormData();
  formData.append("entry.1235081500", data.name);
  formData.append("entry.2025397394", data.pitches);
  formData.append("entry.360519448", data.latitude);
  formData.append("entry.792823488", data.longitude);
  formData.append("entry.2085125757", data.attendance);

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSegSTTLeL75exvNWpF2iEQqdP8nUC4p55TBLpjvPR1WGefBCA/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}
