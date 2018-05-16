export const APP_ID = '37d0fdf2';

const { version } = require('../../package.json');
export const APP_VERSION = version;

export const googleAnalyticsTrackerID = 'UA-7371664-4';

export function isProdMode() {
  if (window && (window as any).IonicDevServerConfig == undefined) {
    return true;
  }
  return false;
}
