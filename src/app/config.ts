export const APP_ID = '37d0fdf2';

const { version } = require('../../package.json');
export const APP_VERSION = version;

export const googleAnalyticsTrackerID = 'UA-7371664-4';

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

export const colors = {
  primary: "#003852",
  secondary: "#669600",
  danger: "#ff580a",
  light: "#e4e4e4",
  dark: "#222",
  gold: "#edce07",
}
