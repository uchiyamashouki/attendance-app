document.getElementById('submitBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const attendanceType = document.querySelector('input[name="entry.1823206220"]:checked');
  const message = document.getElementById('message');

  if (!name) {
    message.textContent = '氏名を入力してください';
    message.style.color = 'red';
    return;
  }
  if (!attendanceType) {
    message.textContent = '出欠を選択してください';
    message.style.color = 'red';
    return;
  }

  message.textContent = '記録を完了しました！';
  message.style.color = 'green';
});
