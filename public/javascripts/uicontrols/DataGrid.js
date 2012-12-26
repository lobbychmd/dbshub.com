
$.uicontrols.xyGrid = {
    params2tmpl: function (uiparams, pageInfo) {
        return uiparams;
    }
};

$.fn.xyGrid = function () {
    return this.each(function () {
        
    });


};


$.uicontrols.xyGridTable = {
    params2tmpl: function (uiparams, pageInfo) {
        uiparams.pageInfo = pageInfo;
        var table = pageInfo.dataSet[uiparams.table];
        uiparams.data = { columns: table.Columns, rows: [] };

        for (var i in table.Rows) {
            var row = [];
            //var href = uiparams.href + "?";
            var href = window.location.toString(); href = href.substring(0, href.length - 1) + "1&";
            for (var j in table.Columns) {
                row.push({ key: table.Columns[j].fieldName, value: table.Rows[i][table.Columns[j].fieldName] });
            }
            uiparams.data.rows.push(row);

        }
        return uiparams;
    }
};

$.fn.xyGridTable = function () {
    return this.each(function () {

        $(this).GridExtenPlus();

    });


};
$.fn.GridExtenPlus=function(){
	return this.each(function(){
		var Grid = $(this);
		Grid.addClass("GridExtenPlus");
		var dhead = Grid.find("div:eq(0)").addClass("dhead");
		var dbody = Grid.find("div:eq(1)").addClass("dbody");
		var dfoot = Grid.find("div:eq(2)").addClass("dfoot");
		var thead = dhead.find("table:first").addClass("thead");
		var tbody = dbody.find("table:first").addClass("tbody");
		var tfoot = dfoot.find("table:first").addClass("tfoot");
		
		//增加序号列
		thead.find("tr").each(function(){
			$(this).prepend("<td class='zClum'><span class='tab_down'></span></td>");
		});
		var n = 1;
		tbody.find("tr").each(function(){
			$(this).prepend("<td class='zClum'>"+n+"</td>");
			n++;
		});
		tfoot.find("tr").each(function(){
			$(this).prepend("<td class='zClum'></td>");
		});
		
		//固化basewidth
		//获取表头字段个数
		var cellcount =  thead.find("td").size();
		//统计3个表格 每列列宽  每列根据列宽最大的设置固定列宽
		var mw = 0;
		var a=0,b=0,c=0
		for(var k=0;k<cellcount;k++){
			 a = thead.find("tr:first").find("td:eq("+k+")").outerWidth(true);
			 b = tbody.find("tr:first").find("td:eq("+k+")").outerWidth(true);
			 c = tfoot.find("tr:first").find("td:eq("+k+")").outerWidth(true);
			 //取3个表格对应列的列宽最大的 作为列宽基本值
			 mw = a >= (b >=  c ? b:c) ? a : (b >=  c ? b:c);
			 thead.find("tr:first").find("td:eq("+k+")").attr("tdid",k).attr("basewidth",mw).width(mw);
			 tbody.find("tr:first").find("td:eq("+k+")").attr("tdid",k).attr("basewidth",mw).width(mw);
             tfoot.find("tr:first").find("td:eq("+k+")").attr("tdid",k).attr("basewidth",mw).width(mw);
		}
		//设置表格总宽度 
		var tw = thead.outerWidth();  //总宽度
		//设置basewidth 外层div宽度18留给滚动条
		thead.attr("basewidth",tw)
		tbody.attr("basewidth",tw)
		tfoot.attr("basewidth",tw)
		dhead.width(tw+18).attr("basewidth",tw+18);
		dbody.width(tw+18).attr("basewidth",tw+18);
		dfoot.width(tw+18).attr("basewidth",tw+18);
	
		//自定义控件宽度
		if(Grid.attr("width"))	Grid.width(Grid.attr("width")); 
		//自定义控件高度
		if(Grid.attr("height"))	Grid.height(Grid.attr("height"));
		
		//设置高度
		 var ph = Grid.height()-dhead.outerHeight()-dfoot.outerHeight()-18; //预留底部滚动条18px
		 if(ph<40) {
			ph = 40;  //最小值40 再小就看不到滚动条了
		 	Grid.height(Grid.height()+18);  //设置为40 底部滚动条预留高度要重新加上
		 }  //
		 dbody.height(ph);  
		
		//表体行条纹
        Grid.find("table.tbody tr:odd").each(function () {
            $(this).addClass("stripe");
        });
		
		
		//增加拉伸线
		$("<div class='line'></div>").appendTo(Grid);
		
		//表格列宽拉伸事件
		thead.find("td:not('.zClum')").bind("mousemove",function(e){
			var fx,fy;
			var tdw = $(this).outerWidth(true);
			var tdh = $(this).outerHeight(true);
			//获取鼠标相对于td的绝对位置
			fx = e.pageX - parseInt($(this).offset().left);
			fy = e.pageY - parseInt($(this).offset().top);
			//当前td
			var thistd = $(this);
			//在右边往左5px的区域 绑定拉伸事件
			if(fx >= tdw-5 && fx <tdw && fy>0 &&fy<tdh){
				$(this).css("cursor","e-resize");
				//先解绑 防止重复绑定
				$(this).unbind("mousedown").bind("mousedown",function(e){
					//禁止选择  兼容部分浏览器
					$("body").attr("onselectstart", "return false");
					
					//起始x坐标
					var sx =  e.pageX;
					//获取当前控件高度  显示拉伸线
					var ah = thistd.closest(".GridExtenPlus").height();
					
					var ax = thistd.closest(".GridExtenPlus").find("table:first").offset().top;
					thistd.closest(".GridExtenPlus").find("div.line").height(ah).show().offset({ top: ax, left: sx });
					//拉伸
					$(document).bind("mousemove",function(e){
               			//移动拉伸线
						thistd.closest(".GridExtenPlus").find("div.line").offset({ top: ax, left: e.pageX});
						//清除选择 防止部分浏览器第二次拖动时是选择状态
						if ($.browser.mozilla || $.browser.safari || ($.browser.msie && $.browser.version >= 9))
							window.getSelection().removeAllRanges();
					}).bind("mouseup",function(e){
						//改变后的理论宽度
						var ew = thistd.width()+(e.pageX-sx);
						//如果变换后的宽度小于列基本宽度 则只变换到基本宽度
						if(ew <= parseInt(thistd.attr("basewidth"))) {
							ew = parseInt(thistd.attr("basewidth"));
						}
						//变换值
						var changew = ew - thistd.width();
						//console.log(ew+"--"+thistd.width()+"--"+changew);
						//当前td的id
						var thistdid = thistd.attr("tdid");
						//变化
						thistd.closest(".GridExtenPlus").find("table").each(function(){
							var tb  = $(this);
							var tableew = tb.width()+changew;
							tb.width(tableew).closest("div").width(tableew+18);
							tb.find("tr:first").find("td:eq("+thistdid+")").width(ew);
						});
						//需重新校验各个表格宽度
						for(var k=0;k<cellcount;k++){
							var tempw = thistd.closest(".GridExtenPlus").find("table:eq(0) tr:first").find("td:eq("+k+")").width();
							thistd.closest(".GridExtenPlus").find("table:eq(1) tr:first").find("td:eq("+k+")").width(tempw);
                            thistd.closest(".GridExtenPlus").find("table:eq(2) tr:first").find("td:eq("+k+")").width(tempw);
						}
						//解绑所有事件
						$(this).unbind("mousemove").unbind("mouseup");
						thistd.unbind("mousedown");
						//隐藏拉伸线
						thistd.closest(".GridExtenPlus").find("div.line").hide();
						//取消禁止选择
						$("body").removeAttr("onselectstart");
					});
				});
			}else{
				//恢复鼠标样式
				$(this).css("cursor","default");
				thistd.unbind("mousedown");
			}
		});
		
		
		//表头菜单
		Grid.find("table.thead tr:first").find("td.zClum").click(function(){
			var obj = $(this).closest(".GridExtenPlus");
			//获取表头字段个数
			var clumcount =  obj.find("table.thead tr:first").find("td").size();
			
			var mw = 0;
			var tw = 0;  //总宽度
			for(var k=0;k<clumcount;k++){
				 mw =  parseInt(obj.find("table.thead tr:first").find("td:eq("+k+")").attr("basewidth"));
				 tw += mw;  //总宽度
				 obj.find("table.thead tr:first").find("td:eq("+k+")").width(mw);
				 obj.find("table.tbody tr:first").find("td:eq("+k+")").width(mw);
				 obj.find("table.tfoot tr:first").find("td:eq("+k+")").width(mw);
			}
			//设置表格总宽度
			 obj.find("table[basewidth]").each(function(){
				var sx = $(this).attr("basewidth");
				$(this).width(sx);
				sx = $(this).closest("div").attr("basewidth");
				$(this).closest("div").width(sx);
			 });
		});
		
		//行点击事件
		Grid.find("table.tbody tr").bind("click",function(){
			//限制域
			var obj = $(this).closest("table");
			//更新样式
			obj.find("tr.hover").each(function(){
				$(this).removeClass("hover");
			});
			$(this).addClass("hover");
		});
		
		
	});
};