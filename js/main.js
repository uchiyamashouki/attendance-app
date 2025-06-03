
let video = document.getElementById("video");
let labeledDescriptor = null;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models")
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("カメラ起動エラー:", err));
}

async function registerFace() {
  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  if (!detections) {
    showStatus("顔が検出できません", false);
    return;
  }
  localStorage.setItem("faceDescriptor", JSON.stringify(Array.from(detections.descriptor)));
  showStatus("顔登録が完了しました", true);
}

async function authenticate() {
  const stored = localStorage.getItem("faceDescriptor");
  if (!stored) {
    showStatus("顔が登録されていません", false);
    return;
  }

  const storedDescriptor = new Float32Array(JSON.parse(stored));
  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  if (!detections) {
    showStatus("顔が検出できません", false);
    return;
  }

  const distance = faceapi.euclideanDistance(detections.descriptor, storedDescriptor);
  if (distance < 0.5) {
    document.getElementById("attendanceForm").style.display = "block";
    showStatus("認証成功！出欠記録できます", true);
  } else {
    showStatus("認証失敗：別人の可能性があります", false);
  }
}

function showStatus(msg, success) {
  const status = document.getElementById("authStatus");
  status.textContent = msg;
  status.style.color = success ? "green" : "red";
}
