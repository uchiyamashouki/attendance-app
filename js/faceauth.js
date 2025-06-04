async function performFaceAuth(name, isRegister = false) {
  // 顔検出 → 特徴抽出
  // 登録なら localStorageなどに保存
  if (isRegister) {
    localStorage.setItem(`face_${name}`, JSON.stringify(faceDescriptor));
    return true;
  } else {
    const stored = localStorage.getItem(`face_${name}`);
    if (!stored) return false;

    const storedDescriptor = JSON.parse(stored);
    const distance = faceapi.euclideanDistance(faceDescriptor, storedDescriptor);
    return distance < 0.5;
  }
}
