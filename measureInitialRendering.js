// ==UserScript==
// @name         Measure initial rendering time
// @run-at document-end
// @version      0.1
// @author       You
// @include     http://localhost/chartjs/*
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
            count++;
            localStorage.setItem('count' , count);
            if(count == 0){
                str="data:text/csv;charset=utf-8,";
            }
            else{
                var str = localStorage.getItem('theData');
                str+=",\n"+localStorage.getItem('renderTime');
            }
            localStorage.setItem("theData",str);
            window.location.reload();
        }, 2000);
    }else{
        var anchor = document.createElement("a");
        var theData = localStorage.getItem('theData');
        var data = new Blob([theData], {type: 'text/csv'});
        var url = URL.createObjectURL(data);
        anchor.setAttribute("href", url);
        anchor.setAttribute("download", "my_data.csv");
        anchor.innerHTML= "Click Here to download";
        document.body.appendChild(anchor);
        anchor.click();
    }

})();


