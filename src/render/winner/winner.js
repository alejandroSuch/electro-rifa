const {ipcRenderer} = require('electron');

ipcRenderer.on('winner-is', (_, winner) => {
  document.querySelector('h1').innerText = winner;
});