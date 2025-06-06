
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

  const userName = localStorage.getItem("userName");
  const today = new Date().toLocaleDateString();
  let records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

  if (userName && registrationForm && userArea && welcomeMsg) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    welcomeMsg.textContent = userName + " さん、こんにちは！";
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      const nameInput = document.getElementById("registerName").value.trim();
      if (!nameInput) {
        showMessage("氏名を入力してください", "error");
        return;
      }
      localStorage.setItem("userName", nameInput);
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
        document.getElementById("registerName").value = "";
        registrationForm.style.display = "block";
        userArea.style.display = "none";
        document.getElementById("adminPassword").value = "";
        passwordModal.style.display = "none";
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

      if (!navigator.geolocation) {
        showMessage("位置情報が取得できません", "error");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const distance = calculateDistance(lat, lon, 35.662683, 140.008933);

          if (distance > 10) {
            showMessage("球場から離れすぎています（" + Math.round(distance * 1000) + "m）", "error");
            return;
          }

          const recordList = records[today] || [];
          if (recordList.length >= 2) {
            showMessage("本日は既に2回記録済みです", "error");
            return;
          }

          const pitches = document.getElementById("pitches").value || "";

          recordList.push({ type: attendanceType.value, time: new Date().toLocaleTimeString() });
          records[today] = recordList;
          localStorage.setItem("attendanceRecords", JSON.stringify(records));

          sendToGoogleForm({
            name: currentName,
            attendance: attendanceType.value,
            pitches: pitches,
            latitude: lat,
            longitude: lon
          });

          showMessage("記録完了しました！", "success");
        },
        () => {
          showMessage("位置情報の取得に失敗しました", "error");
        }
      );
    });
  }

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
    if (!message) return;
    message.className = "";
    message.textContent = text;
    message.classList.add(type === "success" ? "message-success" : "message-error");
  }

  function sendToGoogleForm(data) {
    const formData = new FormData();
    formData.append("entry.411119479", data.name);
    formData.append("entry.114182324", data.pitches);
    formData.append("entry.1124427894", data.latitude);
    formData.append("entry.792823488", data.longitude);
    formData.append("entry.1139332873", data.attendance);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSegSTTLeL75exvNWpF2iEQqdP8nUC4p55TBLpjvPR1WGefBCA/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData
    });
  }
});
