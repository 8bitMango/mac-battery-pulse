module.exports = {
  appId: 'com.lovable.mac-battery-pulse',
  productName: 'Mac Battery Pulse',
  directories: {
    output: 'dist-electron'
  },
  files: [
    'dist/**/*',
    'electron/main.js',
    'electron/preload.js',
    'node_modules/**/*'
  ],
  mac: {
    category: 'public.app-category.utilities',
    icon: 'assets/icon.icns'
  },
  win: {
    icon: 'assets/icon.ico'
  },
  linux: {
    icon: 'assets/icon.png'
  }
};