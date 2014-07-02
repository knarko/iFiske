# [iFiske](http://ifiske.se)
This is the GitHub repo for the iFiske fishing license app for phones and tablets. 
The app is developed in [PhoneGap](http://phonegap.com) using JavaSript and HTML.

For more information about iFiske, visit [ifiske.se](http://ifiske.se)!
## Table of contents
- [Quick start](#quick-start)
 - [Building locally](#building-locally)
 - [Project structure](#project-structure)
- [Bug reports and feature requests](#bug-reports-and-feature-requests)
- [Contact information](#contact-us)
- [License](#license)

## Quick start
### Building locally
Install [phonegap](http://phonegap.com) (version 3.3.0 or later).
````Shell
git clone https://github.com/ifiske/ifiske
cd ifiske
phonegap run <platform>
````
### Project structure
The [wiki](http://github.com/ifiske/iFiske/wiki/Folder-structure) contains more detailed information regarding the project structure. 
```
ifiske/
├── doc/
├── platforms/
├── plugins/
└── www/
    ├── config.xml
    ├── icon.png
    ├── index.html
    ├── css/
    |   ├── global.css
    |   ├── header.css
    |   ├── index.css
    |   └── popup.css
    ├── js/
    |   ├── api_request.js
    |   ├── database.js
    |   ├── debug.js
    |   ├── index.js
    |   └── navigate.js
    ├── img/
    ├── lib/
    └── pages/
        ├── css/
        |   └── <page_name>.css
        ├── html/
        |   └── <page_name>.html
        └── js/
            └── <page_name>.js
```
## Bug reports and feature requests
Create an [issue](http://github.com/ifiske/iFiske/issues/new) on this page, or [contact us](#contact-us) directly.
## Contact us
[Filip Marko](http://github.com/knarko)

[Gustav Bylund](http://github.com/maistho)

## License
Code and docs released under [the Apache License](LICENSE).
