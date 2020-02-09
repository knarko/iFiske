import { TranslationDefinition, AdminTranslationDefinition } from "./TranslationDefinition";

export const fi: TranslationDefinition & AdminTranslationDefinition = {
    "You are now a developer": "Olet nyt kehittäjä",
    "Save": "Tallenna",
    "Language": "Kieli",
    "Downloadable file": "Ladattava {{type}}",
    "Renew permit": "Uusi lupa",
    "Permit not yet valid": "Lupa ei ole vielä voimassa oleva",
    "Activation code failed": "Tapahtui virhe, aktivointikoodia ei voitu lähettää.",
    "Activation code resent": "Uusi aktivointikoodi on lähetetty",
    "Account created": "Tilisi on luotu",
    "You have been logged out": "Sinut on kirjattu ulos",
    "No areas found": "Alueita ei löytynyt",
    "Updating": "Päivitetään...",
    "What is your name?": "Mikä on nimesi?",
    "Mark favorites": "Seuraa million kalat purevat! Merkitse suosikki-ja kotivesistösi suosikeiksi tähdellä, jolloin tilaat kaikki uudet saalisraportit mitä meille tulee. Jos haluat poistaa suosikeista, paina vesistön nimeä pohjassa.",
    "Permit": "Lupa",
    "Permits": "Luvat",
    "Loading": "Ladataan...",
    "New update available": "Uusi päivitys saatavilla",
    "There is a new update available": "Uusi päivitys on saatavilla. Voit asentaa sen välittömästi, se vie vain pari sekunttia. Voit myös lykätä päivitystä, ja se asennetaan automaattisesti kun seuraavan kerran käynnistät sovelluksen.",
    "Install": "Asenna",
    "Postpone": "Lykkää",
    "My Page": "Minun sivuni",
    "List": "Lista",
    "Control panel": "Ohjauspaneeli",
    "Wallet Balance": "Tilin saldo",
    "Sold products": "Myy tuotteita",
    "Last year": "Viime vuosi",
    "Close": "Sulje",
    "Continue": "Jatka",
    "Filter": "Suodata",
    "ui": {
        "general": {
            "back": "Takaisin",
            "pull_to_refresh": "Päivitä",
            "shortAmount": "",
            "undo": "Peruuta",
        },
        "map": {
            "outdoors": "Kartta",
            "satellite": "Satelliitti",
        },
        "about": {
            "version": "Versio",
        },
        "admin": {
            "since:date": "Osa organisaatiota lähtien {{date}}",
            "changeOrgButton": "Vaihda organisaatiota",
            "selectOrg": "Valitse organisaatio",
            "check": {
                "manualInstructions": "Syötä lupakoodi alle",
                "scanInstructions": "Paina nappia skannataksesi QR koodin käyttämällä kameraasi",
                "timesChecked-singular:timesChecked": "Lupa on tarkistettu kerran.",
                "timesChecked-plural:timesChecked": "Lupa on tarkistettu {{timesChecked}} kertaa.",
                "timesChecked-never": "Lupaa ei ole tarkistettu kertaakaan.",
                "logCheck": "Log permit verification",
                "sendComment": "Lisää kommentti",
            },
            "userLevel": {
                "0": "Level 0",
                "1": "Level 1",
                "2": "Level 2 (Complete access)",
            },
            "stats": {
                "offline": "Emme tallenna statistiikkaa offline tilassa. Yhdistä internettiin ja yritä uudelleen.",
                "noAccess": "Tarkistellaksesi tilastoja käyttäjätason täytyy olla ainakin 1",
            },
            "log": {
                "inspected": "Tarkastanut",
                "addOne": "+1 Kontrolloinut",
                "removeOne": "-1 Kontrolloinut",
                "revoked": "Kumonnut",
                "unrevoked": "Ei kumottu",
                "note": "Lisätty huomautus",
                "unknown": "Tunnistamaton toiminta",
            },
            "filter": {
                "instructions": "Valitse luvat jotka haluat näyttää",
            },
        },
        "onboarding": {
            "welcome": {
                "title": "Tervetuloa!",
                "subtitle": "Tervetuloa iFiskeen. Olemme Ruotsin suurin kalastuslupa portaali ",
            },
            "explore": {
                "title": "Tutustu!",
                "content": "<ul><li>Löydä uusia mielenkiintoisia kalastuspaikkoja</li><li>Suunnittele seuraava kalastusreissusi</li><li>Tutki karttoja, kalalajeja, sääntöjä ja paljon muuta</li></ul>",
            },
            "secure": {
                "title": "Talleta!",
                "subtitle": "Osta turvallisesti kalastuslupasi verkossa ja saa se toimitettuna tähän sovellukseen. Sadattuhannet asiakkaat luottavat meihin ja Trygg eHandelin varmentama. ",
            },
            "notify": {
                "title": "Pysy ajan tasalla!",
                "subtitle": "Talleta suosikkipaikkasi ja saa uusia saalisraportteja suoraan ilmaiseksi sähköpostiisi ",
            },
            "skip": "Ohita",
            "next": "Seuraava",
            "continue": "Aloita",
        },
        "placeholder": {
            "email": "esim. nimi@domain.com",
            "password": "••••••••",
            "recovery_code": "123456",
            "fullname": "esim. John Smith",
            "activationCode": "esim. 1234",
            "username": "esim. John77",
            "phone": "esim. +46 70 123 45 67",
            "permit": "esim. 12345678",
            "zip": "esim. 123 45",
            "adr": "esim. Fishing Blvd. 55",
            "town": "esim. Fishville",
        },
        "issues": {
            "long_text": "<p>Oletko löytänyt sovelluksesta bugin tai ongelman?</p><p>Kehotamme raportoimaan bugeista tänne <a href=\"https://github.com/ifiske/ifiske/issues\">GitHub</a></p><p>Sinun täytyy olla kirjautuneena Githubiin kirjoittaaksesi – mutta vastaukseksi saat palautetta kun ongelma on ratkaistu! Tunnuksen tekeminen GitHubiin on ilmaista. </p><p>Jos et voi käyttää GitHubia, otamme raportteja vastaan myös <a href=\"mailto:app@ifiske.se\">app@ifiske.se</a>. Varmista, että kuvailet virhettä tarkasti ja kerro myös mitä puhelinta käytät. Bugi reportit kuten \"Se ei toimi\" eivät ole kovin hyödyllisiä meille. </p>",
        },
        "permit": {
            "validBetween": "Voimassa oleva välillä",
            "purchased": "Ostettu",
            "admin": {
                "header": "Tarkistuskerrat",
                "more": "Ylläpitäjän toiminnot",
                "toast": "Lisätty vahvistus",
            },
            "validity": {
                "active": "Voimassa oleva",
                "inactive": "Ei toiminnassa oleva",
                "revoked": "Peruutettu",
                "expired": "Päättynyt",
                "plural": {
                    "active": "Voimassa oleva",
                    "inactive": "Ei toiminnassa oleva",
                    "revoked": "Peruutettu",
                    "expired": "Päättynyt",
                },
            },
        },
        "developer": {
            "betaOptIn": "Asenna beta versiot",
            "checkForUpdates": "Tarkista päivitykset",
        },
        "reviews": {
            "title": "Pidätkö sovelluksesta?",
            "message": "Palautteesi auttaa meitä kalastamaan helpommin. Jätä palaute!",
            "yes": "Kyllä",
            "no": "Ei",
        },
        "share:area": "Lähdetään kalastamaan {{area}}!",
        "changePassword": {
            "completed": "Salasana vaihdettu!",
        },
        "deliveryAddress": {
            "zip": "Postinumero",
            "adr": "Katuosoite",
            "town": "Kaupunki",
        },
        "analytics": {
            "title": "Auta meitä kehittämään sovellusta!",
            "description": `Parantaaksemme sovellusta haluaisimme kerätä hieman infoa sovelluksen käytöstäsi. Tämä informaatio sisältää:
        <ul>
            <li>How you navigate</li>
            <li>Your searches</li>
            <li>Aggregated demographics</li>
        </ul>
        For more information, se our <a>privacy policy</a>.`,
            "accept": "Hyväksy",
            "decline": "Kieltäydy",
        },
    },
    "errors": {
        "unknown": "Tapahtui tunnistamaton virhe. Kokeile uudestaan, kiitos.",
        "permit": {
            "failedHeader": "Lupaasi ei löydetty",
            "failedBody": "Tämä johtuu todennäköisesti huonosta internetyhteydestä. Tarkista internetyhteytesi ja yritä uudelleen.",
        },
        "admin": {
            "noPermits": "Lupia ei löytynyt",
            "permit": {
                "failedHeader": "Lupaa ei löydetty koodilla <strong>{{code}}</strong>.",
                "failedBody": "Tämä voi johtua väärän koodin syöttämisestä, tai lupa saattaa olla toisesta organisaatiosta. \n\nJos luulet, että sinun pitäisi pystyä nähdä tämä lupa, tarkista että koodi on syötetty oikein.",
            },
            "scanQR": {
                "invalid": "QR koodia ei voitu skannata",
            },
        },
        "network": "Internetin kanssa ilmeni ongelma, varmista että olet yhdistetty internettiin ja yritä uudestaan ",
        "area": {
            "notSelling": "Tämä organisaatio ei myy lupia iFisken kautta",
        },
        "recovery_code": {
            "required": "Sinun täytyy syöttää palauttamiskoodi",
            "invalid": "epäkelpo palauttamiskoodi",
        },
        "register": {
            "failed": "Rekisteröinti epäonnistui",
        },
        "activationCode": {
            "required": "Sinun täytyy syöttää aktivointikoodi",
            "invalid": "Epäkelpo aktivointikoodi",
            "invalidRequest": "Epäkelpo käyttäjätunnus tai aktivointikoodi ",
            "pattern": "Täytyy olla täsmälleen 4 numeroinen ",
        },
        "password": {
            "required": "Sinun täytyy syöttää salasana",
            "invalid": "Väärä salasana",
            "pattern_mismatch": "6-16 merkkiä ",
        },
        "username": {
            "required": "Sinun täytyy syöttää käyttäjätunnus",
            "invalid": "Väärä käyttäjätunnus",
            "pattern_mismatch": "Täytyy olla merkkejä 5 ja 25 välillä ",
            "taken": "Käyttäjänimi on jo käytössä",
        },
        "fullname": {
            "required": "Sinun täytyy syöttää etu-ja sukunimi",
            "pattern_mismatch": "Täytyy olla merkkejä välillä 5 ja 50",
        },
        "email": {
            "required": "Sinun täytyy syöttää sähköpostiosoite",
            "taken": "Tämä sähköposti on jo rekisteröity",
            "invalid": "Epäkelpo sähköposti",
        },
        "phone": {
            "invalid": "Epäkelpo puhelinnumero",
            "pattern": "Täytyy olla merkkejä välillä 5 ja 25 ",
            "required": "Sinun täytyy syöttää puhelinnumerosi",
        },
        "favorite": {
            "notification_update": "Ongelma ilmeni. Ilmoitusasetuksiasi ei muutettu.",
        },
    },
    "Statistics": "Tilastot",
    "recovery": {
        "start": "Palautuskoodi lähetetään pian kautta",
        "and": " ja ",
        "end": ".",
        "mail_spam_notice": "Jos et löydä sähköpostia, katso roskapostistasi.",
    },
    "Create Account": "Luo tunnus",
    "About the app": "Tietoja",
    "Accept": "Hyväksy",
    "Activate": "Aktivoi",
    "Activating": "Aktivoidaan...",
    "Activation code lost": "Jos hukkasit aktivointikoodisi, on mahdollista luoda uusi tunnus samoilla valtuuksilla kuin aikaisemmin.",
    "Activation code sent": "Aktivointikoodi lähetetään sähköpostiin {{phone}} muutaman minuutin kuluessa.",
    "Activation code": "Aktivointikoodi",
    "Activation took too long": "Jos viesin saapumiseen kuluu pitkä aika, paina tästä ja yritämme lähettää sen uudestaan.",
    "Admin": "Ylläpitäjä",
    "Administration": "Ylläpitäjä",
    "Angler record": "Onginta rekisteri",
    "Are you sure?": "Oletko varma?",
    "Area added to favorites": "Alue on nyt merkitty suosikiksi ",
    "Area removed from favorites": "Alue ei ole enään merkitty suosikiksi",
    "Cancel": "Peru",
    "Catch report": "Saalisraportti",
    "Change language": "Vaihda kieltä",
    "Change user info": "Vaihtaaksesi käyttäjätietoja, mene osoitteeseen www.ifiske.se – Siellä voit myös lisätä lisää puhelinnumeroja tunnukseesi, jne.",
    "Check permit": "Tarkista lupakoodi",
    "Check": "Tarkista",
    "Code": "Koodi",
    "Contact Information": "Yhteystiedot",
    "Contact": "Ota meihin yhteyttä",
    "Could not set up push notifications": "Push-ilmoituksia ei voitu asentaa",
    "Counties": "Maakunnat",
    "County": "Maakunta",
    "Create new account": "Luo uusi tunnus",
    "Description": "Kuvaus",
    "Delivery Address": "Osoite",
    "Email": "Sähköposti",
    "Error": "Virhe",
    "Favorites": "Suosikit",
    "Files": "Tiedostot",
    "First name": "Etunimi",
    "Fishing Area": "Kalastusalue",
    "Fishing Areas": "Kalastusalueet",
    "Fishing Methods": "Kalastustavat",
    "Forgot password": "Unohditko salasanasi?",
    "Full name": "Koko nimi",
    "Home": "Koti",
    "I accept the terms of service": "Hyväksyn käyttöehdot",
    "I have a recovery code": "Minulla on palauttamiskoodi",
    "iFiske - Easier Fishing": "iFiske – Helpompaa kalastamista",
    "in": "in",
    "Information": "Informaatio",
    "invalid": "Epäkelpo",
    "Issued at": "Myönnetty klo <b>{{date}}</b>",
    "Issued to": "Myönnetty henkilölle {{name}}",
    "Last updated": "Päivitetty viimeksi",
    "Permit has expired": "Ei enään voimassa oleva",
    "Log in": "Kirjaudu sisään",
    "Logging in": "Kirjaudutaan sisään...",
    "Log out": "Kirjaudu ulos",
    "Login required for favorite": "Sinun täytyy olla kirjautuneena sisään merkitäksesi kalastusalueita suosikiksesi",
    "Make sure you have the correct name": "Varmista, että olet syöttänyt oikean nimen ennen kuin lähetät tekstiviestisi!",
    "Map": "Kartta",
    "More in control panel": "Lisää toimintoja löytyy ohjauspaneelista sivulla www.ifiske.se",
    "My Fishing Permits": "Kalastuslupani",
    "Name": "Nimi",
    "New account": "Uusi tunnus",
    "New password": "Uusi salasana",
    "Next": "Seuraava",
    "No data": "Ei dataa saatavilla",
    "No favorites": "Et ole vielä lisännyt vesistöjä suosikiksesi",
    "No permits": "Kun ostat kalastuslupia, ne ovat listattu tähän",
    "Notifications are turned off": "Ilmoitukset ovat poistettu käytöstä",
    "Notifications are turned on": "Ilmoitukset ovat laitettu päälle",
    "Notify via email": "Ilmoitukset sähköpostiin",
    "OK": "OK",
    "Open control panel": "Avaa ohjauspaneeli",
    "Open Source Licenses": "Avoimen lähdekoodin lisenssit",
    "Password changed": "Salasanasi on vaihdettu",
    "Changing password": "Vaihdetaan salasanaa...",
    "Password": "Salasana",
    "PDF": "PDF",
    "Phone number": "Puhelinnumero",
    "Prevalence": "Yleisyys",
    "Profile": "Profiili",
    "Purchase": "Osta",
    "Purchase permit": "Osta kalastuslupa",
    "Push notifications": "Push ilmoitukset",
    "Register": "Rekisteröidy",
    "Registering": "Rekisteröidään...",
    "Registering account approves": "Rekisteröitymällä hyväksyt meidän",
    "Report issue": "Ilmoita ongelmasta",
    "Recovery code": "Palautuskoodi",
    "Recover password": "Palauta salasana",
    "Revoke": "Peruuta",
    "Revoking": "Peruutetaan",
    "Rules": "Säännöt",
    "Scan QR code": "Skannaa QR koodi",
    "Search results": "Etsi tuloksia",
    "Search": "Etsi",
    "Send": "Lähetä",
    "Settings": "Asetukset",
    "Size and growth": "Koko ja kasvu",
    "SMS": "Tekstiviesti",
    "Species": "Lajit",
    "Surname": "Sukunimi",
    "Technique advanced": "Edistyneet vinkit",
    "Technique description": "Kuvaus(Alkeet)",
    "Technique gear": "Varusteet",
    "Terms of service": "Ehdot",
    "Text message format": "Lähetä tekstiviesti seuraavassa muodossa:",
    "This will revoke the permit": "Tämä peruuttaa luvan",
    "This will unrevoke the permit": "Tämä palauttaa luvan",
    "to": "lle",
    "Try again": "Yritä uudelleen",
    "Unhandled API error": "Odottamaton API virhe, yritä myöhemmin uudelleen",
    "Unrevoke": "Palauta",
    "Unrevoking": "Palautetaan",
    "Update stored data": "Päivitä tallennetut tiedot",
    "Use existing registration code": "Käytä olemassaolevaa koodia",
    "User already has recovery code": "Jos sinulla on jo palautuskoodi, voit hypätä tämän vaiheen yli.",
    "User does not exist": "Käyttäjää ei ole olemassa",
    "User information": "Käyttäjätiedot",
    "User phone numbers": "Yhdistetyt puhelinnumerot",
    "Username or email": "Käyttäjänimi tai sähköposti:",
    "Username": "Käyttäjänimi",
    "Version": "Version numero",
    "Youtube": "YouTube",
    "Verify Account": "Varmista tunnuksesi",
    "Logging out": "Kirjaudutaan ulos...",
    "Searching": "Etsitään...",
    "Change Password": "Vaihda salasana",
    "New Password": "Uusi salasana",
    "Analytics": "Kerää analytiikkaa",
}
