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
  });

  function showMessage(text, type) {
    message.className = "";
    message.textContent = text;
    message.classList.add(type === "success" ? "message-success" : "message-error");
  }
});
