import { browser, ElementFinder } from 'protractor';
export const clickElement = (elem: ElementFinder) => {
  return browser.wait(() => elem.click().then(() => true, () => false));
}
