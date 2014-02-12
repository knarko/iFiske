/**
 * Created by erik on 2014-02-12.
 */
    function login() {
        alert("här");
        $.ajax( {
            url: "http://www.ifiske.se/index.php?option=com_ifiskeapi&view=api&format=raw&action=get_user_subscriptions&uid="+$("#user").val()+"&pw="+$("#passw").val(),
            dataType: "xml",
            success: parse,
            error: function(e) {
                alert(e.message);
            }
        })
}
function parse(document)
{
    alert("parse");
    $(document).find("subscription").each(function() {
        //ADD THIS TO JSON FILE/MANIFEST OR SQLITE-DATABASE
        var storage = window.localStorage;
        alert("gunnar");
        $.each(this.attributes, function(i ,attrib) {
            alert("i: " + i + " attrib.name: " + attrib.name + " attr: " + attrib.value);
            storage.setItem(attrib.name, $(this).attr(attrib.name));
        })
    })
}



