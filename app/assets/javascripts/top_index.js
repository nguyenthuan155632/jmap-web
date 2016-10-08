var jmap_i18n = new JMapI18N();

var i18n_id = ["10001", "101", "102", "103", "104", "105", "106", "107", "108"];
var jmap_userlangname = ["zh-CN", "zh-TW", "ja", "en"];
var jmap_userlangi18n = ["105", "106", "107", "108"];
var lang;
var resources = {};

var init_top = function() {
    lang = browserLanguage();
    if(!lang){
//                setTimeout("init_top()", 500);
        return;
    }
    result = lang.indexOf("-");
    if(result != -1) {
        lang = lang.substring(0,result) + lang.substring(result).toUpperCase(); 
    }
    resources[lang]={ translation:{} }
    jmap_i18n.getResources(lang, i18n_id).done(function(data) {
        for (var i = 0; i < data.response.info.texts.length; i++) {
            resources[lang].translation[data.response.info.texts[i].id] = 
                data.response.info.texts[i].attrs.name[0];
        }
        i18n.init({lng: lang, resStore: resources, fallbackLng: lang}).done(function() {
		    window.JmapConfig.string = {
	    		10001: i18n.t("10001")
		    };
            $(".i18ntext").i18n();
        });
        var langbtnhtml = "";
        for (var i = 0; i < jmap_userlangname.length; i++) {
            var onclickhtml = "changeDisplayLanguage('" + jmap_userlangname[i] + "');";
            var modifierhtml = "outline";
            if(jmap_userlangname[i] == lang){ //同じなら無効化
                onclickhtml = "javascript:void(0)";
                modifierhtml = "";
            }
            langbtnhtml += "<li><ons-button onclick=\"" + onclickhtml + "\" modifier=\"" + modifierhtml + "\">" + resources[lang].translation[jmap_userlangi18n[i]] + "</ons-button></li>";
        }
    
        var btn_langcontent = $('#btn_lang');
        btn_langcontent.html("<ul>" + langbtnhtml + "</ul>");
        ons.compile(btn_langcontent[0]);
    });
}
init_top();