jQuery(function($) {
    //TODO リダイレクト時間（ミリ秒）
    var rTime = 3000;

    // 入力パラメータ
    var id = getParameter('id');//'<%= params[:id] %>';
    var lat = getParameter('lat');//'<%= params[:lat] %>';
    var lon = getParameter('lon');//'<%= params[:lon] %>';
    var shop_id = getParameter('shop_id');//'<%= params[:shop_id] %>';
    var floor_id = getParameter('floor_id');//'<%= params[:floor_id] %>';
    var updated = getParameter('updated');//'<%= params[:updated] %>';
    var area_id = getParameter('area_id');//'<%= params[:area_id] %>';
    var drawing_index = getParameter('drawing_index');//'<%= params[:drawing_index] %>';
    /**
     * 屋内地図遷移
     */
    var goIndoorMap = function(){
		var form = $('<form action="indoor_map" method="get">');
        if (area_id == 11) {
            form.append('<input type="hidden" name="drawing_index" value="' + drawing_index + '">')
        }
        form.append('<input type="hidden" name="id" value="'+id+'">')
                .append('<input type="hidden" name="lat" value="'+lat+'">')
                .append('<input type="hidden" name="lon" value="'+lon+'">')
                .append('<input type="hidden" name="area_id" value="' + area_id + '">')
                .append('<input type="hidden" name="updated" value="'+updated+'">')
                .appendTo(document.body)
                .submit();
    };

    /**
     * 屋内地図遷移（店舗指定あり）
     */
    var goIndoorMapHasShop = function(){
		var form = $('<form action="indoor_map" method="get">');
        if (area_id == 11) {
            form.append('<input type="hidden" name="drawing_index" value="' + drawing_index + '">')
        }
        form.append('<input type="hidden" name="id" value="'+id+'">')
                .append('<input type="hidden" name="shop_id" value="'+shop_id+'">')
                .append('<input type="hidden" name="floor_id" value="'+floor_id+'">')
                .append('<input type="hidden" name="lat" value="'+lat+'">')
                .append('<input type="hidden" name="lon" value="'+lon+'">')
                .append('<input type="hidden" name="area_id" value="' + area_id + '">')
                .append('<input type="hidden" name="updated" value="'+updated+'">')
                .appendTo(document.body)
                .submit();
    };

    /**
     * マップ振り分け
     */
    var handlerToMap = function(){
        if (shop_id!=null && shop_id!='' && floor_id!=null && floor_id!='') {
            goIndoorMapHasShop();
        } else {
            goIndoorMap();
        }
    };

    /**
     * クリック
     */
    $('#enter_map_btn').on('click',function(){
        handlerToMap();
    });

    /**
     * リダイレクト
     */
    setInterval(function(){
        handlerToMap();
    },rTime);
});