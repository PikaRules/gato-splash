import { app, BrowserWindow, protocol } from 'electron';

const path = require('path');
const WEB_FOLDER = 'dist';
const PROTOCOL = 'file';


function createWindow () {
  const win = new BrowserWindow({
    width: 360,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  console.log('dirname: ', __dirname);

  win.loadURL(`file://${__dirname}/dist/index.html`).then(() => {
      console.log('success');
  }, (e) => {
    console.error('error cannot load');
  });
}

app.on('ready', () => {

    /*
    protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {

        // // Strip protocol
        let url = request.url.substr(PROTOCOL.length + 1);
        // Build complete path for node require function
        url = path.join(__dirname, WEB_FOLDER, url);
        // Replace backslashes by forward slashes (windows)
        // url = url.replace(/\\/g, '/');
        url = path.normalize(url);

        console.log(url);
        callback({path: url});
    });*/

    /*
    protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(7)
        callback({ path: path.normalize(`${__dirname}/${url}`) })
    }, (err) => {
        if (err) console.error('Failed to register protocol')
    })*/

/*
    protocol.registerFileProtocol('file', (request, callback) => {
        // const url = request.url.substr(7)
        // const path2 = path.normalize(`${__dirname}/${url}`);
        // callback({ path: path })
        console.log('request url: ', request.url);
        // console.log('url: ', url);
        // console.log('path: ', path2);
        callback(request);
      })*/

    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
