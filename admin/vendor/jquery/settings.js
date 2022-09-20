$(document).ready(function () {

    $('.num').click(function () {
        var num = $(this);
        var text = $.trim(num.find('.txt').clone().children().remove().end().text());
        var telNumber = $('#telNumber');
        if(telNumber.val().length<4)
            $(telNumber).val(telNumber.val() + text);
    });
    $("#delete").click(function(){
        var $myInput = $('#telNumber');
        $myInput.val($myInput.val().slice(0, -1));
    });

    $("#clear").click(function(){
        var $myInput = $('#telNumber');
        $myInput.val('');
    });

});