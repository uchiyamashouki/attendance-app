document.getElementById("registerBtn").addEventListener("click", async () => {
  const nameInput = document.getElementById("registerName");
  const name = nameInput.value.trim();

  if (!name) {
    alert("氏名を入力してください");
    return;
  }

  try {
    // 顔認証を開始（faceauth.js内で定義済みの関数）
    const success = await performFaceAuth(name, true);  // trueは「登録モード」の意味で渡す想定
    if (success) {
      alert(`「${name}」として顔を登録しました！`);
      nameInput.value = ""; // フォームリセット
    } else {
      alert("顔の登録に失敗しました。再度試してください。");
    }
  } catch (error) {
    console.error("登録中にエラーが発生しました:", error);
    alert("エラーが発生しました。");
  }
});
