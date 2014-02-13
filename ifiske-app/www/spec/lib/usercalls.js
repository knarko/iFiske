/**
 * Created by erik on 2014-02-12.
 */
function login() {
    $.ajax( {
        url: "http://www.ifiske.se/index.php?option=com_ifiskeapi&view=api&format=raw&action=get_user_subscriptions&uid="+$("#user").val()+"&pw="+$("#passw").val(),
        dataType: "xml",
        success: parse,
        error: function(e) {
            alert(e.message);
        }
    })
}

function logout() {
    if(storage == undefined){
        var storage = window.localStorage;
    }
    storage.clear();
}




function parse(document)
{
    $(document).find("subscription").each(function() {
        //ADD THIS TO JSON FILE/MANIFEST OR SQLITE-DATABASE
        var storage = window.localStorage;
        storage.setItem("timeStamp", new Date().getTime());
        storage.setItem("loggedIn", true);
        $.each(this.attributes, function(i ,attrib) {
            storage.setItem(attrib.name, $(this).attr(attrib.name));
        })
    })
}

function open_store(){
    var storage = window.localStorage;
    return storage;
}

