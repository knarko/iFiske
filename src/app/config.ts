export const APP_ID = '37d0fdf2';

const { version } = require('../../package.json');
export const APP_VERSION = version;

export const oneSignalConfig = {
  appId: '645795a2-2cb2-4269-b934-7b687a3ae439',
  googleProjectNumber: '196216212249',
};

export function isProdMode() {
  if (window && (window as any).IonicDevServerConfig == undefined) {
    return true;
  }
  return false;
}
