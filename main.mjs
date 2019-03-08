import { app, BrowserWindow, protocol } from 'electron'
import fs from 'fs'
import { join } from 'path'
const es6Path = __dirname.replace(/\/$/, '')

let win

function createWindow() {
  win = new BrowserWindow({
    enableRemoteModule: true,
    nodeIntegration: true
  })
  win.loadFile('ui/index.html')
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })

  protocol.registerBufferProtocol( 'es6', ( req, cb ) => {
    fs.readFile(
      join( es6Path, req.url.replace( 'es6://', '' ) ),
      (e, b) => { cb( { mimeType: 'text/javascript', data: b } ) }
    )
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})