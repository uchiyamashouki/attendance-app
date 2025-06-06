// auth.js（修正版）
let isAuthenticated = false;

// 初回登録（パスキー）
async function registerWithFaceID() {
  if (!window.PublicKeyCredential) {
    alert("このブラウザはWebAuthnに対応していません。");
    return;
  }

  const publicKey = {
    challenge: new Uint8Array(32),
    rp: { name: "DOUSE Attendance" },
    user: {
      id: new Uint8Array(16),
      name: "shouki@example.com",
      displayName: "Shouki"
    },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    },
    timeout: 60000,
    attestation: "none"
  };

  try {
    const credential = await navigator.credentials.create({ publicKey });
    alert("顔認証の登録が完了しました！");
  } catch (err) {
    console.error(err);
    alert("登録に失敗しました。");
  }
}

// 認証（実行時）
async function runWebAuthnAuthentication() {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: "required"
      }
    });

    if (assertion) {
      isAuthenticated = true;
      const status = document.getElementById("auth-status");
      if (status) status.textContent = "✅ 本人認証 済み";
      alert("本人認証に成功しました。");
    }
  } catch (err) {
    console.error(err);
    alert("本人認証に失敗しました。");
  }
}

// 状態確認
function isUserAuthenticated() {
  return isAuthenticated;
}

// 認証済みの永続化は行わない（毎回実行必須）
// ページ読み込み時に復元もしない

window.registerWithFaceID = registerWithFaceID;
window.runWebAuthnAuthentication = runWebAuthnAuthentication;
window.isUserAuthenticated = isUserAuthenticated;
