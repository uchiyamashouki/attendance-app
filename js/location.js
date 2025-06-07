import { showMessage } from "./utils.js";

export function getCurrentPosition(callback, onError) {
  if (!navigator.geolocation) {
    showMessage("位置情報が取得できません", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      callback(latitude, longitude);
    },
    () => {
      showMessage("位置情報の取得に失敗しました", "error");
      if (onError) onError();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
