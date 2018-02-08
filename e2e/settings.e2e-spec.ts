import { browser, element, by, ElementFinder, ExpectedConditions as until, Key } from 'protractor';
import { clickElement } from './helpers';

const gotoSettings = () => {
  const settingsButton = element(by.css('ion-header ion-buttons[end] button'));
  clickElement(settingsButton);
  const settingsTitle = element(by.css('page-settings ion-title'))
  browser.wait(until.presenceOf(settingsTitle));
  expect(settingsTitle.getText()).toEqual('Inställningar');
}


describe('Settings', () => {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('');
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
  });

  it(`can open settings`, () => {
    gotoSettings();
  });
  it('can change language', () => {
    gotoSettings();

    const settingsTitle = element(by.css('page-settings ion-title'))
    browser.wait(until.presenceOf(settingsTitle));
    expect(settingsTitle.getText()).toEqual('Inställningar');
    const changeLanguageButton = element(by.css('page-settings button:nth-child(4)'))
    const changeLanguageModal = element(by.css('page-change-language'))

    // English
    clickElement(changeLanguageButton)
    console.log('Opened modal')
    browser.wait(until.presenceOf(changeLanguageModal))
    console.log('modal is open')
    clickElement(element(by.cssContainingText('ion-item', 'English')))
    browser.wait(until.presenceOf(element(by.css('.loading-content'))));
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
    expect(settingsTitle.getText()).toEqual('Settings');

    //German
    clickElement(changeLanguageButton)
    browser.wait(until.presenceOf(changeLanguageModal))
    clickElement(element(by.cssContainingText('ion-item', 'Deutsch')))
    browser.wait(until.presenceOf(element(by.css('.loading-content'))));
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
    expect(settingsTitle.getText()).toEqual('Einstellungen');
  })

});
