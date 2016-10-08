// Common JS

var toggle = true;
var adjust_open;

$(function() {
	
	ons.bootstrap();
  
  // viewport 変更
  $('meta[name=viewport]').attr("content",'width=375, user-scalable=no');
	
	// エリア選択画面　右上バーガーメニュー
	if($("#toolbar-button").length) {
		$("#toolbar-button").on("click", function(){
			$("#toolbar-menu").toggleClass("close", 300, "easeOutSine");
		});
	}
	
	// 施設選択画面、ショップ選択画面リスト表示制御
	if($("#tab-button").length) {
    var bh;
    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
      bh = window.outerHeight ? window.outerHeight : $(window).height();
    }else {
		  bh = window.innerHeight ? window.innerHeight : $(window).height();
    }
		var ch = $("#building-list").height() - $("#building-list ons-scroller").height();
		var adjust_close = bh - ch;
		adjust_open = ($("#building-list ons-scroller").height() - 20) * -1;
		
		// android 端末だけ下部に隙間ができるため調整
    if( navigator.userAgent.indexOf('Android') > 0 ) {
       adjust_close += 22;
    }
		
		// 初期位置設定
		$("#building-list").css("top", adjust_close);
				
		$("#tab-button").on( "click", function() {
			if( toggle ) {
				listOpen();
			}else {
				listClose();
			}
		});
	}
});

// リスト初期化
var listInit = function() {
    $('.ons-scroller').css({
        'height': '15px'
    });
};
	// リストオープン
	function listOpen() {
		$("#building-list").css({
			'-webkit-transform':'translate3d(0,' +adjust_open +'px,0)',
      '-ms-transform':'translate3d(0,' +adjust_open +'px,0)',
			'transition-duration' : '500ms'
		}).one('transitionend', function(){
			// アニメーション終了処理
			toggle = false;
			console.log("end");
		});
	}

	// リストクローズ
	function listClose() {
    console.log("list tab close");
		$("#building-list").css({
			'-webkit-transform':'translate3d(0,0,0)',
      '-ms-transform':'translate3d(0,0,0)',
			'transition-duration' : '500ms'
		}).one('transitionend', function(){
			// アニメーション終了処理
			toggle = true;
		});
	}
  
  	var user_agent = navigator.userAgent.toLowerCase(); // detect the user agent
	var ios_devices = user_agent.match(/(iphone|ipod|ipad)/)  ? "touchstart" : "click"; //check if the devices are ios devices
  	// tree menu
  	$(document).on(ios_devices, "dt .plus-minus", function(e) {
	  	e.preventDefault();
	    $(this).parent().next().slideToggle();
	    $(".plus", this).toggle();
	    $(".minus", this).toggle();
  	});

  	$(document).on("click", ".cateMenu dt", function() {
	    $(this).next().slideToggle();
	    $(".plus", this).toggle();
	    $(".minus", this).toggle();
  	});

// リストオープン
var listOpen =  function() {
	$("#building-list").css({
		'-webkit-transform':'translate3d(0,' +adjust_open +'px,0)',
		'transition-duration' : '500ms'
	}).one('webkitTransitionEnd', function(){
		// アニメーション終了処理
		toggle = false;
		console.log("end");
	});
	$('#listicon').attr("icon","ion-chevron-down");
	$('#listicon').attr("class","ng-scope ons-icon ons-icon--ion ion-chevron-down");
    $('#searchFreeWord').css({
        'height': '400px'
    });
	$('#searchlist').show();
};

// リストクローズ
function listClose() {
	$("#building-list").css({
		'-webkit-transform':'translate3d(0,0,0)',
		'transition-duration' : '500ms'
	}).one('webkitTransitionEnd', function(){
		// アニメーション終了処理
		toggle = true;
	});
	$('#listicon').attr("icon","ion-chevron-up");
	$('#listicon').attr("class","ng-scope ons-icon ons-icon--ion ion-chevron-up");
    $('#searchFreeWord').css({
        'height': '15px'
    });
	$('#searchlist').hide();
}

// レコメンドダイアログ		
function showRecomendDialog() {
	console.log("show recomend dialog");
	
	ons.createDialog('recomend-dialog.html').then(function(dialog) {
		dialog.show("none");		
	});
}

// 施設選択ダイアログ
function buildSelectDialog(obj) {
	console.log("show build select dialog");
	
	ons.createPopover('build-select-dialog.html').then(function(popover) {
		popover.show(obj);
	});
	
	// リストクローズ
	$("#building-list").css({
		'-webkit-transform':'translate3d(0,0,0)',
    '-ms-transform':'translate3d(0,0,0)',
		'transition-duration' : '500ms'
	}).one('transitionend', function(){
		// アニメーション終了処理
		toggle = true;
	});
}

// ルート開始地点選択ダイアログ
function showRootStartDialog() {
	console.log("show root start dialog");
	
	ons.createDialog('root-start-dialog.html').then(function(dialog) {
		dialog.show();
	});
}

// ショップ選択ダイアログ
function shopSelectDialog(obj) {
	console.log("show shop select dialog");
	
	ons.createPopover('shop-select-dialog.html').then(function(popover) {
		popover.show(obj);
	});
	
	// リストクローズ
	$("#building-list").css({
		'-webkit-transform':'translate3d(0,0,0)',
    '-ms-transform':'translate3d(0,0,0)',
		'transition-duration' : '500ms'
	}).one('transitionend', function(){
		// アニメーション終了処理
		toggle = true;
	});
}

// ショップ詳細ダイアログ
function shopDetailDialog() {
	console.log("show shop detail dialog");
	
	ons.createDialog('shop-detail-dialog.html').then(function(dialog) {
		dialog.show();
	});
}

// 汎用シングルボタンダイアログ（タイトルなし）
function singleButtonDialog() {
	console.log("show single button dialog");
	
	ons.createDialog('single-button-dialog.html').then(function(dialog) {
		dialog.show();
	});
}

//To read parameters
var getParameter = function (sParam) {                    
   var sPageURL = window.location.search.substring(1);
   var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
       var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
           return sParameterName[1];
       }
   }
   return "";
};
var formatDate = function(dateObject) {
    try {
        if (dateObject) {
            var d = new Date(dateObject);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            if (day < 10) {
                day = "0" + day;
            }
            if (month < 10) {
                month = "0" + month;
            }
            var date = year + "/" + month + "/" + day;

            return date;
        }
    } catch (ex) {}
    return "";
};