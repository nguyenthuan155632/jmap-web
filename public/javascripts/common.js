// Common JS

var toggle = true;

$(function() {
	
	ons.bootstrap();
	
	// エリア選択画面　右上バーガーメニュー
	if($("#toolbar-button").length) {
		$("#toolbar-button").on("click", function(){
			$("#toolbar-menu").toggleClass("close", 300, "easeOutSine");
		});
	}
	
	// 施設選択画面、ショップ選択画面リスト表示制御
	if($("#tab-button").length) {
		var bh = window.innerHeight ? window.innerHeight: $(window).height();
		var ch = $("#building-list").height() - $("#building-list ons-scroller").height();
		var adjust_close = bh - ch;
		var adjust_open = $("#building-list ons-scroller").height() * -1;
		
				
		console.log(adjust_open);
		console.log(adjust_close);
		
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

	// リストオープン
	function listOpen() {
		$("#building-list").css({
			'-webkit-transform':'translate3d(0,' +adjust_open +'px,0)',
			'transition-duration' : '500ms'
		}).one('webkitTransitionEnd', function(){
			// アニメーション終了処理
			toggle = false;
			console.log("end");
		});
	}

	// リストクローズ
	function listClose() {
		$("#building-list").css({
			'-webkit-transform':'translate3d(0,0,0)',
			'transition-duration' : '500ms'
		}).one('webkitTransitionEnd', function(){
			// アニメーション終了処理
			toggle = true;
		});
	}

});


/*
// レコメンドダイアログ		
function showRecomendDialog() {
	console.log("show recomend dialog");
	
	ons.createDialog('recomend-dialog.html').then(function(dialog) {
		dialog.show("none");		
	});
}
*/

// 施設選択ダイアログ
/*
function buildSelectDialog(obj) {
	console.log("show build select dialog");
	
	ons.createPopover('build-select-dialog.html').then(function(popover) {
		popover.show(obj);
	});
	
	// リストクローズ
	$("#building-list").css({
		'-webkit-transform':'translate3d(0,0,0)',
		'transition-duration' : '500ms'
	}).one('webkitTransitionEnd', function(){
		// アニメーション終了処理
		toggle = true;
	});
}
*/
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
		'transition-duration' : '500ms'
	}).one('webkitTransitionEnd', function(){
		// アニメーション終了処理
		toggle = true;
	});
}

/*
// ショップ詳細ダイアログ
function shopDetailDialog() {
	console.log("show shop detail dialog");
	
	ons.createDialog('shop-detail-dialog.html').then(function(dialog) {
		dialog.show();
	});
}
*/
/*
// 汎用シングルボタンダイアログ（タイトルなし）
function singleButtonDialog() {
	console.log("show single button dialog");
	
	ons.createDialog('single-button-dialog.html').then(function(dialog) {
		dialog.show();
	});
}
*/