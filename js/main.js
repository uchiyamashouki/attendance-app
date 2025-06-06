
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetBtn");
  const passwordModal = document.getElementById("passwordModal");
  const confirmReset = document.getElementById("confirmReset");
  const submitBtn = document.getElementById("submitBtn");
  const registerBtn = document.getElementById("registerBtn");

  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const welcomeMsg = document.getElementById("welcomeMsg");

  const storedName = localStorage.getItem("userName");
  if (storedName && registrationForm && userArea && welcomeMsg) {
    registrationForm.style.display = "none";
    userArea.style.display = "block";
    welcomeMsg.textContent = `${storedName} さん、こんにちは！`;
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      registerBtn.classList.add("clicked");
      const name = document.getElementById("registerName").value.trim();
      if (name === "") {
        alert("氏名を入力してください");
        registerBtn.classList.remove("clicked");
        return;
      }
      localStorage.setItem("userName", name);
      registrationForm.style.display = "none";
      userArea.style.display = "block";
      welcomeMsg.textContent = `${name} さん、こんにちは！`;
    });
  }

  if (resetBtn && passwordModal && confirmReset) {
    resetBtn.addEventListener("click", function () {
      resetBtn.classList.add("clicked");
      passwordModal.style.display = "block";
    });

    confirmReset.addEventListener("click", function () {
      confirmReset.classList.add("clicked");
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
        alert("パスワードが正しくありません");
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", async function () {
      submitBtn.classList.add("clicked");

      if (!isUserAuthenticated()) {
        alert("本人認証を実行してください。");
        submitBtn.classList.remove("clicked");
        return;
      }

      const posOk = await verifyLocation();
      if (!posOk) {
        alert("正しい場所（茜浜球場）からのみ記録可能です。");
        submitBtn.classList.remove("clicked");
        return;
      }

      sendAttendanceData();
    });
  }
});

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
