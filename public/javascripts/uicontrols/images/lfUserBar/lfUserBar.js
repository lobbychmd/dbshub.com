// JavaScript Document
$.fn.lfUserBar = function(){
	return this.each(function(){
		var lfUserBar = $(this);
		if(!lfUserBar.hasClass("lfUserBar")) lfUserBar.addClass("lfUserBar");
		
		lfUserBar.find("a.userbar_btn").bind("mouseenter",function(){
			$(this).find("ul.userbar_menu").show();
			var pos = $(this).position();
			var h = $(this).outerHeight();
			$(this).find("ul.userbar_menu").offset({top:pos.top + h ,left:pos.left });
			
			$(this).bind("mouseleave",function(){
				$(this).find("ul.userbar_menu").hide();
				$(this).unbind("mouseleave");
			});
        });

        lfUserBar.find(".icon_home").closest("a").attr("href", $(".lfLayout").find(".softlogo a").attr("href"));
	});	
}