import { browser, element, by, ElementFinder, ExpectedConditions as until, Key } from 'protractor';
import { clickElement } from './helpers';


const searchFor = (str, res) => {
  const searchInput = element(by.css('input[name="search"]'));
  clickElement(element(by.css('ion-input[name="search"]')));
  browser.actions().mouseMove(searchInput).click();
  expect(searchInput.getAttribute('value')).toEqual('' as any);
  searchInput.sendKeys(str);
  clickElement(element(by.css('ion-input[name="search"]')));
  browser.actions().mouseMove(searchInput).click();
  browser.sleep(200);
  searchInput.sendKeys(Key.ENTER);
  const elem = element(by.css('ion-item[aria-posinset="1"]'));
  browser.wait(until.presenceOf(element(by.css('page-areas-search'))), 5000);
  browser.wait(until.presenceOf(elem), 5000);
  expect(elem.element(by.css('ion-label h2')).getText()).toEqual(res);
}

describe('Search for stuff', () => {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('');
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
  });

  const searching = [
    ['Bolmen', 'Bolmens FVOF'],
    ['Roxen', 'Roxens FVOF'],
    ['Regnbåge', 'Regnbåge'],
    ['Gädda', 'Gädda'],
    ['Abbo', 'Abborre'],
  ];

  for (const item of searching) {
    it(`can search for ${item[0]}`, () => {
      searchFor(item[0], item[1]);
    });
  }

});
