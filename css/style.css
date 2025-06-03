document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const registerBtn = document.getElementById("registerBtn");
  const submitBtn = document.getElementById("submitBtn");

  const userName = localStorage.getItem("userName");
  const today = new Date().toLocaleDateString();
  let records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

  if (userName) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    document.getElementById("welcomeMsg").textContent = userName + " さん、こんにちは！";
  }

  registerBtn.addEventListener("click", function () {
    const nameInput = document.getElementById("registerName").value.trim();
    if (!nameInput) {
      alert("氏名を入力してください");
      return;
    }
    localStorage.setItem("userName", nameInput);
    location.reload();
  });

  submitBtn.addEventListener("click", function () {
    const name = localStorage.getItem("userName");
    const attendanceType = document.querySelector("input[name='attendanceType']:checked");
    const message = document.getElementById("message");

    if (!attendanceType) {
      message.textContent = "出欠を選択してください";
      message.style.color = "red";
      return;
    }

    if (!navigator.geolocation) {
      message.textContent = "位置情報が取得できません";
      message.style.color = "red";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const distance = calculateDistance(lat, lon, 35.662683, 140.008933);

        if (distance > 0.1) {
          message.textContent = "球場から離れすぎています（" + Math.round(distance * 1000) + "m）";
          message.style.color = "red";
          return;
        }

        const recordList = records[today] || [];
        if (recordList.length >= 3) {
          message.textContent = "本日は既に3回記録済みです";
          message.style.color = "red";
          return;
        }

        recordList.push({ type: attendanceType.value, time: new Date().toLocaleTimeString() });
        records[today] = recordList;
        localStorage.setItem("attendanceRecords", JSON.stringify(records));

        message.textContent = "記録完了しました！";
        message.style.color = "green";
      },
      () => {
        message.textContent = "位置情報の取得に失敗しました";
        message.style.color = "red";
      }
    );
  });

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
});
