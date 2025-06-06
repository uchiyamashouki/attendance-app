import {
  showMessage,
  showLoading,
  calculateDistance
} from "./utils.js";
import {
  getRecords,
  saveRecords,
  getUserData,
  saveUserData,
  getUserName,
  saveUserName
} from "./storage.js";
import { getCurrentPosition } from "./location.js";
import { sendToGoogleForm } from "./form.js";
import { isUserAuthenticated } from "./auth.js";

document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetBtn");
  const passwordModal = document.getElementById("passwordModal");
  const confirmReset = document.getElementById("confirmReset");
  const submitBtn = document.getElementById("submitBtn");
  const registerBtn = document.getElementById("registerBtn");
  const registrationForm = document.getElementById("registrationForm");
  const userArea = document.getElementById("userArea");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const closeInstruction = document.getElementById("closeInstruction");
  const lastAttendanceInfo = document.getElementById("lastAttendanceInfo");

  const today = new Date().toLocaleDateString();
  let records = getRecords();
  let userData = getUserData();

  const userName = getUserName();

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      const nameInput = document.getElementById("registerName").value.trim();
      if (!nameInput) {
        showMessage("氏名を入力してください", "error");
        return;
      }
      saveUserName(nameInput);
      saveUserData({ name: nameInput });

       registrationForm.style.display = "none";
    userArea.style.display = "block";
    welcomeMsg.textContent = `${nameInput} さんで記録します！`; 
    updateLastAttendanceInfo();
    updateAttendanceButtonState();
    });
  }

  if (resetBtn && passwordModal && confirmReset) {
    resetBtn.addEventListener("click", function () {
      passwordModal.style.display = "block";
    });

    confirmReset.addEventListener("click", function () {
      const password = document.getElementById("adminPassword").value;
      if (password === "Kodai1942") {
        localStorage.clear();
        location.reload();
      } else {
        showMessage("パスワードが正しくありません", "error");
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const attendanceType = document.querySelector("input[name='attendanceType']:checked");
      const currentName = getUserName();
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

      showLoading(true);
      getCurrentPosition((lat, lon) => {
        showLoading(false);
        const distance = calculateDistance(lat, lon, 35.662683, 140.008933);

        if (distance > 0.01) {
          showMessage(`球場から離れすぎています（${Math.round(distance * 1000)}m）`, "error");
          return;
        }

        const recordList = records[today] || [];
        if (recordList.length >= 100) {
          showMessage("本日は既に100回記録済みです", "error");
          return;
        }

        const now = new Date();
        const record = { type: attendanceType.value, time: now.toLocaleTimeString() };
        recordList.push(record);
        records[today] = recordList;
        saveRecords(records);

        if (attendanceType.value === "開始") {
          userData.lastStart = { date: today, time: record.time };
        } else {
          userData.lastEnd = { date: today, time: record.time };
        }
        saveUserData(userData);

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
      });
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
});
