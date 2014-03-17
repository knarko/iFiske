var UPDATE = Object.freeze({ 


	man_update : function() {
		alert("Force update commenced!")

        $.ajax( {
            url: 'https://www.ifiske.se/index.php?option=com_ifiskeapi&view=api&format=raw&action=get_areas',
            dataType: 'xml',
            success: function(e) {
                var x2jObj = null;
                alert("gets here")
                xmlDoc = $.parseXML(e),
                $e = $( xmlDoc),
                $regName = $e.find('region').attr("name");
                alert('x2jObj populated: ' +  $regName);
                    //...
            },
            error: function(e) {
                alert(e);
            }
        });




    }
})

