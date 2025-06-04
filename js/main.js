
document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const registerNameInput = document.getElementById("registerName");
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const submitBtn = document.getElementById("submitBtn");
  const message = document.getElementById("message");

  const userName = localStorage.getItem("userName");
  if (userName) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    welcomeMsg.textContent = userName + " さんで記録します";
    startCamera("authVideo");
  } else {
    startCamera("registerVideo");
  }

  registerBtn.addEventListener("click", async () => {
    const name = registerNameInput.value.trim();
    if (!name) {
      showMessage("氏名を入力してください", "error");
      return;
    }
    const descriptor = await captureFace("registerVideo");
    if (!descriptor) {
      showMessage("顔を検出できませんでした", "error");
      return;
    }
    localStorage.setItem("userName", name);
    localStorage.setItem("userDescriptor", JSON.stringify(Array.from(descriptor)));
    location.reload();
  });

  submitBtn.addEventListener("click", async () => {
    const type = document.querySelector("input[name='attendanceType']:checked");
    if (!type) {
      showMessage("出欠記録を選択してください", "error");
      return;
    }

    const position = await getCurrentPosition();
    const distance = calculateDistance(position.coords.latitude, position.coords.longitude, 35.662683, 140.008933);
    if (distance > 0.1) {
      showMessage("指定位置外からのアクセスです", "error");
      return;
    }

    const result = await matchFace("authVideo");
    if (!result) {
      showMessage("顔認証に失敗しました", "error");
      return;
    }

    showMessage("記録完了しました！", "success");
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.style.color = type === "error" ? "red" : "green";
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
});
