/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function()
{
    $("#submit").on("click", function() {
        $.ajax( {
            url: "http://www.ifiske.se/index.php?option=com_ifiskeapi&view=api&format=raw&action=get_user_subscriptions&uid="+$("#user").val()+"&pw="+$("#passw").val(),
            dataType: "xml",
            success: parse
          })
    })
});

function parse(document)
{
    $(document).find("subscription").each(function() {

        //ADD THIS TO JSON FILE/MANIFEST OR SQLITE-DATABASE
        /*$("#content").append(
            '<p>$(this).attr('org_title')+'</p>' +
        '<p>$(this).attr('fullname')+'</p>' +
        '<p>$(this).attr('address')+'</p>' +
        '<p>$(this).attr('zip')+'</p>' +
        '<p>$(this).attr('city')+'</p>' +
        '<p>$(this).attr('ref_our')+'</p>' +
        '<p>$(this).attr('ref_their')+'</p>' +
        '<p>$(this).attr('mobile')+'</p>' +
        '<p>$(this).attr('ruleID')+'</p>' +
        '<p>$(this).attr('product_title')+'</p>' +
        '<p>$(this).attr('id')+'</p>' +
        '<p>$(this).attr('email')+'</p>' +
        '<p>$(this).attr('code')+'</p>' +
        '<p>$(this).attr('PDFid')+'</p>' +
        '<p>$(this).attr('orgid')+'</p>' +
        '<p>$(this).attr('title')+'</p>' +
        '<p>$(this).attr('purchased_at')+'</p>' +
        '<p>$(this).attr('areaid')+'</p>' +
        '<p>$(this).attr('validFrom')+'</p>' +
        '<p>$(this).attr('validTo')+'</p>' +
        '<p>$("#user").val()+'</p>' +
        '<p>$("#passw").val()+'</p>'
        )*/
    })
}