var jmap_i18n = new JMapI18N();
var i18n_id = ["10001", "301", "302", "303", "304", "305", "306", "307", "701", "308", "309" ];
var lang = browserLanguage();
var resources = {};
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

    //TODO debug
//            showI18nResponse(data.response.info.texts);
});

// TODO Show i18n response
var showI18nResponse = function(obj) {
    var properties = "";
    for (var prop in obj){
        properties += prop + "=" + obj[prop].attrs.name[0] + "\n";
    }
    alert(properties);
}

$(function () {
    $('#web-site').on('click',function(){
        var target = $('#web-site').text();
        this.href = target;
        window.open(this.href,'');
        return false;
    });
    // 法人客
    $('#info-corp').on('click',function(){
        window.open(this.href,'');
        return false;
    });

    // 法人客
    $('#info-indv').click(function(){
        // hrefで指定されたURLが別窓で開く
        window.open(this.href,'');
        return false;
    });
});