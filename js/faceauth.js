
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
  const video = document.getElementById("videoInput");
  if (!video) {
    console.error("videoInputが見つかりません");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("カメラの起動に失敗しました:", err);
      alert("カメラへのアクセスが拒否されました。ブラウザ設定をご確認ください。");
    });
}

async function performFaceAuth(username) {
  // 仮の簡易顔認証処理（本番では faceMatcher と descriptor 比較）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // 常に成功とするデモ
    }, 500);
  });
}
