
async function startCamera(videoId) {
  const video = document.getElementById(videoId);
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
}

async function captureFace(videoId) {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

  const video = document.getElementById(videoId);
  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  return result ? result.descriptor : null;
}

async function matchFace(videoId) {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

  const stored = localStorage.getItem("userDescriptor");
  if (!stored) return false;
  const descriptor = new Float32Array(JSON.parse(stored));

  const video = document.getElementById(videoId);
  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  if (!result) return false;

  const distance = faceapi.euclideanDistance(result.descriptor, descriptor);
  return distance < 0.6;
}
