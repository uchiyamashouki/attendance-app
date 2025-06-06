
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetBtn");
  const passwordModal = document.getElementById("passwordModal");
  const confirmReset = document.getElementById("confirmReset");
  const submitBtn = document.getElementById("submitBtn");

  resetBtn.addEventListener("click", function () {
    passwordModal.style.display = "block";
  });

  confirmReset.addEventListener("click", function () {
    const password = document.getElementById("adminPassword").value;
    if (password === "Kodai1942") {
      localStorage.removeItem("userName");
      localStorage.removeItem("authenticated");
      location.reload();
    } else {
      alert("パスワードが正しくありません");
    }
  });

  submitBtn.addEventListener("click", async function () {
    if (!isUserAuthenticated()) {
      alert("本人認証を実行してください。");
      return;
    }

    const posOk = await verifyLocation();
    if (!posOk) {
      alert("正しい場所（茜浜球場）からのみ記録可能です。");
      return;
    }

    sendAttendanceData(); // 既存の送信処理
  });
});

// 位置情報確認
async function verifyLocation() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const targetLat = 35.66268324417568;
        const targetLng = 140.00893276836095;
        const distance = Math.sqrt(
          Math.pow(lat - targetLat, 2) + Math.pow(lng - targetLng, 2)
        );

        resolve(distance < 0.001);
      },
      (err) => {
        console.error("位置情報取得に失敗", err);
        resolve(false);
      }
    );
  });
}
