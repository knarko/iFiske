#Globals/API

Functions managing API requests.

##Methods

###request

Sends a request to the server API

Due to inconsistent server-side error handling we cannot check for
any server-side errors here. All error messages/codes in the returned
xml should be handled in the callback function.

Use auth_request for requests requiring authentication data if the
user is already logged in.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>args</td><td><em>Object</em></td><td>Contains request arguments (name -&gt; value)</td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###auth_request

Convenience method wrapper for requests requiring authentication

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>args</td><td><em>Object</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getAreas

Gets all areas and calls a callback with the resulting object

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td>accepts an Object containing regions and areas as input</td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getPhotos

Gets all photos for an organisation

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>org_id</td><td><em>Integer</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getOrganisations

Gets all organisations

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getUpdates

Gets the time of last update from the server

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getSubscriptions

Gets all subscriptions from the server

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###xmlparser

Parses the XML data

For now, uses the XML data to check which function it was called from, and how to
parse that data

**Returns**: _Array or Object_ - Returns parsed javascript Object or Array.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>xmldata</td><td><em></em></td><td></td>
    </tr>
</table>


###authenticate

Used to authenticate a user

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>user</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>password</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###register

Registers a new user

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>username</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>password</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>fullname</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>email</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>phone</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


#Globals/Database

An object that contains the database functions

##Methods

###update

Updates the database if there has been any new updates

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>errorCallback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###clean

Drops all tables in the database

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###init

Initialies the tables in the database

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###updateTable

inserts values into a table

TODO: Create better link between the parsing and this function,
they are highly dependant on each other.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>table
A</td><td><em>String</em></td><td>string containing the name of the table to update, corresponding to a
key name in tableDefinition</td>
    </tr>
    <tr>
        <td>dataset
An</td><td><em>Array</em></td><td>array of arrays, each containing all the values to insert to a row</td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getArea

Gets information about an area

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>id</td><td><em>Integer</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###search

Searches the database using a query

The query is matched vs area.name and area.keyword

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>searchstring</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getProductById

Gets information about a product

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>product_id</td><td><em>Integer</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getProductsByArea

Gets all products from an area

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>area_id</td><td><em>Integer</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getSubscriptions

Gets all subscriptions

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


###getSubscriptionByid

Gets information about a Subscription

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>uid</td><td><em>Integer</em></td><td></td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
</table>


#Globals/Debug

Debug Object for finding Debug lines easier

##Methods

###log

Logs to console using console.log

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>err</td><td><em>Any</em></td><td>Anything that can be logged</td>
    </tr>
</table>


#Globals/app

app namespace

##Methods

###initialize

Application Constructor

###bindEvents

Bind Event Listeners

Bind any events that are required on startup. Common events are:
&#x27;load&#x27;, &#x27;deviceready&#x27;, &#x27;offline&#x27;, and &#x27;online&#x27;.

###onDeviceReady

deviceready Event Handler

The scope of &#x27;this&#x27; is the event. In order to call the &#x27;receivedEvent&#x27;
function, we must explicity call &#x27;app.receivedEvent(...);&#x27;

###receivedEvent

Update DOM on a Received Event

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>id</td><td><em></em></td><td></td>
    </tr>
</table>


###open_fb

Opens a browser window to facebook

###try_open_fb

Tries opening the facebook app, falls back to browser if failed.

#Globals/Navigate

Navigation system for the app
used by all pages to manage history and loading
use by calling Navigate.to('page', onloadfunc, [*args]);
to back, call window.history.back() which will be

##Methods

###init

Initial app state. Loads start screen and adds initial history entry.

###to

Navigates to target template and adds history entry.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>target</td><td><em>String</em></td><td>The target page to load into #content</td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>args</td><td><em>Object</em></td><td>arguments for the callback</td>
    </tr>
</table>


###back

Navigates to previous history entry

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>e</td><td><em>Event</em></td><td>History event</td>
    </tr>
</table>


###navigate

Internal function used in Navigate to load a page and call neccessary callbacks

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>target</td><td><em>String</em></td><td>The target page to load into #content</td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>args</td><td><em>Object</em></td><td>arguments for the callback</td>
    </tr>
</table>


###popup

Spawns a popup containing target template.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>target</td><td><em>String</em></td><td>Page to popup</td>
    </tr>
    <tr>
        <td>callback</td><td><em>Function</em></td><td></td>
    </tr>
    <tr>
        <td>args</td><td><em>Object</em></td><td>Arguments for the callback</td>
    </tr>
</table>


###closePopup

Closes an open popup

#Pages/area



**Extends**: Page

##Methods

###parse

Parses text and creates newlines

**Returns**: _String_ - Parsed text

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>text</td><td><em>String</em></td><td></td>
    </tr>
</table>


#Pages/area_cards



**Extends**: Page

##Methods

###createLicense

Create a div representing a fishing license

**Returns**: __ - String

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>row</td><td><em></em></td><td></td>
    </tr>
</table>


#Pages/card



**Extends**: Page

#Pages/login



**Extends**: Page

##Methods

###auth

Authenticates the user

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>form</td><td><em></em></td><td></td>
    </tr>
</table>


#Pages/my_cards



**Extends**: Page

##Methods

###createCard

Creates a new fishing card

**Returns**: _String_ - 

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>props</td><td><em>Object</em></td><td></td>
    </tr>
</table>


###buttonclick

Listener for buttonclick

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>e</td><td><em>Event</em></td><td></td>
    </tr>
</table>


#Pages/register



**Extends**: Page

##Methods

###validate_password_confirm

Validates password confirmation

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>e</td><td><em>Event</em></td><td></td>
    </tr>
</table>


###validate_register

Invalidates the registration form. Displays potential errors.

Calls API.register(...) on success.

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>form</td><td><em></em></td><td></td>
    </tr>
</table>


#Pages/search



**Extends**: Page

##Methods

###createButton

Creates a button string

**Returns**: __ - String

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>props</td><td><em>Object</em></td><td></td>
    </tr>
</table>


###buttonclick

Listener for buttonclick

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>e</td><td><em>Event</em></td><td></td>
    </tr>
</table>


#Pages/settings



**Extends**: Page

##Methods

###logout

Logs out by removing username and password from localstorage

###force_update

Forces an update

###reportBug

Links to bug report page

#Pages/Page

base class for pages

##Methods

###go

Navigates to the page

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>id</td><td><em>Integer</em></td><td></td>
    </tr>
</table>


###onload

Called when done loading

**Returns**: __ - 

**Params**:
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
        <td>text</td><td><em>String</em></td><td></td>
    </tr>
    <tr>
        <td>id</td><td><em>Integer</em></td><td></td>
    </tr>
</table>


#Pages/start



**Extends**: Page


