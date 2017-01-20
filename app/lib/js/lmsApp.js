'use strict';

angular.module('lms', [
    'lms.services',
    'lms.directives',
    'lms.controllers',
    function() {
        'use strict';
        //Center lms window on load
    	var windowHeight = window.outerHeight;
    	var windowWidth = window.outerWidth;
    	var screenResize = true;
    	$( document).ready( function () {
    		//Set window size and asign to variables``
            intHorizontal = screen.width
            intVertical = screen.height
            //Center screen at startup
            intLeft = (intHorizontal - windowWidth) / 2
          	intTop = (intVertical - windowHeight) / 2
            window.resizeTo(windowWidth,windowHeight)
            window.moveTo(intLeft, intTop)
        });
        //Remove Splash screen after load.
        setTimeout(
            function() {
                $('.lms-App, #lms-Main-Container').removeClass('hide');
                $('.splash-container .container').remove();
                $('.splash-logo, .splash-tag').css({
                    "color":"#e4e4e4",
                     "text-shadow": "1px 1px white, -1px -1px #c8c8c8"
                })
                $('body').css("background", "#f8f8f8");
            }, 100);
    }
])
