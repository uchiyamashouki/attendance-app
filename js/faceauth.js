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
      setTimeout(async () => {
        const result = await faceapi.detectSingleFace(video, new faceapi.SsdMobilenetv1Options());
        stream.getTracks().forEach(track => track.stop());
        modal.style.display = "none";
        if (result) {
          onSuccess();
        } else {
          showMessage("顔認証に失敗しました", "error");
        }
        resolve();
      }, 3000);
    };
  });
}
