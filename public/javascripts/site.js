$.jsoneditorSetup({config: {
    MetaTheme: {
        Theme: { caption: "主题名称" },
        LayoutUI: { caption: "界面配置", editor: 'textarea', scriptType: 'application/json' },
        StyleSheet: { caption: "样式", children:{
                StyleSection: { caption: '控件', lineshow: true },
                StyleContent: { caption: '样式', editor: "textarea", scriptType: 'application/json' }
            }
        }
    },
    MetaBiz: {
        BizID: { caption: "业务逻辑ID" },
        ConnAlias: { caption: "数据连接" },
        Checks: { caption: "业务检查", children:{
            CheckIdx: { caption: '序号', lineshow: true, identity: true, maxLength: 3 },
            CheckEnabled: { caption: '启用', lineshow: true, editor: "checkbox" },
            ParamToValidate: { caption: '检查参数', lineshow: true, selection: "@Params.ParamName" },
            CheckSummary: { caption: '描述', lineshow: true, key: true },
            CheckRepeated: { caption: '重复执行', editor: "checkbox" },
            Type: { caption: '检查类型', editor: "select", selection: [{ key: "Required", value: "必须录入" }, { key: "CompareTo", value: "比较" }, { key: "Query", value: "存在于查询中" }, { key: "SQL", value: "返回ResultCode=0"}] },
            CompareType: { caption: '比较类型', editor: "select", selection: [{ key: "=", value: "相等" }, { key: ">", value: "大于" }, { key: ">=", value: "大于等于" }, { key: "<", value: "小于" }, { key: "<=", value: "小于等于" }, { key: "<>", value: "不等于"}] },
            ParamToCompare: { caption: '比较参数', selection: "@Params.ParamName" },
            CheckUpdateFlag: { caption: '检查标志', editor: 'select', selection: [{ key: "UpdateFlag", value: 'UpdateFlag' }, { key: "UpdateFlag2", value: 'UpdateFlag2' }, { key: "UpdateFlag3", value: 'UpdateFlag3' }, { key: "UpdateFlag4", value: 'UpdateFlag4' }, { key: "UpdateFlag5", value: 'UpdateFlag5'}] },
            CheckExecuteFlag: { caption: '检查执行标志', editor: 'select', selection: [{ key: "IUD", value: "增删改" }, { key: "IU", value: "增改" }, { key: "ID", value: "增删" }, { key: "UD", value: "删改" }, { key: "I", value: "增" }, { key: "U", value: "改" }, { key: "D", value: "删"}] },
            CheckSQL: { caption: '检查SQL脚本', editor: "textarea", designer:["codemirror"] }                                
        } },
        Scripts: { caption: "业务过程", children: {
            ProcIdx: { caption: '序号', lineshow: true, identity: true, maxLength: 3 },
            ProcEnabled: { caption: '启用', lineshow: true, editor: "checkbox" },
            ProcSummary: { caption: '摘要说明', lineshow: true, key: true },
            InterActive: { caption: '交互', editor: "checkbox" },
            ProcRepeated: { caption: '重复执行', editor: "checkbox" },
            ExpectedRows: { caption: '期望行数' },
            ProcUpdateFlag: { caption: '更新标志', editor: 'select', selection: [{ key: "UpdateFlag", value: 'UpdateFlag' }, { key: "UpdateFlag2", value: 'UpdateFlag2' }, { key: "UpdateFlag3", value: 'UpdateFlag3' }, { key: "UpdateFlag4", value: 'UpdateFlag4' }, { key: "UpdateFlag5", value: 'UpdateFlag5'}] },
            ProcExecuteFlag: { caption: '执行标志', editor: 'select', selection: [{ key: "IUD", value: "增删改" }, { key: "IU", value: "增改" }, { key: "ID", value: "增删" }, { key: "UD", value: "删改" }, { key: "I", value: "增" }, { key: "U", value: "改" }, { key: "D", value: "删"}] },
            ProcSQL: { caption: 'SQL 脚本', editor: "textarea", designer:["codemirror"] }
        }},
        Params: { caption: "业务参数", children: {
            ParamName: { caption: '参数名', lineshow: true, maxLength: 3, key: true },
            ParamRepeated: { caption: '重复', editor: 'checkbox', lineshow: true },
            ParamType: { caption: '参数类型', lineshow: true, editor: 'select', selection: [{ key: 0, value: "字符串" }, { key: 1, value: "数字" }, { key: 2, value: "二进制" }, { key: 3, value: "日期/时间" }, { key: 4, value: "逻辑" }, { key: 5, value: "未知"}] },
            Output: { caption: '输出参数', editor: 'checkbox', lineshow: true }
        } }
    },
    MetaModule: {
        Caption: { caption: "模块名称" },
        ModuleID: { caption: "模块编号" },
        ParentID: { caption: "上层模块编号" },
        Path: { caption: "模块路径(Url)" , designer: ["moduleurl"]},
        Queryies: { caption: "所用查询" },
        Bizes: { caption: "所用业务逻辑" },
        ModulePages: { caption: "页面", children:{
            PageID: { caption: '页面ID', lineshow: true, key:true },
            PageType: { caption: '页面类型', editor: "select", selection: [{ key: "0", value: "查询" }, { key: "1", value: "录入"}], lineshow: true },
            UI: { caption: '界面配置',  editor: 'textarea', designer:["codemirror", "ui"] },
            Queries: { caption: '所用查询', editor: 'textarea', maxLength: 100  },
            PageFlow: { caption: '流程定义', editor: 'textarea', designer:["codemirror"] ,
                children: {
                    ID: {caption: '流程ID', lineshow: true, key: true},
                    Summary: {caption: '流程摘要', lineshow: true},
                    Description: {caption: '流程描述'},
                    State: {caption: '流程状态', editor:'select', selection: [{ key: "fsNew", value: "新增" }, { key: "fsNormal", value: "未审核"}, { key: "fsAuditing", value: "审核中"}, { key: "fsAudited", value: "审核完成"}] , lineshow: true},
                    SaveBiz: {caption: '保存业务逻辑'},
                    Action: {caption: '可执行动作', 
                        children:{
                            Summary: {caption: '摘要', lineshow: true, key: true},
                            Biz: {caption: '业务逻辑', lineshow: true},
                            Description: {caption: '描述'}
                        }},
                    BlackList: {caption: '黑名单', editor: 'textarea', split:',', roweditor: 'textbox', designer:['codemirror']},
                    WhiteList: {caption: '白名单', editor: 'textarea', split:',', roweditor: 'textbox'}
                }},
            PageLookup: { caption: '关联信息定义', editor: 'textarea',  scriptType: 'application/json' },
            Functions: { caption: "权限", type: "ModuleFunc", reference: { type: "MetaFunction", join: "FuncID"} }
        }}},
    MetaTable: {
        TableName: { caption: '表名' },
        At: { caption: '情景' },
        TableSummary: { caption: '表摘要' },
        AccountID: { hide: true },
        Account: { hide: true },
        ProjectName: { hide: true },
        Columns: { caption: '字段',
            children: {
                ColumnName: { caption: '字段名', lineshow: true },
                Caption: { caption: '字段中文', lineshow: true },
                Summary: { caption: '摘要' },
                Type: { caption: '数据类型', lineshow: true, editor:'select', selection: [{key: 0, value: "字符串"},{key:1, value: "数字"}, {key: 2, value:"二进制"}, {key:3, value: "日期/时间"}, {key:4, value:"逻辑"}, {key:5, value:"未知"}]  },
                Size: { caption: '长度' },
                Precision: { caption: '精度' },
                Scale: { caption: '小数位' },
                AllowNull: {caption: '允许空', editor:'checkbox'},
                IsIdentity: {caption: '自增', editor:'checkbox'}
            }
        },
        Indexies: { caption: '索引',
            children: {
                IndexName: { caption: '索引名', lineshow: true },
                PrimaryKey: { caption: '主键', editor:'checkbox', lineshow: true },
                IsUnique: { caption: '聚簇', editor:'checkbox', lineshow: true },
                Columns: { caption: '索引名' }
            }
        }
    },
    MetaQuery: {
        QueryName: { caption: '查询名称' },
        QueryType: { caption: '查询类型', editor: 'select', selection: [{ key: 0, value: "通用查询" }, { key: 1, value: "数据对象"}] },
        ConnAlias: { caption: '数据连接' },
        Scripts: { caption: '查询脚本', children: {
            ScriptIdx: { caption: '序号', identity: true, lineshow: true },
            ScriptType: { caption: '脚本类型', lineshow: true, editor: 'select', selection: [{ key: 0, value: "SQL" }, { key: 1, value: "C#"}] },
            MetaColumn: { caption: '字段元数据', readonly: true },
            Script: { caption: '脚本', editor: "textarea", scriptType: 'text/x-plsql' }
        } },
        Params: { caption: '查询参数', children: {
            ParamIdx: { caption: '参数序号', identity: true, lineshow: true, key: true },
            ParamName: { caption: '参数名称', lineshow: true },
            ParamType: { caption: '参数类型', lineshow: true, editor: 'select', selection: [{ key: 0, value: "字符串" }, { key: 1, value: "数字" }, { key: 2, value: "二进制" }, { key: 3, value: "日期/时间" }, { key: 4, value: "逻辑" }, { key: 5, value: "未知"}] },
            ParamGroups: { caption: '参数分组' },
            LikeLeft: { caption: "模糊查询(左)", editor: 'checkbox' },
            LikeRight: { caption: "模糊查询(右)", editor: 'checkbox' },
            IsNull: { caption: '空值替代值(IsNull)' },
            DefaultValue: { caption: '界面默认值' }
        }}
    },
    MetaField: {
        FieldName: { caption: '字段名', lineshow: true },
        Context: { caption: '情景', lineshow: true },
        DisplayLabel: { caption: '中文', lineshow: true },
        Regex: { caption: '输入字符约束', lineshow: true },
        Inherited: { caption: '继承自' },
        CharLength: { caption: '字符长度' },
        Selection: { caption: '下拉选择' },
        EditorType: { caption: '编辑框类型', editor: 'select', selection: [{ key: 'STRING', value: '字符' }, { key: 'NUMBER', value: '数字' }, { key: 'DROPDOWNLIST', value: '下拉' }, { key: 'DATETIME', value: '时间' }, { key: 'DATE', value: '日期' }, { key: 'LIST', value: '列表' }, { key: 'BOOLEAN', value: '勾选' }, { key: 'TEXTAREA', value: '多行文本'}] },
        DicNO: { caption: '共通资料ID' }
    }
}});


$.uidesignerSetup({
    uiiconpath: "/images/uidesigner/",
    config: {
        PageButton: {
            desc:"工具条的各种按钮",
            property: {
                type: { desc: '类型，有save(保存)、new（新增）、report（报表）、edit（编辑）' },
                name: { desc: '名字，同一个页面不能重复' },
                caption: {desc: '按钮文字' },
                hint: {desc: '提示' },
                form: {desc: '相关联的窗体名字' },
                biz: {desc: '提交后执行的业务逻辑' },
                action: {desc: '相关窗体提交的地址 url，如果已经设定了biz 属性，可不录入' },
                moduleID: {},
                href: {desc: '提交后跳转的地址。#表示停留在原页面，空表示刷新当前页面' }
            }
        },
        QueryParams: {
            desc:"查询条件录入界面.根据查询参数自动生成",
            property:{
                name: {desc: '名字，同一个页面不能重复' }, 
                mq: {desc: '查询名' }, 
                fieldMeta: {desc: '情景。一般是查询名_p' }, 
                grid: {desc: '存放查询结果表格控件的名字' }, 
                button: {desc: '执行查询结果的按钮名字' }
            }
        },
        xyForm: { 
			desc:"存放录入框的容器，所有录入框都必须放入一个Form 里面",
            property:{
                name: {desc: '名字，同一个页面不能重复' }, 
                method: {desc: '窗体提交的方法，一般是 post'}, 
                action: {desc: '窗体提交地址url，如果相关按钮以及设置了，可不录入' }, 
                table: {desc: '数据表名，在详细页面总表单使用时需设置，跟主表查询名一致，会将表单内设置的表中没有的字段生成隐藏的input，在其他位置使用不需要设置'} 
			}
        },
        Toolbar: { 
			desc:"工具条，下级是各种按钮",
            property:{
				name: {desc: '名字，同一个页面不能重复' } 
			}
        },
        lfTabs:{
			desc: "多页面标签，下级控件page",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				Width: {desc: '选项页面宽度，设置值为：auto 或数字' },
				Height: {desc: '选项页面高度，设置值为：auto 或数字' },
				pageCaption: {desc: '页面名称数组，方式：[页面1,页面2...]，按顺序对应下级page控件' }
			}
		},
        page:{
			desc: "页面，lfTabs的下级控件，对应lfTabs的pageCaption数组的个数"
		},
        xyEditorItems:{
			desc: "字段录入框集合，一般用于主表字段录入，还可作为快速录入xyQuickRec控件的下级控件，供快速录入调用",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				table: {desc: '数据表名，字段列表对应的表，主表跟查询名一致，从表为对应查询+.序号，序号从0开始，0表示查询中的第一个脚本' },
				items: {desc: '显示的字段列表，不设置默认显示table的所有字段' },
				Width: {desc: '字段录入框宽度，方式：{field1:25,field2:30,...}，未设置的字段未默认值' }
			}
		},
        xyGrid:{
			desc: "xyGridTable的上级控件，作为它的外边框，优化显示效果"
		},
		xyGridTable:{
			desc: "可录入的明细表格，在上级增加xyGrid控件增加边框控制，一般为从表使用，可配合xyQuickRec快速录入控件",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				table: {desc: '数据表名，对应查询+.序号，序号从0开始，0表示查询中的第一个脚本' },
				UpdateTag: {desc: '行数据的更新标志，与对应biz业务过程的更新标志一致' },
				FastInputID: {desc: '绑定的快速录入控件的name，目前只能绑定控件xyQuickRec' },
				items: {desc: '明细表格显示的字段列表，不设置默认显示table的所有字段' }
			}
		},
        xyQuickRec:{
			desc: "快速录入控件，配合控件xyGridTable使用，与其同级使用，需配置下级控件xyEditorItems",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				table: {desc: '数据表名，对应查询+.序号，序号从0开始，0表示查询中的第一个脚本' },
				KeyField: {desc: '关键字段，快速录入控件的首字段，明细表格的行定位字段' },
				GridID: {desc: '绑定的明细表格控件的name，目前只能绑定控件xyGridTable' }
			}
		},
		xyFieldset:{
			desc: "fieldset标签，用于页面内容区域划分",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				title: {desc: 'fieldset的legend中的文字' }
			}
		},
		xyDcGrid:{
			desc: "关联字段表格录入框（每个字段都有smartlookup，都是ID字段、都有对应的描述字段，例如ID字段店号对应描述字段店名），数据量大不建议使用，不方便大数据量录入",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				table: {desc: '数据表名，对应查询+.序号，序号从0开始，0表示查询中的第一个脚本' },
				items: {desc: '行字段列表定义，方式：{ID字段:描述字段，ID字段：描述字段...}' },
				UpdateTag: {desc: '行数据的更新标志，与对应biz业务过程的更新标志一致' }
			}
		},
		lfDcGrid:{
			desc: "xyDcGrid控件优化版，关联字段表格录入框（每个字段都有smartlookup，都是ID字段、都有对应的描述字段，例如ID字段店号对应描述字段店名），数据量大不建议使用，不方便大数据量录入",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				table: {desc: '数据表名，对应查询+.序号，序号从0开始，0表示查询中的第一个脚本' },
				items: {desc: '行字段列表定义，方式：{ID字段:描述字段，ID字段：描述字段...}' },
				UpdateTag: {desc: '行数据的更新标志，与对应biz业务过程的更新标志一致' }
			}
		},
		lfCheckTable:{
			desc: "同级结构数据选择控件，将table数据表中的数据根据KeyFieldName.KeyFieldDesc的方式列出来勾选",
			property:{
				name: {desc: '名字，同一个页面不能重复' },
				Caption:{desc: '描述文字' },
				table: {desc: '数据表名，对应查询加".序号"，序号从0开始，0表示查询中的第一个脚本' },
				KeyFieldName: {desc: '关键字段名称，如店号ID' },
				KeyFieldDesc: {desc: '关键字段对应的描述字段名称，如店号对应的店名Name' },
				ck:{desc:'行是否选中的标志字段，值1为选中、null为未选'},
				UpdateTag: {desc: '行数据的更新标志，与对应biz业务过程的更新标志一致' }
			}
		},
		xyLayout:{
			desc: "主题控件（BugFree风格），下级包含xyLayoutHead、xyLayoutMenu、xyLayoutPage"
		},
		xyLayoutHead:{
			desc: "主题控件xyLayout的构造控件，处于xyLayout控件的下级，用于构造该主题最上方抬头、用户信息区域",
			property:{
				HomeUrl: {desc: 'LOGO文字超链接URL，一般设置为首页的URL' },
				logostr:{desc: '描述文字' }
			}
		},
		xyLayoutMenu:{
			desc: "主题控件xyLayout的构造控件，处于xyLayout控件的下级，用于构造该主题左边的菜单区域，可构造调用CS模块的菜单",
			property:{
				cs: {desc: '是否构造调用CS程序的菜单，值为true则构建的菜单单击时调用CS模块，为false则构建的菜单为BS跳转超链接' }
			}
		},
		xyLayoutPage:{
			desc: "主题控件xyLayout的构造控件，处于xyLayout控件的下级，用于构造该主题中心模块页面区域"
		},
		lfLayout:{
			desc: "主题控件，仿微软风格，比较完整的布局控件，下级包含lfLayout_head、lfLayout_menu、lfLayout_page、lfLayout_foot"
		},
		lfLayout_head:{
			desc: "主题控件lfLayout的构造控件，处于lfLayout控件的下级，用于构造该主题上方LOGO、用户信息区域，LOGO图片路径写死为/Content/linkfern.png，下级可配置工具条控件lfUserBar"
		},
		lfUserBar:{
			desc: "工具条控件，目前用于lfLayout_head的下级，菜单暂写死，仅修改密码可用"
		},
		lfLayout_menu:{
			desc: "主题控件lfLayout的构造控件，处于lfLayout控件的下级，用于构造该主题左边的菜单区域外框（无菜单），下级需使用菜单构造控件构造菜单"
		},
		lfLayout_page:{
			desc: "主题控件lfLayout的构造控件，处于lfLayout控件的下级，用于构造该主题中心模块页面区域"
		},
		lfLayout_foot:{
			desc: "主题控件xyLayout的构造控件，处于xyLayout控件的下级，用于构造该主题最下方页脚区域，已写死为：上海灵蕨信息科技有限公司"
		}
    }
});