var jmap_i18n = new JMapI18N();
var i18n_id = [
	"10001",
	"201", "202", "203", "204", "205", "206",
	"211", "212", "213",
	"221", "222", "223",
	"231", "232", "233",
	"241", "242", "243",
	"251",
	"101", "102"
	];
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
});

function translate_i18n() {
	$(".i18ntext").i18n();
}
