const {
  app,
  ipcMain,
  webContents,
  BrowserWindow,
  BrowserView
} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createParticipantsViewOn = mainWindow => {
  const bv = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'render', 'participants', 'participants.js')
    }
  });

  mainWindow.addBrowserView(bv);
  bv.webContents.loadFile(path.join(__dirname, 'render', 'participants', 'participants.html'));
  bv.setBounds({
    x: 10, y: 50, width: 380, height: 510
  });
};

const createWinnerViewOn = mainWindow => {
  const bv = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'render', 'winner', 'winner.js')
    }
  });

  mainWindow.addBrowserView(bv);
  bv.webContents.loadFile(path.join(__dirname, 'render', 'winner', 'winner.html'));
  bv.setBounds({
    x: 410, y: 50, width: 380, height: 510
  });
}

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);

const handleIpcMessages = () => {
  ipcMain.on('get-winner', (_, participants) => {
    const participantsArray = participants.split('\n');
    const winner = participantsArray[randomBetween(0, participantsArray.length)];

    webContents.getAllWebContents().forEach(wc => wc.send('winner-is', winner));
  });
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    resizable: false
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'render', 'index.html'));

  createParticipantsViewOn(mainWindow);
  createWinnerViewOn(mainWindow);
  handleIpcMessages();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.xº
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
