var jmap_i18n = new JMapI18N();
var i18n_id = [
	"10001",
	"701", "702", "703",
	"711", "712",
	"721", "722", "723",
	"731", "732", "733", "734", "735", "736",
	"741", "742", "743", "744", "745", "746", "747",
	"751", "752", "753", "754",
	"761", "762",
	"771", "772",
	"781", "782", "783", "784",
	"791"
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