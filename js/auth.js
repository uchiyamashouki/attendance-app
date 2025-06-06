
let isAuthenticated = false;

// WebAuthnで認証を実行
async function runWebAuthnAuthentication() {
    if (!window.PublicKeyCredential) {
        alert("このブラウザはWebAuthnに対応していません。");
        return;
    }

    try {
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32), // 本来はサーバーから取得する必要あり
                timeout: 60000,
                userVerification: "required"
            }
        });

        if (credential) {
            isAuthenticated = true;
            alert("本人認証に成功しました。");
            document.getElementById("auth-status").textContent = "✅ 本人認証 済み";
        }
    } catch (err) {
        console.error("認証エラー:", err);
        alert("本人認証に失敗しました。");
    }
}

// 認証済み状態を返す関数
function isUserAuthenticated() {
    return isAuthenticated;
}

// グローバルに関数を公開
window.runWebAuthnAuthentication = runWebAuthnAuthentication;
window.isUserAuthenticated = isUserAuthenticated;
