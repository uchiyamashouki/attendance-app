
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const registerBtn = document.getElementById("registerBtn");
  const submitBtn = document.getElementById("submitBtn");
  const message = document.getElementById("message");
  const resetBtn = document.getElementById("resetBtn");
  const passwordModal = document.getElementById("passwordModal");
  const confirmReset = document.getElementById("confirmReset");

  const userName = localStorage.getItem("userName");
  const today = new Date().toLocaleDateString();
  let records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

  if (userName) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    document.getElementById("welcomeMsg").textContent = userName + " さんで記録します";
    document.getElementById("resetContainer").style.display = "block";
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

  resetBtn.addEventListener("click", () => passwordModal.style.display = "block");
  confirmReset.addEventListener("click", function () {
    const password = document.getElementById("adminPassword").value;
    if (password === "Kodai1942") {
      localStorage.removeItem("userName");
      location.reload();
    } else {
      showMessage("パスワードが正しくありません", "error");
    }
  });

  submitBtn.addEventListener("click", function () {
    checkLocation(async () => {
    const attendanceType = document.querySelector("input[name='attendanceType']:checked");
    if (!attendanceType) return showMessage("出欠を選択してください", "error");

    await runFaceRecognition(() => {
      const recordList = records[today] || [];
      if (recordList.length >= 3) return showMessage("本日は既に3回記録済みです", "error");

      recordList.push({ type: attendanceType.value, time: new Date().toLocaleTimeString() });
      records[today] = recordList;
      localStorage.setItem("attendanceRecords", JSON.stringify(records));
      showMessage("記録完了しました！", "success");
        });
  });

  function showMessage(text, type) {
    message.className = "";
    message.textContent = text;
    message.classList.add(type === "success" ? "message-success" : "message-error");
  }

  async function runFaceRecognition(onSuccess) {
    const modal = document.getElementById("faceModal");
    modal.style.display = "flex";
    const video = document.getElementById("video");

    await faceapi.nets.ssdMobilenetv1.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models");
await faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models");
await faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        const interval = setInterval(async () => {
          const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
          if (result) {
            clearInterval(interval);
            stream.getTracks().forEach(track => track.stop());
            modal.style.display = "none";
            onSuccess();
            resolve();
          }
        }, 800);
      };
    });
  }
});



    function checkLocation(callback) {
      if (!navigator.geolocation) {
        showMessage("位置情報が取得できません", "error");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const targetLat = 35.66268324417568;
          const targetLon = 140.00893276836095;
          const distance = calculateDistance(lat, lon, targetLat, targetLon);
          if (distance > 0.1) {
            showMessage("茜浜野球場からのみ記録できます", "error");
          } else {
            callback();
          }
        },
        () => {
          showMessage("位置情報の取得に失敗しました", "error");
        }
      );
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // km
    }
