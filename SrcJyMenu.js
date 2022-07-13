//二级统一菜单
var erjimenu = [
        {
        title: "剧情简介",
        url: /\.sogou\./.test(MY_URL)?$('hiker://empty#noRecordHistory##noHistory#').rule((url) => {
                var d=[];
                var html = fetch(url.split('##')[1]);
                var story=parseDomForHtml(html, 'body&&.srch-result-info&&Html').replace(/<\/a><a/g,',</a><a');
                for(let i = 0;;i++){
                    try{
                        d.push({
                            title:parseDomForHtml(story, 'div,' +i+ '&&Text').replace('更多',''),
                            col_type: 'rich_text'
                        });
                        d.push({
                            col_type: 'line'
                        });
                    }catch(e){
                        break;
                    }
                };

                try{
                    var photos=parseDomForArray(html, '#photoList&&.sort_lst_bx&&a');
                    if(photos.length>0){
                        d.push({
                            title: '剧照：',
                            col_type: 'rich_text'
                        });
                        d.push({
                            col_type: 'line'
                        });
                    }
                    for(var i in photos){
                        d.push({
                            pic_url: parseDomForHtml(photos[i], 'img&&data-src'),
                            url: 'hiker://empty',
                            col_type: 'pic_1_full'
                        });
                        d.push({
                            col_type: 'line'
                        });
                    }
                }catch(e){};
                setHomeResult(d);
            }, MY_URL): $('hiker://empty#noHistory#').rule(() => {
                setHomeResult([{
                    title: '影片简介：\n' + getMyVar('moviedesc',''),
                    col_type: 'long_text'
                }]);
            }),
        pic_url: 'https://lanmeiguojiang.com/tubiao/messy/32.svg',
        col_type: 'icon_small_3'
    },
    {
        title: "观影设置",
        url: $('hiker://empty#noRecordHistory##noHistory#').rule(() => {
                setPageTitle("♥观影设置");
                var d = [];
                var cfgfile = "hiker://files/rules/Src/Juying/config.json";
                var Juyingcfg=fetch(cfgfile);
                if(Juyingcfg != ""){
                    eval("var JYconfig=" + Juyingcfg+ ";");
                }else{
                    var JYconfig= {};
                }

                d.push({
                    title: '功能开关',
                    col_type: "rich_text"
                });
                d.push({
                    col_type: "line_blank"
                });
                d.push({
                    title: JYconfig['printlog']==1?'打印日志(开)':'打印日志(关)',
                    url: $('#noLoading#').lazyRule((JYconfig,cfgfile) => {
                            if(JYconfig['printlog'] != 1){
                                JYconfig['printlog'] = 1;
                            }else{
                                JYconfig['printlog'] = 0;
                            }
                            writeFile(cfgfile, JSON.stringify(JYconfig));
                            refreshPage(false);
                            return 'toast://切换成功';
                        }, JYconfig, cfgfile),
                    col_type: "text_2"
                });
                d.push({
                    title: JYconfig['cachem3u8']!=0?'m3u8缓存(开)':'m3u8缓存(关)',
                    url: $('#noLoading#').lazyRule((JYconfig,cfgfile) => {
                            if(JYconfig['cachem3u8'] == 0){
                                JYconfig['cachem3u8'] = 1;
                            }else{
                                JYconfig['cachem3u8'] = 0;
                            }
                            writeFile(cfgfile, JSON.stringify(JYconfig));
                            refreshPage(false);
                            return 'toast://切换成功';
                        }, JYconfig, cfgfile),
                    col_type: "text_2"
                });
                d.push({
                    col_type: "line"
                });
                if(fileExist('hiker://files/cache/MyParseSet.json')&&fileExist('hiker://files/rules/DuanNian/MyParse.json')){var isDn = 1}else{var isDn = 0};
                d.push({
                    title: isDn==1&&JYconfig['isdn']!=0?'断插辅助(开)':'断插辅助(关)',
                    url: isDn==0?'toast://没有断插？无法开启！':$('#noLoading#').lazyRule((JYconfig,cfgfile) => {
                            if(JYconfig['isdn'] == 0){
                                JYconfig['isdn'] = 1;
                                var sm = "开启断插同步并发解析";
                            }else{
                                JYconfig['isdn'] = 0;
                                var sm = "只走程序自身的解析";
                            }
                            writeFile(cfgfile, JSON.stringify(JYconfig));
                            refreshPage(false);
                            return 'toast://切换成功：' + sm;
                        }, JYconfig, cfgfile),
                    col_type: "text_2"
                });
                d.push({
                    title: isDn==1&&JYconfig['forcedn']==1?'强制断插(开)':'强制断插(关)',
                    url: isDn==0?'toast://没有断插？无法开启！':$('#noLoading#').lazyRule((JYconfig,cfgfile) => {
                            if(JYconfig['forcedn'] != 1){
                                JYconfig['forcedn'] = 1;
                                var sm = "开启强制断插，仅走断插解析";
                            }else{
                                JYconfig['forcedn'] = 0;
                                var sm = "关闭强制断插，程序智能解析";
                            }
                            writeFile(cfgfile, JSON.stringify(JYconfig));
                            refreshPage(false);
                            return 'toast://切换成功：' + sm;
                        }, JYconfig, cfgfile),
                    col_type: "text_2"
                });
                d.push({
                    title: '屏蔽操作',
                    col_type: "rich_text"
                });
                d.push({
                    col_type: "line_blank"
                });
                d.push({
                    title: '无效播放地址',
                    url: $("","屏蔽无效播放地址\n多数为跳舞小姐姐播放链接").input(()=>{
                            var recordfile = "hiker://files/rules/Src/Juying/parse.json";
                            var recordparse=fetch(recordfile);
                            if(recordparse != ""){
                                eval("var recordlist=" + recordparse+ ";");
                            }else{
                                var recordlist = {};
                            }
                            recordlist['excludeurl'] = recordlist['excludeurl']||[];
                            let url = input.split(';{')[0].replace('file:///storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/video.m3u8##','').replace('#isVideo=true#','');
                            if(recordlist['excludeurl'].indexOf(url)==-1){
                                recordlist['excludeurl'].push(url);
                            }
                            writeFile(recordfile, JSON.stringify(recordlist));
                            return 'toast://屏蔽无效播放地址成功';
                        }),
                    col_type: "text_2"
                });
                var parsefrom = [];
                var recordfile = "hiker://files/rules/Src/Juying/parse.json";
                var recordparse=fetch(recordfile);
                if(recordparse != ""){
                    eval("var recordlist=" + recordparse+ ";");
                    try{
                        for(var key in recordlist.parse){
                            parsefrom.push(key);
                        }
                    }catch(e){ }
                }
                d.push({
                    title: '屏蔽优先解析',
                    url: parsefrom.length==0?'toast://没有优先解析，无需操作':$(parsefrom,3,"选择片源屏蔽优先解析").select(()=>{
                        var recordfile = "hiker://files/rules/Src/Juying/parse.json";
                        var recordparse=fetch(recordfile);
                        eval("var recordlist=" + recordparse+ ";");
                        var parseurl = recordlist.parse[input];
                        var parsename = recordlist.name[input];
                        delete recordlist.parse[input];
                        

                        var filepath = "hiker://files/rules/Src/Juying/myjiexi.json";
                        var datafile = fetch(filepath);
                        if(datafile != ""){
                            eval("var datalist=" + datafile+ ";");
                        }else{
                            var datalist = [];
                        }
                        if(datalist.some(item => item.parse == parseurl)){
                            //私有解析在屏蔽优先时，仅排除片源
                            for(var j=0;j<datalist.length;j++){
                                if(datalist[j].parse==parseurl&&datalist[j].stopfrom.indexOf(input)==-1){
                                    datalist[j].stopfrom[datalist[j].stopfrom.length] = input;
                                }
                                break;
                            }
                            writeFile(filepath, JSON.stringify(datalist));
                            var sm = '私有解析('+parsename+')>排除片源>'+input;
                        }else{
                            //app自带的解析在屏蔽优先时，直接加入黑名单
                            recordlist['excludeparse'] = recordlist['excludeparse']||[];
                            if(recordlist['excludeparse'].indexOf(recordlist.parse[input])==-1){
                                recordlist['excludeparse'].push(recordlist.parse[input]);
                            }
                            var sm = parsename+'>加入全局黑名单';
                        }

                        writeFile(recordfile, JSON.stringify(recordlist));   
                        refreshPage(false);
                        log('已屏蔽'+input+' 优先解析：'+sm);
                        return 'toast://已屏蔽'+input+'优先解析';
                    }),
                    col_type: "text_2"
                });

                d.push({
                    title: '反悔回退',
                    col_type: "rich_text"
                });
                d.push({
                    col_type: "line_blank"
                });
                d.push({
                    title: '清除拦截记录',
                    url: $(["播放地址","优先解析"],2,"选择需清除记录的项").select(()=>{
                            if(input=="播放地址"){
                                return $("清除拦截跳舞小姐姐视频记录？").confirm(()=>{
                                    var recordfile = "hiker://files/rules/Src/Juying/parse.json";
                                    var recordparse=fetch(recordfile);
                                    if(recordparse != ""){
                                        eval("var recordlist=" + recordparse+ ";");
                                        recordlist['exclude'] = [];
                                        writeFile(recordfile, JSON.stringify(recordlist));
                                        return 'toast://已清除跳舞小姐姐视频拦截记录';
                                    }else{
                                        return 'toast://无记录';
                                    }
                                })
                            }else if(input=="优先解析"){
                                return $("清除app自带解析拦截黑名单记录？").confirm(()=>{
                                    var recordfile = "hiker://files/rules/Src/Juying/parse.json";
                                    var recordparse=fetch(recordfile);
                                    if(recordparse != ""){
                                        eval("var recordlist=" + recordparse+ ";");
                                        recordlist['excludeparse'] = [];
                                        writeFile(recordfile, JSON.stringify(recordlist));
                                        refreshPage(false);
                                        return 'toast://已清除app自带解析拦截黑名单记录';
                                    }else{
                                        return 'toast://无记录';
                                    }
                                })
                            }
                            
                            
                        }),
                    col_type: "text_2"
                });
                setHomeResult(d);
            }),
        pic_url: 'https://lanmeiguojiang.com/tubiao/messy/37.svg',
        col_type: 'icon_small_3'
    },
    {
        title: "更多片源",
        url: !fileExist('hiker://files/rules/Src/Juying/jiekou.json')?"toast://分享页面或没有接口，无法扩展更多片源":getMyVar('moviemore','0')=="0"?$('hiker://empty#noRecordHistory##noHistory#').rule((name) => {
            require(config.依赖.match(/https.*\//)[0] + 'SrcJyXunmi.js');
            xunmi(name);
        }, MY_PARAMS.name):`#noLoading#@lazyRule=.js:back(false);'hiker://empty'`,
        pic_url: 'https://lanmeiguojiang.com/tubiao/messy/25.svg',
        col_type: 'icon_small_3'
    }
]