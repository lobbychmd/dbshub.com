$("<script type='text/x-jquery-tmpl'>").attr('id', "QueryParams").html("<h1>${value}</h1>").appendTo("body");

$("<style >").html(".QueryParams h1{color: red}").appendTo("body");

$.uicontrols.QueryParams = {
    demoData: function () {
        var data = { value: "asdf" };
        return data;
    }


};

$.fn.QueryParams = function(){
    return this.each(function(){
        $(this).click(function(){
            alert(1);

        });      
    });


};