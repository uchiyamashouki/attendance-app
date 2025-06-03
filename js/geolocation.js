function checkLocation(callback) {
  if (!navigator.geolocation) {
    showMessage("位置情報が取得できません", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const targetLat = 35.66268324417568;
      const targetLon = 140.00893276836095;
      const distance = calculateDistance(lat, lon, targetLat, targetLon);
      if (distance > 0.1) {
        showMessage("茜浜野球場からのみ記録できます", "error");
      } else {
        callback();
      }
    },
    () => {
      showMessage("位置情報の取得に失敗しました", "error");
    }
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
