
let chatOpen = false;

function toggleChatbot() {
  chatOpen = !chatOpen;
  document.getElementById('chatWindow').classList.toggle('active', chatOpen);
}

function appendMessage(sender, text) {
  const chatbox = document.getElementById('chatbox');
  const msg = document.createElement('div');
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  appendMessage('You', text);
  input.value = '';
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      appendMessage('Bot', data.response);
    })
    .catch(() => {
      appendMessage('Bot', 'Sorry, there was an error.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('userInput');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  }
});