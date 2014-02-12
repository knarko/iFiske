/**
 * Created by erik on 2014-02-12.
 */
    function login() {
        $.ajax( {
            url: "http://www.ifiske.se/index.php?option=com_ifiskeapi&view=api&format=raw&action=get_user_subscriptions&uid="+$("#user").val()+"&pw="+$("#passw").val(),
            dataType: "xml",
            success: parse,
            error: function(e) {
                alert(e);
            }
        })
}
function parse(document)
{
    $(document).find("subscription").each(function() {
        //ADD THIS TO JSON FILE/MANIFEST OR SQLITE-DATABASE
        $("#content").append(
            '<p>'+$(this).attr('org_title')+'</p>' +
                '<p>'+$(this).attr('fullname')+'</p>' +
                '<p>'+$(this).attr('address')+'</p>' +
                '<p>'+$(this).attr('zip')+'</p>' +
                '<p>'+$(this).attr('city')+'</p>' +
                '<p>'+$(this).attr('ref_our')+'</p>' +
                '<p>'+$(this).attr('ref_their')+'</p>' +
                '<p>'+$(this).attr('mobile')+'</p>' +
                '<p>'+$(this).attr('ruleID')+'</p>' +
                '<p>'+$(this).attr('product_title')+'</p>' +
                '<p>'+$(this).attr('id')+'</p>' +
                '<p>'+$(this).attr('email')+'</p>' +
                '<p>'+$(this).attr('code')+'</p>' +
                '<p>'+$(this).attr('PDFid')+'</p>' +
                '<p>'+$(this).attr('orgid')+'</p>' +
                '<p>'+$(this).attr('title')+'</p>' +
                '<p>'+$(this).attr('purchased_at')+'</p>' +
                '<p>'+$(this).attr('areaid')+'</p>' +
                '<p>'+$(this).attr('validFrom')+'</p>' +
                '<p>'+$(this).attr('validTo')+'</p>' +
                '<p>'+$("#user").val()+'</p>' +
                '<p>'+$("#passw").val()+'</p>'
        )
    })
}



