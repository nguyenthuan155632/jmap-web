const ERROR_MESSAGE_01   = "検索結果0件でした。";
const ERROR_MESSAGE_02   = "検索エラーです。";
const ERROR_MESSAGE_03   = "位置情報の利用を許可してから、ご利用ください。";
const ERROR_MESSAGE_04 = "エラーが発生しました。もう一度お試しください。";

var defaultOrientation = true;

$(document).ready(function(){
	// loadLocalizedMessages();
	window.addEventListener('load', function() {
		checkLandscape();
	});
	window.addEventListener('orientationchange', function() {
		checkLandscape();
	});

	function checkLandscape() {
		if ('orientation' in window) {
			if (window.orientation != 0 && window.orientation != 180) {
				alert(window.JmapConfig.string[10001]);
			}
		}
	}
});

var loadLocalizedMessages = function() {

	var jmap_i18n_msg = new JMapI18N();
	var i18n_id = ["10001"];
	var lang = browserLanguage();
	var resources_msg = {};
	result = lang.indexOf("-");
	if(result != -1) {
		lang = lang.substring(0,result) + lang.substring(result).toUpperCase(); 
	}
    resources_msg[lang] = {
        translation: {}
    };
	jmap_i18n_msg.getResources(lang, i18n_id).done(function(data) {
		for (var i = 0; i < data.response.info.texts.length; i++) {
			resources_msg[lang].translation[data.response.info.texts[i].id] = 
				data.response.info.texts[i].attrs.name[0];
		}
        i18n.init({
            lng: lang,
            resStore: resources_msg,
            fallbackLng: lang
        }).done(function() {
		    window.JmapConfig.string = {
	    		10001: i18n.t("10001")
		    };
		});
	});
};

// ブックマーク
var addBookmark = function(toURL,toStr) {
        if(navigator.userAgent.indexOf("MSIE") > -1){
        //Internet Explorer
                window.external.AddFavorite(toURL,toStr);
        }else if(navigator.userAgent.indexOf("Lunascape") > -1){
        //Lunascape
                alert("[Ctrl] か [Command]と[G}ボタンを同時に押してください。");
        }else if(navigator.userAgent.indexOf("Flock") > -1){
        //Flock
                window.sidebar.addPanel(toStr,toURL,'');
        }else if(navigator.userAgent.indexOf("Firefox") > -1){
        //Firefox
                window.sidebar.addPanel(toStr,toURL,'');
        }else if(navigator.userAgent.indexOf("Opera") > -1){
        //Opera
                window.open(toURL,'sidebar','title='+toStr);
        }else if(navigator.userAgent.indexOf("Chrome") > -1){
        //Chrome,Safari
                alert("ブックマーク機能をご利用ください。又は[Ctrl] か [Command]と[D]ボタンを同時に押すとブックマークできます");
        }else{
        //その他
                alert("ブラウザ付属のブックマーク機能をご利用ください。");
        }
};

var jmap_langkeyname = "jmap_lang"; //ja
var jmap_storage = localStorage;

// ユーザからの言語設定
var setDisplayLanguage = function(lang) {
    result = lang.indexOf("-");
    if(result != -1) {
        lang = lang.substring(0,result) + lang.substring(result).toUpperCase(); 
    }
    jmap_storage.setItem(jmap_langkeyname, lang);
}

// ユーザが指定した言語設定もしくはブラウザの表示言語から言語設定を取得
var getDisplayLanguage = function() {
    var lang = jmap_storage.getItem(jmap_langkeyname);
    if(!lang){
        var locale = window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage;
        
        var jmap = new JMap();
        jmap.getLang(locale).done(function(data) {
            lang = data.response.info;
            setDisplayLanguage(lang);
            location.reload();
        });
    }
    return lang;
}

var changeDisplayLanguage = function(lang) {
    result = lang.indexOf("-");
    if(result != -1) {
        lang = lang.substring(0,result) + lang.substring(result).toUpperCase(); 
    }
    if(lang != getDisplayLanguage()){
        setDisplayLanguage(lang);
        location.reload();
    }
}

// ブラウザの表示言語を取得する
var browserLanguage = function() {
	var lang;
	if (window.JmapConfig.param != undefined && window.JmapConfig.param.language != undefined) {
		lang = window.JmapConfig.param.language;
		if (lang == "ja" || lang == "en" || lang == "zh-cn" || lang == "zh-tw") {
			return lang;
		}
	}

    lang = getDisplayLanguage();
    if(!lang){
        return null;
    }
    return lang.toLowerCase();
/*
	//return 'zh-CN';
    // return 'zh-cn';
    //return 'ja';

	var ua = window.navigator.userAgent.toLowerCase();
	var code;
	try {
		// chrome
		if ( ua.indexOf( 'chrome' ) != -1 ) {
			//test
			code = ( navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,5);
		}
		// それ以外
		else{
			code = ( navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,5);
		}
		
		if (code == 'ja-jp') {
			code = 'ja';
		}
		if (code == '' || code == null || !code) {
			code = 'ja';
		}
		
		return code;
	}
	catch( e ) {
		return undefined;
	}
*/
};

function getDistance(lat1, lng1, lat2, lng2, precision) {
  // 引数　precision は小数点以下の桁数（距離の精度）
  var distance = 0;
  if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
    distance = 0;
  } else {
    lat1 = lat1 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;
 
    var A = 6378140;
    var B = 6356755;
    var F = (A - B) / A;
 
    var P1 = Math.atan((B / A) * Math.tan(lat1));
    var P2 = Math.atan((B / A) * Math.tan(lat2));
 
    var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
    var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));
 
    distance = A * (X + L);
    var decimal_no = Math.pow(10, precision);
    distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
  }
  return distance;
}

var JMap = function() {
	this.api_url = window.JmapConfig.api.location;
};

JMap.prototype.getLang = function(curlocale) {

	var defer = $.Deferred(); 
	
	var datas = {
			locale: curlocale
	};
	
	$.ajax({
		type: "POST",
		url: this.api_url + "get_lang/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	
	return defer.promise();
};

JMap.prototype.getAreas = function(pos) {

	var defer = $.Deferred(); 
	
	var datas = {
			lang: browserLanguage()
	};
	
	$.ajax({
		type: "POST",
		url: this.api_url + "get_areas/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	
	return defer.promise();
};

JMap.prototype.findBuildings = function(id) {
	
	var defer = $.Deferred();
	var datas = {
			area_id: id,
			lang   : browserLanguage()
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "find_buildings/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.findAreasAndBuildings = function(word) {

	var defer = $.Deferred();
	var datas = {
			search_word: word,
			lang   : browserLanguage()
	}; 
	$.ajax({
		type: "POST",
		url: this.api_url + "find_areas_buildings/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.findBuildingsWithRadius = function(longitude, latitude, category, icon) {

    if (category === undefined) category = "";
    if (icon === undefined) icon = "";

	var defer = $.Deferred();
	var datas = {
			longitude: longitude,
			latitude : latitude,
			category : category,
			icon     : icon,
			radius   : '100', // 半径10Km固定
			lang     : browserLanguage()
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "find_buildings_with_radius/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.getAirports = function() {
    var defer = $.Deferred();
    var data = {
        lang     : browserLanguage()
    };
    $.ajax({
        type: "POST",
        url: this.api_url + "get_airports/",
        data: $.param(data),
        contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        success: defer.resolve,
        error: defer.reject,
    });
    return defer.promise();
};

JMap.prototype.getBuildingsEntranceImageUrl = function() {
	return this.url;
};

JMap.prototype.getIndoorMap = function(buildingid) {
	
	var defer = $.Deferred();
	var datas = {
			building_id: buildingid,
			lang       : browserLanguage()
	}; 
	$.ajax({
		type: "POST",
		url: this.api_url + "get_indoor_map/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.findProperty = function(entityId) {
	
	var defer = $.Deferred();
	var datas = {
			entity_id : entityId,
			lang      : browserLanguage()
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "find_properties/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.findEntity = function(word, buildingid) {
	
	var defer = $.Deferred();
	var datas = {
			search_word: word,
			building_id: buildingid,
			lang       : browserLanguage()
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "find_entity/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: defer.resolve,
		error: defer.reject,
	});
	return defer.promise();
};

JMap.prototype.outputLogConcierge = function() {

	var datas = {
			lang     : browserLanguage(),
			cc_narrow_num : String(1)
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "output_log/output_log_chinese_concierge/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
	});
};

JMap.prototype.outputLogDutyfree = function() {

	var datas = {
			lang     : browserLanguage(),
			dfs_narrow_num : String(1)
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "output_log/output_log_dfs_search/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
	});
};

JMap.prototype.outputLogRouteGuidance = function(f_GeometyId, f_FloorId, t_GeometyId, t_FloorId) {

	var datas = {
			from_geometry_id : String(f_GeometyId),
			from_floor_id   : String(f_FloorId),
			to_geometry_id   : String(t_GeometyId),
			to_floor_id     : String(t_FloorId),
			lang            : browserLanguage()
	};
	$.ajax({
		type: "POST",
		url: this.api_url + "output_log/output_log_route_guidance/",
		data: $.param(datas),
		contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
	});
};

JMap.prototype.errorHandling = function(data) {

	// 検索結果0件
	if(data == null){
		alert(ERROR_MESSAGE_01);
		return false;
	}
	
	// 検索エラー
	if(data.response.code != 0){
		alert(ERROR_MESSAGE_02);
		return false;
	}
};

JMap.prototype.getDefaultImg = function(img) {

	// 検索結果0件
	if(img == null || img == ''){
		img = 'img/default.png';
	}	
	return img;
};

JMap.prototype.getEntityName = function(data) {

	var name = data.shop_name;
	// 検索結果0件
	if(name == ''){
		name = data.icon_name;
	}
	return name;
};

JMap.prototype.getEntityFloorNumber = function(data) {

    var floor_number = data.floor_number;
    if (floor_number == null || floor_number == '') {
        floor_number = ' ';
    }
    return floor_number;
};

JMap.prototype.postContact = function(email, content) {

    var defer = $.Deferred();
    var datas = {
        emailaddress: email,
        content: content,
        lang: browserLanguage()
    };
    $.ajax({
        //http://localhost:3001/v1/inquiry?emailaddress=tsuno@offshore-it.biz&content='あいうえお'
        type: "POST",
        url: this.api_url + "inquiry/",
        data: $.param(datas),
        contentType: "application/x-www-form-urlencoded; application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        success: defer.resolve,
        error: defer.reject,
    });
    return defer.promise();
};
