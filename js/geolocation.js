
async function checkLocation() {
  if (!navigator.geolocation) {
    alert("このブラウザでは位置情報がサポートされていません。");
    return false;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const targetLat = 35.66268324417568;
        const targetLng = 140.00893276836095;
        const distance = getDistanceFromLatLonInKm(lat, lng, targetLat, targetLng);
        if (distance <= 0.1) {
          resolve(true);
        } else {
          alert("指定された場所（茜浜球場）ではありません。");
          resolve(false);
        }
      },
      (error) => {
        console.error("位置情報エラー:", error);
        alert("位置情報の取得に失敗しました。ブラウザや端末の設定を確認してください。");
        resolve(false);
      }
    );
  });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
