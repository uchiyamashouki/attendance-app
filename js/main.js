
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetBtn");
  const passwordModal = document.getElementById("passwordModal");
  const confirmReset = document.getElementById("confirmReset");
  const submitBtn = document.getElementById("submitBtn");
  const registerBtn = document.getElementById("registerBtn");
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const message = document.getElementById("message");
  const closeInstruction = document.getElementById("closeInstruction");
  const loading = document.getElementById("loading");
  const lastAttendanceInfo = document.getElementById("lastAttendanceInfo");

  const today = new Date().toLocaleDateString();
  let records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");
  let userData = JSON.parse(localStorage.getItem("attendanceUserData") || "{}");

  const userName = localStorage.getItem("userName");
  if (userName && registrationForm && userArea && welcomeMsg) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    welcomeMsg.textContent = userName + " さん、こんにちは！";

    updateLastAttendanceInfo();
    updateAttendanceButtonState();
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      const nameInput = document.getElementById("registerName").value.trim();
      if (!nameInput) {
        showMessage("氏名を入力してください", "error");
        return;
      }
      localStorage.setItem("userName", nameInput);
      localStorage.setItem("attendanceUserData", JSON.stringify({ name: nameInput }));
      location.reload();
    });
  }

  if (resetBtn && passwordModal && confirmReset) {
    resetBtn.addEventListener("click", function () {
      passwordModal.style.display = "block";
    });

    confirmReset.addEventListener("click", function () {
      const password = document.getElementById("adminPassword").value;
      if (password === "Kodai1942") {
        localStorage.removeItem("userName");
        localStorage.removeItem("authenticated");
        localStorage.removeItem("attendanceUserData");
        localStorage.removeItem("attendanceRecords");
        location.reload();
      } else {
        showMessage("パスワードが正しくありません", "error");
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", async function () {
      const attendanceType = document.querySelector("input[name='attendanceType']:checked");
      const currentName = localStorage.getItem("userName");
      if (!currentName || !attendanceType) {
        showMessage("氏名と練習区分は必須です", "error");
        return;
      }

      if (!isUserAuthenticated()) {
        showMessage("顔認証を実行してください", "error");
        return;
      }

      const pitches = document.getElementById("pitches").value;
      if (pitches && (isNaN(pitches) || parseInt(pitches) < 0)) {
        showMessage("投球数は0以上の数値で入力してください", "error");
        return;
      }

      if (!navigator.geolocation) {
        showMessage("位置情報が取得できません", "error");
        return;
      }

      showLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          showLoading(false);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const distance = calculateDistance(lat, lon, 35.662683, 140.008933);

          if (distance > 10) {
            showMessage("球場から離れすぎています（" + Math.round(distance * 1000) + "m）", "error");
            return;
          }

          const recordList = records[today] || [];
          if (recordList.length >= 10) {
            showMessage("本日は既に10回記録済みです", "error");
            return;
          }

          const now = new Date();
          const record = { type: attendanceType.value, time: now.toLocaleTimeString() };
          recordList.push(record);
          records[today] = recordList;
          localStorage.setItem("attendanceRecords", JSON.stringify(records));

          userData = userData || {};
          if (attendanceType.value === "開始") {
            userData.lastStart = { date: today, time: record.time };
          } else {
            userData.lastEnd = { date: today, time: record.time };
          }
          localStorage.setItem("attendanceUserData", JSON.stringify(userData));

          updateLastAttendanceInfo();
          updateAttendanceButtonState();
          sendToGoogleForm({
            name: currentName,
            attendance: attendanceType.value,
            pitches: pitches,
            latitude: lat,
            longitude: lon
          });

          showMessage("記録完了しました！", "success");
          if (closeInstruction) closeInstruction.style.display = "block";
        },
        () => {
          showLoading(false);
          showMessage("位置情報の取得に失敗しました", "error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  function updateLastAttendanceInfo() {
    if (!lastAttendanceInfo || !userData) return;
    const today = new Date().toLocaleDateString();
    let infoText = "";

    if (userData.lastStart?.date === today) {
      infoText += `本日の開始記録: ${userData.lastStart.time}`;
    }
    if (userData.lastEnd?.date === today) {
      if (infoText) infoText += " / ";
      infoText += `本日の終了記録: ${userData.lastEnd.time}`;
    }
    if (!infoText) {
      infoText = "本日の記録: なし";
    }
    lastAttendanceInfo.textContent = infoText;
  }

  function updateAttendanceButtonState() {
    const startRadio = document.getElementById("start");
    const endRadio = document.getElementById("end");
    const today = new Date().toLocaleDateString();
    if (!userData) return;

    if (userData.lastStart?.date === today) {
      startRadio.disabled = true;
      endRadio.checked = true;
    }
    if (userData.lastEnd?.date === today) {
      endRadio.disabled = true;
      startRadio.checked = true;
    }
    if (userData.lastStart?.date === today && userData.lastEnd?.date === today) {
      submitBtn.disabled = true;
    }
  }

  function sendToGoogleForm(data) {
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

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function showMessage(text, type) {
    if (!message) return;
    message.className = "";
    message.textContent = text;
    message.classList.add(type === "success" ? "message-success" : "message-error");
  }

  function showLoading(show) {
    if (loading) loading.style.display = show ? "block" : "none";
    if (submitBtn) submitBtn.disabled = show;
  }
});
