const { ipcRenderer } = require('electron');

window.sendParticipants = () => {
  const participants = document.querySelector('textarea').value;

  ipcRenderer.send('get-winner', participants);
};

