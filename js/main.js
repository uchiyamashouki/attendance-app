
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const registerBtn = document.getElementById("registerBtn");
  const submitBtn = document.getElementById("submitBtn");
  const message = document.getElementById("message");

  const userName = localStorage.getItem("userName");
  const today = new Date().toLocaleDateString();
  let records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

  if (userName) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    document.getElementById("welcomeMsg").textContent = userName + " さんで記録します";
  }

  registerBtn.addEventListener("click", function () {
    const nameInput = document.getElementById("registerName").value.trim();
    if (!nameInput) {
      showMessage("氏名を入力してください", "error");
      return;
    }
    localStorage.setItem("userName", nameInput);
    location.reload();
  });

  submitBtn.addEventListener("click", function () {
    const attendanceType = document.querySelector("input[name='attendanceType']:checked");
    if (!attendanceType) {
      showMessage("出欠を選択してください", "error");
      return;
    }

    if (!navigator.geolocation) {
      showMessage("位置情報が取得できません", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const distance = calculateDistance(lat, lon, 35.662683, 140.008933);

        if (distance > 10) {//デバックとして10㎞
          showMessage("球場から離れすぎています（" + Math.round(distance * 1000) + "m）", "error");
          return;
        }

        const recordList = records[today] || [];
        if (recordList.length >= 20) {//デバックとして20回
          showMessage("本日は既に20回記録済みです", "error");
          return;
        }

        recordList.push({ type: attendanceType.value, time: new Date().toLocaleTimeString() });
        records[today] = recordList;
        localStorage.setItem("attendanceRecords", JSON.stringify(records));

        showMessage("記録完了しました！", "success");
      },
      () => {
        showMessage("位置情報の取得に失敗しました", "error");
      }
    );
  });

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function showMessage(text, type) {
    message.className = "";
    message.textContent = text;
    message.classList.add(type === "success" ? "message-success" : "message-error");
  }
});
