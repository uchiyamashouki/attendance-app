export function getRecords() {
  return JSON.parse(localStorage.getItem("attendanceRecords") || "{}");
}

export function saveRecords(records) {
  localStorage.setItem("attendanceRecords", JSON.stringify(records));
}

export function getUserData() {
  return JSON.parse(localStorage.getItem("attendanceUserData") || "{}");
}

export function saveUserData(data) {
  localStorage.setItem("attendanceUserData", JSON.stringify(data));
}

export function getUserName() {
  return localStorage.getItem("userName");
}

export function saveUserName(name) {
  localStorage.setItem("userName", name);
}
