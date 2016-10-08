var jmap = new JMap();
var jmap_i18n = new JMapI18N();
var i18n_id = ["10001", "301", "302", "303", "304", "305", "306", "307", "701", "310", "311", "312", "313", "309"];
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
    var EMAIL = getParameter('email');//'<%= params[:email] %>';
    var CONTACT = getParameter('contact');//'<%= params[:contact] %>';

    // データがあるが場合、apiコールして登録
    var submitContactData = function() {
        if (EMAIL!='' && CONTACT!='') {
            jmap.postContact(EMAIL, CONTACT).done(function(data) {
                jmap.errorHandling(data);
                    $('#e-mail').text('');
                    $('#contact').text('');
                    $('#contact-form').hide();
                    $('#contact-result').show();
                })
                .fail(function(){
                    console.log(ERROR_MESSAGE_02);
                });
        }
    }

    // 問い合わせ送信
    $('#send-contact').on('click',function(){
        if($('#e-mail').val() != null && $('#contact').val() != '') {
            var form = $('<form action="contact" method="get">');
                form.append('<input type="hidden" name="email" value="' + $('#e-mail').val() + '">')
                    .append('<input type="hidden" name="contact" value="' + $('#contact').val() + '">')
                    .appendTo(document.body)
                    .submit();
        }
    });

    submitContactData();
});