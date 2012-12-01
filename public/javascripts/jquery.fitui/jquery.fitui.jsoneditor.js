/**********            通用文档编辑        **************/
/**********   这个要同时引入模板 tmpl.jsoneditor.ejs **************/
$.fitui.jsoneditor = {
    meta2tmpl: function (doc, configure, path, name_prefix, tmplrow) {
        var config = $.extend({
            _id: { caption: 'id', readonly: true },
            _t: { hide: true }
        }, configure);
        var pa = [];
        var prop_tmpl = { readonly: false, reference: false, editor: 'textbox', lineshow: false };
        for (var i in config) { //按照配置来，而不是按照数据属性来(必须设定配置)
            //for (var i in doc) { 
            var c = config[i];
            var array = c && c.children;
            var paths = path ? path + '.' + i : i;
            var name = name_prefix ? name_prefix + '[' + i + ']' : i;
            if (array) {
                if (c && c.editor) { doc[i] = eval(doc[i]); }
                if (!doc[i]) doc[i] = [];
                doc[i].push({  });
                for (var j in doc[i])
                    doc[i][j] = $.fitui.jsoneditor.meta2tmpl(doc[i][j], c.children, paths + '.' + j, name + '[' + j + ']', doc[i].length - 1 == j);
                doc[i][doc[i].length - 1]["tmplrow"] = true;
            }
            var data = { caption: c ? c.caption : i, value: doc[i], path: paths, name: name, tmplrow: tmplrow,
                input: c && c.editor != 'textarea' && c.editor != 'select'
            };
            $.extend(data, prop_tmpl);
            $.extend(data, c);
            data.children = null;
            pa.push({ array: !!array, data: data });
        }
        return pa;
    },
    zip: function (a) {
        $(a).click(function () {
            var container = $(this).parent().closest('.zip');
            if (container.hasClass('unzip')) container.removeClass('unzip');
            else container.addClass('unzip');
        });
    },
    tmplRowEditor: function (designer, multi) {
        $(designer).find("[fieldname]").live('change.tmpl', function () { //新增行 
            if ($(this).val()) { //不加这个会触发2次,因为后面 val('')
                var row = $(this).closest('div.zip');

                var fieldset = row.closest('fieldset');
                var rowCount = fieldset.children('div.zip').size();
                row.clone(true).unbind('change.tmpl').removeClass('tmpl').insertBefore(row).find('[fieldname]').each(function () {
                    $(this).attr('name', $(this).attr('fieldname').replace(/\[(\d+)\]/i, "[" + (rowCount - 1) + "]")).removeAttr('fieldname');
                    //var re = new RegExp("\[(\\d+)\]", "ig"); var n = $(this).attr('fieldname'); var r = n.match(re);
                    //$(this).attr('name', n.replace("[" + r[r.length - 1] + RegExp.rightContext, "[" + (rowCount - 1) + RegExp.rightContext)).removeAttr('fieldname');
                }).end().find('span.rowIndex').text(rowCount).end().find('[identity]').val(rowCount).end().focus();
                $(this).val('');
            }
            //fieldset.trigger('change');
        }).end().find("a.delRow").live("click", function () {

            var fieldset = $(this).closest('fieldset');
            var row = $(this).closest("div.zip");

            if (multi) {  //不删除行 代替 updateflag 的做法
                row.toggleClass('deleted');
                var _id = row.find('[name$=".ProjectName"]');
                if (row.hasClass('deleted')) _id.attr('_id', _id.val()).val('');
                else _id.val(_id.attr('_id')).removeAttr('_id');
            }
            else {  //删除行
                if (confirm("确认要删除整行吗？")) {
                    var rowIndex = parseInt(row.find('span.rowIndex').text()) - 1;
                    row.remove();
                    fieldset.children('div.zip:not(.tmpl)').slice(rowIndex).each(function () {
                        var span = $(this).find('span.rowIndex');
                        var idx = parseInt(span.text());
                        span.text(idx - 1);
                        $(this).find('[name]').each(function () {
                            var name = $(this).attr('name'); var reg = /\[(\d+)\]/i;
                            name = name.replace(reg, '[' + (idx - 2) + ']');
                            $(this).attr('name', name).attr('id', name);
                        });
                    });
                }
            }
            return false;
        });
    }
};

$.fn.jsoneditor = function (doc, type, config) {
    return this.each(function () {
        $(this).addClass('metaObject').attr('title', type); //基础路径
        var data = $.fitui.jsoneditor.meta2tmpl(doc, config[type], type);
        console.log({ all: data });
        $('#metaObject').tmpl(data).appendTo(this);
        $.fitui.jsoneditor.zip($(this).find('a.zip'));
        $.fitui.jsoneditor.tmplRowEditor(this, false);
    });
}

$.fn.createNavigation = function (nav, option) {
    return this.each(function () {
        var designer = this;
        if (option && option.reset) {

            //放回原处
            // var currPath = ul.children('li.last').attr('path');
            // if (currPath != $(designer).attr('title')) {
            var curr = $(designer).find('[zw]');
            var id = curr.attr('zw');
            var zw = $(designer).find('#' + id);
            curr.insertBefore(zw).removeAttr('zw');
            zw.remove();
            // } //放回原处 end
        }
        else {
            var basepath = $(designer).attr('title');
            $(nav).navigation({ homePath: option.homePath, change: function (path) {
                $(designer).createNavigation(nav, { reset: true });
                if (path == $(designer).attr('title')) //最顶层
                    $(designer).children().show();
                else {
                    $(designer).find('a.fullscr[title="' + path + '"]').click();
                }
            }
            });
            $(designer).find('.fullscr').live('click', function () {
                var title = $(this).attr('title').split('.');
                var p = '';
                for (var i in title) {
                    p = p + (p ? '.' : '') + title[i];
                    $(nav).navigation({ createPath: true, path: p, text: $(designer).find('[caption][path="' + p + '"]').attr('caption') });
                }
                $(designer).createNavigation(nav, { reset: true });
                var id = "zw" + Math.random().toString().substring(2);

                var zw = $('<span>').attr('id', id);
                var container = $(this).closest('[path]').show().removeClass('unzip');

                zw.insertBefore(container);
                container.insertBefore($(designer).children().eq(0)).attr('zw', id);
                $(designer).children().not(container).hide();

                return false;
            });
        }
    });
}