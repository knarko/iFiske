import { browser, element, by, ElementFinder, ExpectedConditions as until } from 'protractor';
import { clickElement } from './helpers';

const loginWithUser = user => {
  const loginPageButton = element(by.css('ion-header ion-buttons[first] button'));
  clickElement(loginPageButton);
  const usernameInput = element(by.css('page-login input[placeholder="Användarnamn"]'));
  browser.wait(until.presenceOf(usernameInput), 2000);
  usernameInput.sendKeys(user.username);
  const passwordInput = element(by.css('page-login input[type="password"]'));
  passwordInput.sendKeys(user.password);
  const loginButton = element(by.css('page-login button[type="submit"]'));
  expect(loginButton.getAttribute('disabled')).toBeFalsy();
  clickElement(loginButton);
  browser.wait(until.presenceOf(element(by.css('.loading-content'))));
  browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
};

const user = {
  username: 'hjortsparre',
  password: 'legend',
};

browser.ignoreSynchronization = true;

describe('Login and logout', () => {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('');
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
  });

  afterEach(() => {
    browser.executeScript('window.localStorage.clear();')
    browser.executeScript('window.sessionStorage.clear();');
  });

  it('can log in', () => {
    loginWithUser(user);
    element.all(by.css('page-login')).then(items => expect(items.length).toBe(0));
    expect(browser.executeScript('return window.localStorage.getItem("session")')).toBeTruthy();
  });

  it('has info on the profile page', () => {
    const getUserInfo = (title, val) => {
      const el = element(by.cssContainingText('h2', title)).element(by.xpath('..')).element(by.css('p'))
      browser.wait(until.presenceOf(el))
      expect(el.getText()).toEqual(val);
    };

    loginWithUser(user);
    element.all(by.css('page-login')).then(items => expect(items.length).toBe(0));
    const profilePageButton = element(by.css('ion-header ion-buttons[first] button'));
    clickElement(profilePageButton);
    getUserInfo('Användarnamn', 'hjortsparre');
    getUserInfo('Namn', 'Gustav');
    getUserInfo('E-postadress', 'hjortsparre@hotmail.com');
  });

  it ('can not log in with false password', () => {
    loginWithUser({username: 'hjortsparre', password: 'not_the_real_password'});
    element.all(by.css('page-login')).then(items => expect(items.length).toBe(1));
    expect(element(by.css('ion-errors p')).getText()).toEqual('Ogiltligt lösenord' as any);
  });

  it('can log in and then log out', () => {
    loginWithUser(user);
    element.all(by.css('page-login')).then(items => expect(items.length).toBe(0));
    const profilePageButton = element(by.css('ion-header ion-buttons[first] button'));
    clickElement(profilePageButton);
    const logoutButton = element(by.cssContainingText('button', 'Logga ut'));
    clickElement(logoutButton);
    browser.wait(until.presenceOf(element(by.css('.loading-content'))));
    browser.wait(until.not(until.presenceOf(element(by.css('.loading-content')))));
    element.all(by.css('page-profile')).then(items => expect(items.length).toBe(0));
    expect(browser.executeScript('return window.localStorage.getItem("session")')).toBeFalsy();
  });

});
