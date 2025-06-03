
document.getElementById("submitBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const category = document.querySelector('input[name="category"]:checked');
  const throwingCount = document.getElementById("throwingCount").value.trim();

  if (!username || !category) {
    alert("氏名と練習区分は必須です。");
    return;
  }

  const isValidLocation = await checkLocation();
  if (!isValidLocation) return;

  const isAuthenticated = await performFaceAuth(username);
  if (!isAuthenticated) {
    alert("顔認証に失敗しました。再試行してください。");
    return;
  }

  const now = new Date();
  const dateKey = now.toLocaleDateString("ja-JP");
  const recordKey = `record_${dateKey}`;
  const recordData = JSON.parse(localStorage.getItem(recordKey)) || [];

  const todayRecords = recordData.filter(r => r.username === username);
  if (todayRecords.length >= 2) {
    alert("本日は既に2回記録されています。");
    return;
  }

  recordData.push({
    username,
    category: category.value,
    throwingCount: throwingCount || "0",
    time: now.toLocaleTimeString("ja-JP")
  });

  localStorage.setItem(recordKey, JSON.stringify(recordData));

  alert("記録を完了しました！");
  document.getElementById("recordForm").reset();
});
