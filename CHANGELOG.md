<a name="3.4.3"></a>
## [3.4.3](https://github.com/ifiske/ifiske/compare/v3.4.2...v3.4.3) (2016-12-10)


### Bug Fixes

* **admin:** Fix first license card lower than others ([1246629](https://github.com/ifiske/ifiske/commit/1246629)), closes [#108](https://github.com/ifiske/ifiske/issues/108)
* **admin:** Fix Object.values missing on Safari ([900b00a](https://github.com/ifiske/ifiske/commit/900b00a))
* **admin:** Redesign admin page ([90f9a8f](https://github.com/ifiske/ifiske/commit/90f9a8f))
* **languageSwitcher:** Actually cancel the interval ([1c45fb4](https://github.com/ifiske/ifiske/commit/1c45fb4))
* **languageSwitcher:** cancels the interval when leaving the view ([bc1c61a](https://github.com/ifiske/ifiske/commit/bc1c61a))
* **languageSwitcher:** Fix rolling text bugs on iOS ([077fc06](https://github.com/ifiske/ifiske/commit/077fc06))
* **Settings:** Clear view cache whenever language is changed ([eba1a75](https://github.com/ifiske/ifiske/commit/eba1a75))
* **tabs:** Increase size of footer-bar to 50px to increase visibility ([a0f072a](https://github.com/ifiske/ifiske/commit/a0f072a)), closes [#107](https://github.com/ifiske/ifiske/issues/107)
* **translation:** Added lang query parameter to most outbound links ([cfba886](https://github.com/ifiske/ifiske/commit/cfba886))
* **translation:** Update home screen pluralisation of fishing areas ([05fc88d](https://github.com/ifiske/ifiske/commit/05fc88d))
* **translations:** Pluralize some translations ([73766dc](https://github.com/ifiske/ifiske/commit/73766dc))



<a name="3.4.2"></a>
## [3.4.2](https://github.com/ifiske/ifiske/compare/v3.4.1...v3.4.2) (2016-12-07)


### Bug Fixes

* **admin:** Easier switching of active organization ([8801436](https://github.com/ifiske/ifiske/commit/8801436)), closes [#104](https://github.com/ifiske/ifiske/issues/104)
* **admin:** Order licenses by date ([a4b730f](https://github.com/ifiske/ifiske/commit/a4b730f))
* **admin:** Trying to make the admin pages update so that they feel more "live" ([a4ee998](https://github.com/ifiske/ifiske/commit/a4ee998))
* **languageSwitcher:** Add the image background to the languageSwitcher ([03189eb](https://github.com/ifiske/ifiske/commit/03189eb))
* **product:** Fix pointer events of products ([a2d6400](https://github.com/ifiske/ifiske/commit/a2d6400)), closes [#100](https://github.com/ifiske/ifiske/issues/100)
* **translation:** Translate Contact title ([7097e93](https://github.com/ifiske/ifiske/commit/7097e93))
* **user_info:** Reload user info before entering page ([1fc0301](https://github.com/ifiske/ifiske/commit/1fc0301)), closes [#106](https://github.com/ifiske/ifiske/issues/106)
* Valid renamed to active ([9ad07c7](https://github.com/ifiske/ifiske/commit/9ad07c7))


### Features

* **admin:** Update admin styling and navigation ([790f218](https://github.com/ifiske/ifiske/commit/790f218)), closes [#98](https://github.com/ifiske/ifiske/issues/98) [#102](https://github.com/ifiske/ifiske/issues/102) [#103](https://github.com/ifiske/ifiske/issues/103) [#104](https://github.com/ifiske/ifiske/issues/104)
* **analytics:** Sends search terms from home page to analytics ([cdd986f](https://github.com/ifiske/ifiske/commit/cdd986f))
* **languageSwitcher:** Rotate title text language every 3s ([3aff180](https://github.com/ifiske/ifiske/commit/3aff180)), closes [#105](https://github.com/ifiske/ifiske/issues/105)



<a name="3.4.1"></a>
## [3.4.1](https://github.com/ifiske/ifiske/compare/v3.4.0...v3.4.1) (2016-12-05)


### Bug Fixes

* **analytics:** Use the newest version of GA so it works on iOS ([bb638f8](https://github.com/ifiske/ifiske/commit/bb638f8))
* **database:** Fix Safari bug when creating tables ([964a111](https://github.com/ifiske/ifiske/commit/964a111))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/ifiske/ifiske/compare/v3.3.10...v3.4.0) (2016-11-24)


### Bug Fixes

* **api:** Set get_enginepolicies to correct name ([2621a24](https://github.com/ifiske/ifiske/commit/2621a24))
* **area:** Remove some margins for p-tags on area info ([1444c3b](https://github.com/ifiske/ifiske/commit/1444c3b))
* **area_cards:** Add language parameter to outbound link ([1ef5cbb](https://github.com/ifiske/ifiske/commit/1ef5cbb))
* **area_info:** Use translations for popups and toasts ([ae30dc3](https://github.com/ifiske/ifiske/commit/ae30dc3))
* **area_list:** Uses translations for the search placeholders ([0c9980e](https://github.com/ifiske/ifiske/commit/0c9980e))
* **de_translation:** Added translation for catch report ([1944f06](https://github.com/ifiske/ifiske/commit/1944f06))
* **find_areas:** Use translations for title ([04864f4](https://github.com/ifiske/ifiske/commit/04864f4))
* **map:** automatically shows the user location ([b63b0c0](https://github.com/ifiske/ifiske/commit/b63b0c0))
* Fixes rebasing issues ([2a283fa](https://github.com/ifiske/ifiske/commit/2a283fa))
* **menu:** Enables the login button  ([a39351e](https://github.com/ifiske/ifiske/commit/a39351e))
* **style:** Fixes issue with overflow: hidden cropping text in lists ([7f7092c](https://github.com/ifiske/ifiske/commit/7f7092c))
* **style:** Fixes the abstract and image backgrounds ([93387fc](https://github.com/ifiske/ifiske/commit/93387fc))
* **technique_detail:** Fixes Youtube placement ([ff5ad16](https://github.com/ifiske/ifiske/commit/ff5ad16))
* **user_cards:** Fixes pull to refresh-triggering ([a2219f3](https://github.com/ifiske/ifiske/commit/a2219f3))
* **user_cards:** Use User.update instead of Update.update ([3b66a62](https://github.com/ifiske/ifiske/commit/3b66a62))
* **UserModel:** Fix UserProducts not populating ([cafb9f0](https://github.com/ifiske/ifiske/commit/cafb9f0))


### Features

* **Ionic Cloud:** Updates Ionic Cloud to 0.9.0 ([ca7c448](https://github.com/ifiske/ifiske/commit/ca7c448))
* **languageSwitcher:** Can now select which language to use ([15ff213](https://github.com/ifiske/ifiske/commit/15ff213))
* **translations:** Add German and English languages ([d518edd](https://github.com/ifiske/ifiske/commit/d518edd))
* **translations:** Update translations ([cf3aab5](https://github.com/ifiske/ifiske/commit/cf3aab5))



<a name="3.3.10"></a>
## [3.3.10](https://github.com/ifiske/ifiske/compare/v3.3.9...v3.3.10) (2016-06-28)



<a name="3.3.9"></a>
## [3.3.9](https://github.com/ifiske/ifiske/compare/v3.3.7...v3.3.9) (2016-06-16)



<a name="3.3.7"></a>
## [3.3.7](https://github.com/ifiske/ifiske/compare/v3.3.6...v3.3.7) (2016-05-18)



<a name="3.3.6"></a>
## [3.3.6](https://github.com/ifiske/ifiske/compare/v3.3.5...v3.3.6) (2016-05-17)



<a name="3.3.5"></a>
## [3.3.5](https://github.com/ifiske/ifiske/compare/v3.3.4...v3.3.5) (2016-05-01)



<a name="3.3.4"></a>
## [3.3.4](https://github.com/ifiske/ifiske/compare/v3.3.3...v3.3.4) (2016-05-01)



<a name="3.3.3"></a>
## [3.3.3](https://github.com/ifiske/ifiske/compare/v3.3.0...v3.3.3) (2016-04-30)



<a name="3.3.0"></a>
# [3.3.0](https://github.com/ifiske/ifiske/compare/v3.2.3...v3.3.0) (2016-04-20)



<a name="3.2.3"></a>
## [3.2.3](https://github.com/ifiske/ifiske/compare/3.2.0...v3.2.3) (2016-04-11)



<a name="3.1.2"></a>
## [3.1.2](https://github.com/ifiske/ifiske/compare/3.1.0...3.1.2) (2015-11-18)
