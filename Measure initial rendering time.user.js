// ==UserScript==
// @name         Measure initial rendering time
// @run-at document-end
// @version      0.1
// @author       You
// @include      http://localhost/googlecharts/*
// @grant        none
// ==/UserScript==

var iterations = 100;
var count = localStorage.getItem('count');

(function() {
    'use strict';
    if(count == null){
        count = 0;
        localStorage.setItem('count' , count);
    }

    if(count < iterations){
        setTimeout(function() {
            document.getElementById("render").click();
            if(count == 0){
                var str="";
            }else{
                str = localStorage.getItem('theData');
            }
            str+="\n"+localStorage.getItem('renderTime');
            count++;
            localStorage.setItem('count' , count);
            localStorage.setItem("theData",str);
            window.location.reload();
        }, 2000);
    }else{
        var anchor = document.createElement("a");
        var theData = localStorage.getItem('theData');
        var data = new Blob([theData], {type: 'text/plain'});
        var url = URL.createObjectURL(data);
        anchor.setAttribute("href", url);
        anchor.setAttribute("download", "googlecharts_initialtest");
        anchor.innerHTML= "Click Here to download";
        document.body.appendChild(anchor);
        anchor.click();
    }

})();


