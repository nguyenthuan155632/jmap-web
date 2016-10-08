var jmap_i18n = new JMapI18N();
var i18n_id = [
	"10001",
	"401", "402", "403", "404", "405", "406", "407", "408", "301", "701",
	"409", "105", "106", "107", "108"
	];
var lang = browserLanguage();
var i18n_area, i18n_taxfree, i18n_concierge;
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
		i18n_area = i18n.t("405");
		i18n_taxfree = i18n.t("406");
		i18n_concierge = i18n.t("407");
	});
	$('input[name=menubtn_lang]').val([lang]);
});

const CON_PRECISION = 0;

jQuery(function($) {
	if (!navigator.geolocation) {
		alert(ERROR_MESSAGE_03);
		return false;
	}

	// 初期処理
	var init = function(pos){

		// JMapのgetAreasAPIをコール
		var jmap = new JMap();
		jmap.getAreas().done(function(data){
			
			jmap.errorHandling(data);
									
			var array = data.response.info.area_info;

			// 取得したデータに距離情報を付与
			jQuery.each(array,function(){
				this.distance = getDistance(this.latitude, this.longitude, pos.coords.latitude, pos.coords.longitude, CON_PRECISION);
			});
			
			// 取得したデータを位置情報を使って並び替え
			array.sort(function(a,b){
  				if(a.distance < b.distance) return -1;
  				if(a.distance > b.distance) return 1;
 				return 0;				
			});
			
			// 並びかえた結果を画面にレンダリング
			jQuery.each(array,function(i){
				i === 0 ? renderNowPosition(array[i]) : renderNearPosition(array[i]);
			})
			
		})
		.fail(function(){
			console.log(ERROR_MESSAGE_02);
		});
		
	};
				
	var error = function(err) {	
		// JMapのgetAreasAPIをコール
		var jmap = new JMap();
		jmap.getAreas().done(function(data){
			
			jmap.errorHandling(data);
									
			var array = data.response.info.area_info;
			
			// 並びかえた結果を画面にレンダリング
			jQuery.each(array,function(i){
				i === 0 ? renderNowPosition(array[i]) : renderNearPosition(array[i]);
			})
			
		})
		.fail(function(){
			console.log(ERROR_MESSAGE_02);
		});
	}
	
	// 現在のエリアをレンダリングする
	var	renderNowPosition = function(data){

		var div = $('\
			<div class="local-area">\
			<img width="100%" alt="' + data.name + i18n_area + '" src="' + data.background_image + '"/>\
			<div class="title-box">' + data.name +'</div>\
			<div class="foot-box">\
				<table>\
					<tr>\
						<td>\
							<object data="img/icon-taxfree.svg" type="image/svg+xml" width="26" height="28"></object>\
							<span class="name">' + i18n_taxfree + '</span>\
							<span class="num">'+ data.duty_free_count + '</span>\
						</td>\
						<td>\
							<object data="img/icon-concierge.svg" type="image/svg+xml" width="26" height="28"></object>\
							<span class="name">' + i18n_concierge + '</span>\
							<span class="num">'+ data.concierge_count + '</span>\
						</td>\
					</tr>\
				</table>\
			</div>\
			').on('click',function(){
					clickArea(data);
				});

		$('#local-area').append(div);		
		
	};
	
	// 近くのエリアをレンダリングする
	var renderNearPosition = function(data){

		var li = $('\
		<li>\
			<div class="near-area-box">\
				<img width="100%" alt="' + data.name + i18n_area + '" src="' + data.background_image + '"/>\
				<div class="title-box">'  + data.name + '</div>\
				<div class="foot-box">\
					<table>\
						<tr>\
							<td>\
								<object data="img/icon-taxfree.svg" type="image/svg+xml" width="21" height="23"></object>\
								<span class="num">'+ data.duty_free_count + '</span>\
							</td>\
							<td>\
								<object data="img/icon-concierge.svg" type="image/svg+xml" width="21" height="23"></object>\
								<span class="num">'+ data.concierge_count + '</span>\
							</td>\
						</tr>\
					</table>\
				</div>\
			</div>\
		</lig>\
		').on('click',function(){
				clickArea(data);
			});

		$('#near-area').append(li);

	};

	// エリア画像クリック時
	function clickArea(data){
		var form = $('<form action="outdoor_map" method="get">');
		form.append('<input type="hidden" name="area_id" value="' + data.id + '">')
		.append('<input type="hidden" name="area_lat" value="' + data.latitude + '">')
		.append('<input type="hidden" name="area_lng" value="' + data.longitude + '">')
		.append('<input type="hidden" name="func" value="map_click">')
		.appendTo(document.body)
		.submit();
	}
	
	// 検索イベント登録
	$('#searchButton').on('click',function(){
		
		// 入力がある場合のみ処理する。
		if($('#search').val() != null && $('#search').val() != '') {
			var form = $('<form action="outdoor_map" method="get">');
			form.append('<input type="hidden" name="search_word" value="' + $('#search').val() + '">')
			.append('<input type="hidden" name="func" value="search_click">')
			.appendTo(document.body)
			.submit();
		}
	});

	// 処理開始
	var options = {timeout: 20000, enableHighAccuracy: true, maximumAge: 10000};
	navigator.geolocation.getCurrentPosition(init, error, options);

    // 利用規約クリック
    $('#btn-terms').on('click',function(){
        var form = $('<form action="terms" method="get">');
            form.appendTo(document.body).submit();
    });
});
