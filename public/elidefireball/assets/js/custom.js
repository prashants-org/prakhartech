$(document).ready(function(){
    $(".contact-form").submit(function(){
        if($(".contact-form input[name='email']").val()==""){
            $(".contact-form input[name='email']").focus();
            return false;
        }
        if($(".contact-form input[name='mobile']").val()==""){
            $(".contact-form input[name='mobile']").focus();
            return false;
        }
        $.ajax({
            type : "post",
            url  : "thanks.php",
            data : $(this).serialize(),
            success : function(data){
                if (data=="1") {
                    $("form")[0].reset();
                    alert("Successfully Submited.");
                }else{
                    alert("Plaese try Again........!!!");
                }
            }
        });
        return false;
    });
});


(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {

            //ADD REMOVE PADDING CLASS ON SCROLL
            $(window).scroll(function () {
                if ($(".navbar").offset().top >50) {
                    $(".navbar-fixed-top").addClass("navbar-pad-original");
                } else {
                    $(".navbar-fixed-top").removeClass("navbar-pad-original");
                }
            });
            //SLIDESHOW SCRIPT
            $('.carousel').carousel({
                interval: 3000 //TIME IN MILLI SECONDS
            })
            // PRETTYPHOTO FUNCTION 

            $("a.preview").prettyPhoto({
                social_tools: false
            });

       


            /*====================================
               WRITE YOUR SCRIPTS BELOW 
           ======================================*/


        },

        initialization: function () {
            mainApp.main_fun();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.main_fun();
    });

}(jQuery));



