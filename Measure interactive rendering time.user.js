// ==UserScript==
// @name         Measure interactive rendering time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require       https://chancejs.com/chance.min.js
// @description  Get the rendering times in ms for updating the chart
// @include     http://localhost/googlecharts/*
// @author       You
// @grant        none
// ==/UserScript==

let checkboxes = document.getElementsByClassName('statusCheckbox');
let iterations = 100;
let count = localStorage.getItem('count');
//using chance.js with seed for randomizing bool true/false
var chance1 = new Chance(1 + count);

(function() {
    'use strict';
    
    if(count == null){
        count = 0;
        localStorage.setItem('count' , count);
    }

    if(count < iterations){
        setTimeout(function() {
            document.getElementById("render").click();

            for(var i = 0; i < checkboxes.length; i++){
                if(chance1.bool()){
                    checkboxes[i].checked = true;
                }
            }

            document.getElementById("updatebtn").click();

            if(count == 0){
                var str="";
            }
            else{
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
        anchor.setAttribute("download", "interactive_googlecharts");
        anchor.innerHTML= "Click Here to download";
        document.body.appendChild(anchor);
        anchor.click();
    }

})();