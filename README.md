# [iFiske - Fishing Permits](https://ifiske.se)
This is the GitHub repo for the iFiske Android and iOS app.
The app is developed using the [Ionic Framework](http://ionicframework.com) which builds on cordova.

For more information about iFiske, visit [ifiske.se](https://ifiske.se)!

## Table of contents
- [Quick start](#quick-start)
  - [Building locally](#building-locally)
  - [Deploying](#deploying)
- [Bug reports and feature requests](#bug-reports-and-feature-requests)
- [Contact information](#contact-us)
- [License](#license)

## Quick start
### Building locally
Install NodeJS using your preferred method. You will also need `npm`, which usually is installed when installing node.

Make sure to use at least NodeJS v8 and npm v5. Using the most recent version is recommended.

```Shell
git clone https://github.com/ifiske/ifiske.git
cd ifiske
npm install
npm start
```

### Deploying
Make sure that you are logged in to [Ionic Pro](https://dashboard.ionicjs.com) and have configured the git access correctly.

#### Bump version
Run `npm run deploy` in order to do a `major`, `minor` or `patch` bump.

Usually you should bump `patch`, but if you have changed the native cordova plugins, you should bump `minor`.

#### Build the code on Ionic Pro
The code should build automatically on Ionic Pro. When the build has finished you can trigger a native build if you made any changes to the native cordova plugins.

#### IMPORTANT: Set up the version information
Make sure to set up the version information correctly in the dashboard.

Set minimum to the latest compatible release (usually the latest minor release).

Set Maximum and Equivalent to the version number you are deploying.

#### Test your changes using Developer Mode
Enable Developer Mode and install the latest `Master` channel deploy.
Make sure everything seems OK.

#### Deploy to Production
If everything seems OK, deploy to the `Production` channel in the dashboard.

## Bug reports and feature requests
Create an [issue](https://github.com/ifiske/iFiske/issues/new) on this page, or [contact the developers](#contact-us) directly.

## Contact us
[Gustav Bylund](https://github.com/maistho)

[Filip Marko](https://github.com/knarko)

## License
Code and documentation released under [the Apache License](LICENSE).
