var jmap_i18n = new JMapI18N();
var i18n_id = [
    "10001",
    "601", "611", "612", "631", "632","633", "634", "635", "621", "622", "623", "502", "406", "407", "409", "105", "106", "107", "108", "301", "701"
];
var i18n_id_ctgy = new Array();
jmap_i18n.getCategoryIdList().done(function (data) {
    for(var i = 0; i < data.response.info.texts.length; i++) {
        i18n_id_ctgy.push(data.response.info.texts[i].id);
    }
});
var lang = browserLanguage();
var resources = {};
result = lang.indexOf("-");
if (result != -1) {
    lang = lang.substring(0, result) + lang.substring(result).toUpperCase();
}
resources[lang] = {
    translation: {}
}
jmap_i18n.getResources(lang, i18n_id).done(function (data) {
    for (var i = 0; i < data.response.info.texts.length; i++) {
        resources[lang].translation[data.response.info.texts[i].id] =
                data.response.info.texts[i].attrs.name[0];
    }
    i18n.init({
        lng: lang,
        resStore: resources,
        fallbackLng: lang
    }).done(function() {
        window.JmapConfig.string = {
            10001: i18n.t("10001")
        };
        $(".i18ntext").i18n();
    });
    $('input[name=menubtn_lang]').val([lang]);
});
jmap_i18n.getCategoryResources(lang, i18n_id_ctgy).done(function (data) {
    for (var i = 0; i < data.response.info.texts.length; i++) {
        resources[lang].translation[data.response.info.texts[i].id] =
                data.response.info.texts[i].attrs.category[0];
    }
    i18n.init({
        lng: lang,
        resStore: resources,
        fallbackLng: lang
    }).done(function() {
        $(".i18ntext").i18n();
    });
});

jQuery(function ($) {

    //使い方説明ダイアログ
    //var SingleButtonDialog = null;

    // ショップ詳細ダイアログ
    var ShopDetailDialog = null;

    // ショップ選択ダイアログ
    var SelectShopDialog = null;

    // リコメンドダイアログ
    var recdialog = null;

    var rec_concierge = false;
    var rec_dutyfree = false;

    // 入力パラメータ
    var pBuilding_id = getParameter('id');//'<%= params[:id] %>';
    var pShop_id = getParameter('shop_id');//'<%= params[:shop_id] %>';
    var pArea_id = getParameter('area_id');//'<%= params[:area_id] %>';
    var pDrawingIndex = getParameter('drawing_index');//'<%= params[:drawing_index] %>';
    var pFloor_id = getParameter('floor_id');//'<%= params[:floor_id] %>';
    var pLat = getParameter('lat');//'<%= params[:lat] %>';
    var pLon = getParameter('lon');//'<%= params[:lon] %>';
    var pBuilding_name = '';
    var pShops = null;

    // 新しい入力パラメータ
    var pNavFrom = getParameter('nav_from');//'<%= params[:nav_from] %>';
    var pNavTo = getParameter('nav_to');//'<%= params[:nav_to] %>';
    var pDraw = getParameter('draw');//'<%= params[:draw] %>';
    var pLevel = getParameter('level');//'<%= params[:level] %>';
    var pCenterX = getParameter('centerX');//'<%= params[:centerX] %>';
    var pCenterY = getParameter('centerY');//'<%= params[:centerY] %>';
    var pWidth = getParameter('width');//'<%= params[:width] %>';
    var pHeight = getParameter('height');//'<%= params[:height] %>';
    var pZoom = getParameter('zoom');//'<%= params[:zoom] %>';
    var pDegrees = getParameter('degrees');//'<%= params[:degrees] %>';
    var pLang = getParameter('lang');//'<%= params[:lang] %>';

    if (pDrawingIndex) {
        pDraw = pDrawingIndex;
    }
    if (pFloor_id) {
        pLevel = pFloor_id;
    }

    //Thuan added 20160705
    var levelSearched = new Array();
    var taxfree = null;
    var concierge = null;
    var categoryMaster = new Array();
    var category_level1 = new Array();
    var category_level2 = new Array();
    var category_level3 = new Array();
    var category_list = new Array();
    var category_icon = new Array();
    //End

    var jmap = new JMap();
    var indoormap = new IndoorMap(pBuilding_id, pDraw, pLevel, pNavFrom, pNavTo, pCenterX, pCenterY, pWidth, pHeight, pZoom, pDegrees);

    // 初期表示
    var init = function () {

        indoormap.init();

        // リスト初期化
        listInit();

        // APIコール
        jmap.getIndoorMap(pBuilding_id).done(function (data) {

            jmap.errorHandling(data);
            pShops = data.response.info.shop_info;
                setUpdateDate(data.response.info.last_updated);

            var d_info = data.response.info.duty_free_info;
            var c_info = data.response.info.concierge_info;

            //Thuan added 20160705
            categoryMaster = data.response.info.category_master;
            taxfree = data.response.info.taxfree;
            concierge = data.response.info.concierge;
            //End

            indoormap.setEntityInfo(c_info, d_info);

            $('.center').text(data.response.info.building_name);
            pBuilding_name = data.response.info.building_name;
                try {
                    var comm = indoormap.getCommunity();
            if (pShop_id) {
                if (pDrawingIndex) {
                    indoormap.mapDataObject.setDrawing(comm.d[pDrawingIndex], pFloor_id);
                    } else {
                            //var geometry = indoormap.mapDataObject.geomMap[pShop_id].g;
                            geomMapObj = indoormap.geomMap(pShop_id);
                            var geometry = geomMapObj.g;
                    //フロア表示
                    var drawing = indoormap.mapDataObject.getCurrentDrawing();
                    indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, pFloor_id));
                    showShop('#tab-button', geometry);
                }
                // 店舗をセンターリング
                        geomMapObj = indoormap.geomMap(pShop_id);
                        indoormap.mapDataObject.setLevel(geomMapObj.pl);
                        indoormap.mapControl.centerOnGeom(geomMapObj.g);
                }
                } catch(ex) {
                    //alert(ERROR_MESSAGE_04);
                    console.log(ex);
            }
            //Thuan added 20160705
            indoormap.mapDataObject.mapChanged = onMapChanged;
            indoormap.map_View.onViewChange = onViewChange;
            //End
        })
                .fail(function () {
                console.log(ERROR_MESSAGE_02);
                });
    };

    //Thuan added 20160705
    function onViewChange (e) {
        var level = indoormap.mapDataObject.getCurrentLevel();
        if(levelSearched) {
            $("#ui-levels-floors > div").each(function() {
                if($.inArray($(this).attr("level"), levelSearched) !== -1) {
                    $(this).addClass("active-floor-color");
                }
                $(this).removeClass("active-current-floor");
                if(level.id == $(this).attr("level")) {
                    $(this).addClass("active-current-floor");
                }
            });
        }
    }

    function onMapChanged (e) {

        var level = indoormap.mapDataObject.getCurrentLevel();
        $("#ui-levels-floors > div").each(function() {
            $(this).removeClass("active-current-floor");
            if(level.id == $(this).attr("level")) {
                $(this).addClass("active-current-floor");
                // levelSearched.push($(this).attr("level"));
            }
        });

    }
    //End

    // 地図をタップ(global)
    uiMapclick = function (clicked) {
        showShopSelectDialog('#tab-button', clicked);
    };

    // 検索イベント登録
    $('.search-button').on('click', function () {
        var pWord = $('#search').val()
        if (pWord == null || pWord == '') {
            return;
        }

        // APIコール
        jmap.findEntity(pWord, pBuilding_id).done(function (data) {
            jmap.errorHandling(data);

            //Thuan added 20160705
            indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
            var arrShops = data.response.entity_info;
            $("#ui-levels-floors > div").each(function() {
                $(this).removeClass("active-floor-color");
            });
            var floors = new Array();
            var floorsArr = new Array();
            var allFloor = new Array();
            var allFloor_arr = new Array();
            var curDrawing = indoormap.mapDataObject.getCurrentDrawing();
            var curLevel = indoormap.mapDataObject.getCurrentLevel();
            $.each(pShops, function(i){
                allFloor.push(this.floor_id);
            });
            $.each(allFloor, function(i, el){
                if($.inArray(el, allFloor_arr) === -1) allFloor_arr.push(el);
            });
            if (typeof arrShops !== 'undefined') {
                $.each(arrShops, function(index, shop) {  
                    if(shop.shop_name != "") { 
                        setRedPin(shop.shop_id);
                        floors.push(shop.floor_id);
                    }
                });
                $.each(floors, function(i, el){
                    if($.inArray(el, floorsArr) === -1) floorsArr.push(el);
                });
                if(floorsArr) {
                    levelSearched = [];
                    $("#ui-levels-floors > div").each(function() {
                        if($.inArray($(this).attr("level"), floorsArr) !== -1) {
                            $(this).addClass("active-floor-color");
                            levelSearched.push($(this).attr("level"));
                        }
                    });
                }
                var indexOfFloorPinned = new Array();
                var indexOfCurFloor = 0;
                var arrMathAbs = new Array();
                var indexFloor = 0;
                if($.inArray(curLevel.id.toString(), floorsArr) !== -1) {
                    indoormap.mapDataObject.setLevel(searchLevlObj(curDrawing.l, curLevel.id));
                }
                else {
                    $.each(floorsArr, function(i, fa) {
                        indexOfFloorPinned.push(allFloor_arr.indexOf(fa));
                    });
                    indexOfCurFloor = allFloor_arr.indexOf(curLevel.id.toString());
                    $.each(indexOfFloorPinned, function(i, vl) {
                        arrMathAbs.push(Math.abs(vl - indexOfCurFloor));
                    }); 
                    indexFloor = arrMathAbs.indexOf(Math.min.apply(Math, arrMathAbs));
                    indoormap.mapDataObject.setLevel(searchLevlObj(curDrawing.l, allFloor_arr[indexOfFloorPinned[indexFloor]]));
                }
            }

            var e_info = data.response.entity_info;
            if (e_info != null && e_info != '') {
                renderAreaList(e_info);
                //　リストオープン
                listOpen();
            } else {
                alert(ERROR_MESSAGE_01);
            }
        })
                .fail(function () {
                    console.log(ERROR_MESSAGE_02);
                });
    });

    // カテゴリ単位の店舗リストのレンダリング
    var renderShopListToCategory = function () {
        //新規カテゴリ追加
        $.each(category_level3, function(i, v) {
            $('#list'+ v).empty();
        });

        var listdata = this;

        //  取得したデータを使って一覧に表示
        jQuery.each(pShops, function (i) {
            var li = $('\
      <li class="list__item list__item--chevron">' + this.floor_number + ' ' + this.shop_name + '</li>\
      ')
                    .on('click', function () {
                        clickIconList(listdata, pShops, i);
                        // ダイアログ非表示
                        onsiteSearchDialog.hide();
                    });

            for(var j = 0; j < category_level3.length; j++) {
                if(this.category_id == category_level3[j]) {
                    $('#list' + this.category_id).append(li);
                }
            }
        });
    };

    // 指定したアイコンの店舗リストのレンダリング
    var renderShopList = function (icon) {

        $('#shoplist').empty();

        var listdata = this;

        // フロアデータ取得
        var drawing = indoormap.mapDataObject.getCurrentDrawing();

        //  取得したデータを使って一覧に表示
        jQuery.each(pShops, function (i) {
            floor = searchLevlObj(drawing.l, pShops[i].floor_id);

            if (this.category_id == icon) {
                var li = $('\
        <li class="list__item list__item--chevron">\
          <div class="recomend-icon"><img src="img/pin_location.png" height="26"></div>\
                <span class="list__item__line-height">' + this.floor_number + ' ' + this.shop_name + '</span>\
        </li>\
        ')
                        .on('click', function () {
                            clickIconList(listdata, pShops, i);
                            // ダイアログ非表示
                            multiToiletDialog.hide();
                            onsiteSearchDialog.hide();
                        });

                $('#shoplist').append(li);
            }
        });
    };

    // アイコン一覧をクリック
    var clickIconList = function (listdata, data, i) {

        // Thuan added 20160711
        levelSearched = [];
        $("#ui-levels-floors > div").each(function() {
            $(this).removeClass("active-floor-color");
        }); 
        indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
        // End

        var can = indoormap.mapControl.getMapCanvas();

        var shopId = data[i].shop_id
        var geometry = indoormap.mapDataObject.geomMap[shopId].g;

        setRedPin(shopId);

        //フロア表示
        var drawing = indoormap.mapDataObject.getCurrentDrawing();
        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, data[i].floor_id));

        showShopSelectDialog('#tab-button', geometry);
    };

    // 一覧表をレンダリング
    var renderAreaList = function (data) {

        $('#searchlist').empty();

        var listdata = this;

        //  取得したデータを使って一覧に表示
        jQuery.each(data, function (i) {

            //Thuan edited 20160705
            if(this.shop_name != "") {
                // 画像指定がない場合はデフォルト画像を設定する。
                this.shop_image = jmap.getDefaultImg(this.shop_image);
                // 店舗名がない場合は、アイコン名を設定する。
                this.shop_name = jmap.getEntityName(this);
                this.floor_number = jmap.getEntityFloorNumber(this);

                var li = $('\
                    <li class="list__item list__item--tappable">\
                        <div class="building-box">\
                            <div class="thumb-box">\
                                <img src="' + this.shop_image + '" width="100%" alt="" />\
                            </div>\
                            <div class="detail-box">\
                                <dl>\
                                    <dt>' + this.shop_name + '</dt>\
                                    <dd>' + this.shop_category + '</dd>\
                                </dl>\
                            </div>\
                        </div>\
                    </li>\
                    ')
                        .on('click', function () {
                            clickList(listdata, data, i);
                        });

                $('#searchlist').append(li);
            }

        });

    };

    // 一覧表をクリック
    var clickList = function (listdata, data, i) {

        var can = indoormap.mapControl.getMapCanvas();

        var shopId = data[i].shop_id
        var geometry = indoormap.mapDataObject.geomMap[shopId].g

        //フロア表示
        var drawing = indoormap.mapDataObject.getCurrentDrawing();
        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, data[i].floor_id));

        showShopSelectDialog('#tab-button', geometry);

        // リストクローズ
        listClose();
    };

    // フロアレベルオブジェクトの検索
    var searchLevlObj = function (drawingl, floorId) {

        for (i = 0; i < drawingl.length; i++) {
            if (drawingl[i].id == floorId) {
                return drawingl[i];
            }
        }
        return null;
    }

    // ショップ選択ダイアログの表示
    var showShopSelectDialog = function (obj, clicked) {

        if (clicked.nm == null || clicked.nm == '') {
            return;
        }

        var addEvent = function () {
            $('#left_shop_name').text(clicked.nm);

            // APIコール
            jmap.findProperty(clicked.id).done(function (data) {

                jmap.errorHandling(data);

                var enProperty = data.response.entity_properties;
                if (enProperty.chstaff == null) {
                    $('#left_poi_name').text("");
                    $('#left_poi_name').hide();
                } else {
                    $('#left_poi_name').text(enProperty.chstaff);
                    $('#left_poi_name').show();
                }

                if (enProperty.url != null) {
                    $('#site_link').unbind();
                    $('#site_link').show();
                    $('#site_link').on('click', function () {
                        ga('send', 'event', {
                            eventCategory: 'Outbound Link',
                            eventAction: 'click',
                            eventLabel: enProperty.url
                        });
                        window.open(enProperty.url);
                        return false;
                    });
                } else {
                    $('#site_link').hide();
                }
            }).fail(function () {
                console.log(ERROR_MESSAGE_02 + "333");
                    });

            $('#from_button').off('click');
            $('#from_button').on('click', function () {

                // ここからのルート・ここへのルート指定済み
                if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                    // ルートをクリアする
                    //　indoormap.mapControl.clearRoute();
                }

                var level = indoormap.mapDataObject.getCurrentLevel();
                indoormap.mapControl.requestNavFromGeom(clicked, level.id, true);
                if (clicked.t.toLowerCase() != "unit") {
                    setPinImage(clicked, level.id, true);
                }

                // ここからのルート・ここへのルート指定済み
                if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                    // ログ出力
                    jmap.outputLogRouteGuidance(indoormap.mapControl.routeFrom[0].gid, indoormap.mapControl.routeFrom[0].lid, indoormap.mapControl.routeTo[0].gid, indoormap.mapControl.routeTo[0].lid);
                }

                self.SelectShopDialog.hide();

            });

            $('#to_button').off('click');
            $('#to_button').on('click', function () {

                // ここからのルート・ここへのルート指定済み
                if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                    // ルートをクリアする
                    //　indoormap.mapControl.clearRoute();
                }

                var level2 = indoormap.mapDataObject.getCurrentLevel();
                indoormap.mapControl.requestNavToGeom(clicked, level2.id, true);
                if (clicked.t.toLowerCase() != "unit") {
                    setPinImage(clicked, level2.id);
                }

                // ここからのルート・ここへのルート指定済み
                if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                    // ログ出力
                    jmap.outputLogRouteGuidance(indoormap.mapControl.routeFrom[0].gid, indoormap.mapControl.routeFrom[0].lid, indoormap.mapControl.routeTo[0].gid, indoormap.mapControl.routeTo[0].lid);
                }

                self.SelectShopDialog.hide();

            });

//                $('#detail_button').off('click');
//                $('#detail_button').on('click', function () {
//
//                    self.SelectShopDialog.hide();
//
//                    // APIコール
//                    jmap.findProperty(clicked.id).done(function (data) {
//
//                        jmap.errorHandling(data);
//
//                        var e_property = data.response.entity_properties;
//                        showShopDetailDialog(clicked, e_property);
//
//                    })
//                            .fail(function () {
//                                console.log(ERROR_MESSAGE_02);
//                            });
//                });
        }

        // 表示済み
        if (self.SelectShopDialog) {
            self.SelectShopDialog.show(obj);
            addEvent();
        } else {
            ons.createPopover('shop-select-dialog.html').then(function (popover) {
                self.SelectShopDialog = popover;
                popover.show(obj);
                $('.i18ntext').i18n(); // todo
                addEvent();
            });
        }
    };

    // ショップ表示
    var showShop = function (obj, clicked) {
        if (clicked.nm == null || clicked.nm == '') {
            return;
        }
        var addEvent = function () {
            try {
            // ここからのルート・ここへのルート指定済み
            if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                // ルートをクリアする
                //　indoormap.mapControl.clearRoute();
            }

            var level = indoormap.mapDataObject.getCurrentLevel();
            indoormap.mapControl.requestNavToGeom(clicked, level.id, true);
            if (clicked.t.toLowerCase() != "unit") {
                setPinImage(clicked, level.id);
            }

            // ここからのルート・ここへのルート指定済み
            if (indoormap.mapControl.routeFrom && indoormap.mapControl.routeTo) {
                // ログ出力
                jmap.outputLogRouteGuidance(indoormap.mapControl.routeFrom[0].gid, indoormap.mapControl.routeFrom[0].lid, indoormap.mapControl.routeTo[0].gid, indoormap.mapControl.routeTo[0].lid);
            }
            IndoorMap.prototype.defaultZoom();
            } catch (ex) {
                // alert(ERROR_MESSAGE_04);
                console.log(ex);
            }

        }

        // clicked.mmデータが取得されるまでインターバルをセット
        var t_id = setInterval(function () {
            //終了条件
            if (indoormap.isLoaded == true) {
                clearInterval(t_id);
                addEvent();
            }
        }, 2000);
    };

    // ショップ詳細ダイアログの表示
    var setPinImage = function (clicked, lid, start) {
        if (clicked.t.toLowerCase() == "section") return;

        // マーク画像名
        var pin_name = clicked.lr.replace(/\s+/g, "");
        pin_name = pin_name.replace(/:/g, "");

        // マーク情報設定
        var marker = {
//          "mx": clicked.mm[1][0],
//          "my": clicked.mm[1][1],
            "mx": clicked.l[0],
            "my": clicked.l[1],
            "lid": lid,
            "mt": micello.maps.markertype.IMAGE,
            "mr": {
                "src": "img/pin/" + lang.toLowerCase() + '/' + pin_name + ".png",
                "ox": 32.5,
                "oy": 82
            },
            "anm": "route"
        }
        indoormap.mapDataObject.addMarkerOverlay(marker);

        // スタートまたはゴールのピン画像のz-index設定
        if (start) {
            $('img[src="img/icon-root-start.svg"]').css({
                "z-index": 100
            });
        } else {
            $('img[src="img/icon-root-goal.svg"]').css({
                "z-index": 100
            });
        }

        IndoorMap.prototype.defaultZoom();
    };

    // ショップ詳細ダイアログの表示
    var showShopDetailDialog = function (clicked, enProperty) {
        var detail_addEvent = function () {
            var i18n_hours, i18n_address;
            i18n_hours = i18n.t("631");
            i18n_address = i18n.t("632");

            $('#detail_shop_name').text(clicked.nm);

            if (enProperty.hours == null) {
                $('#hours_text').text("");
                $('#hours_text').hide();
            } else {
                $('#hours_text').text(i18n_hours + ":" + enProperty.hours);
                $('#hours_text').show();
            }

            if (enProperty.address == null) {
                $('#address_text').text("");
                $('#address_text').hide();
            } else {
                $('#address_text').text(i18n_address + ":" + enProperty.address);
                $('#address_text').show();
            }

            if (enProperty.phone == null) {
                $('#tel_link').text("");
                $('#tel_link').attr("");
                $('#tel_button').hide();
            } else {
                $('#tel_link').text(enProperty.phone);
                $('#tel_link').attr("href", "tel:" + enProperty.phone);
                $('#tel_button').show();
            }

            if (enProperty.url == null) {
                $('#url_button').hide();
            } else {
                $('#url_button').off('click');
                $('#url_button').on('click', function () {
                    window.open(enProperty.url)
                    return false;
                });
                $('#url_button').show();
            }
        }

        // 表示済み
        if (self.ShopDetailDialog) {

            self.ShopDetailDialog.show();
            detail_addEvent();

        } else {

            ons.createDialog('shop-detail-dialog.html').then(function (dialog) {
                self.ShopDetailDialog = dialog;
                dialog.show();
                detail_addEvent();
            });
        }
    };

    // 商業施設のみ表示
    var showMultiToiletDialog = function (icon) {
        // if (self.multidialog) {
        //     // 指定したアイコンの店舗リストのレンダリング
        //     renderShopList(icon);
        //     self.multidialog.show("none");
        //     return;
        // }
        // ons.createDialog('multi-toilet-dialog.html').then(function (dialog) {
        //     // 指定したアイコンの店舗リストのレンダリング
        //     renderShopList(icon);
        //     $("#buildname-multi").text(pBuilding_name);
        //     self.multidialog = dialog;
        //     dialog.show("none");
        // });

        //Thuan added 20160705
        pinShopList(icon);
        onsiteSearchDialog.hide();
        //End
    }

    // リコメンドクリック時(コンシェルジュ)
    var recommendConcierge = function () {
        self.rec_concierge = $('#recommend_concierge').prop('checked');
        self.rec_dutyfree = $('#recommend_duty_free').prop('checked');

        // ロギング
        if (self.rec_concierge) {
            jmap.outputLogConcierge();
        }

        indoormap.placeMarker(self.rec_concierge, self.rec_dutyfree);
    };

    // リコメンドクリック時(免税店)
    var recommendDutyfree = function () {

        self.rec_concierge = $('#recommend_concierge').prop('checked');
        self.rec_dutyfree = $('#recommend_duty_free').prop('checked');

        // ロギング
        if (self.rec_dutyfree) {
            jmap.outputLogDutyfree();
        }

        indoormap.placeMarker(self.rec_concierge, self.rec_dutyfree);
    };

    // レコメンドダイアログ
    var showRecomendDialog = function () {
        if (self.recdialog) {
            self.recdialog.show("none");
            return;
        }

        ons.createDialog('recomend-dialog.html').then(function (dialog) {
            self.recdialog = dialog;
            dialog.show("none");
            $(".i18ntext").i18n();
            // イベント登録
            $('#recommend_concierge').on('click', function () {
                recommendConcierge();
            });
            // イベント登録
            $('#recommend_duty_free').on('click', function () {
                recommendDutyfree();
            });

        });
    }

    // 施設内検索ダイアログ
    var showOnsiteSearchDialog = function () {
        if (self.searchdialog) {
            self.searchdialog.show("none");
            return;
        }
        ons.createDialog('onsite-search-dialog.html').then(function (dialog) {

            //Thuan added 20160705
            renderCategoryListToDialog();  
            //End

            $('img[name="icon"]').each(function () {
                if ($(this).attr('src').indexOf('/' + lang.toLowerCase() + '/') == -1) {
                    var onSrc = $(this).attr('src').replace('img/icon/', 'img/icon/' + lang.toLowerCase() + '/');
                    $(this).attr('src', onSrc);
                }
            });

            // カテゴリ単位の店舗リストのレンダリング
            renderShopListToCategory();
            self.searchdialog = dialog;
            $("#buildname-search").text(pBuilding_name);
            dialog.show("none");
            $(".i18ntext").i18n();

            //Thuan 20160705

            if(taxfree == "") $("#recommend_taxfree").css("display", "none");
            if(concierge == "") $("#recommend_ch").css("display", "none");

            $.each(category_icon, function(i, v) {
                $('#select_icon_' + v).on('click', function() {
                    showMultiToiletDialog(v);
                });
            });
            //End

            // 中国人コンシェルジュ
            $('#recommend_ch').on('click', function () {

                //Thuan added 20160705
                indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
                var drawing = indoormap.mapDataObject.getCurrentDrawing();        
                var beforeLevel = indoormap.mapDataObject.getCurrentLevel();
                $("#ui-levels-floors > div").each(function() {
                    $(this).removeClass("active-floor-color");
                });
                var floor_arr_raw = new Array();
                var floor_arr = new Array();
                var all_floor = new Array();
                var all_floor_arr = new Array();
                jQuery.each(pShops, function (i) {
                    all_floor.push(this.floor_id);
                });

                var pin_src = 'img/pin_cn_Flag.svg';
                var pin = {"src": pin_src, "ox":16, "oy":58};
                var group = 'Pins';
                makerOverlay(concierge,pin,group);
                jQuery.each(concierge, function (i) {
                    floor_arr_raw.push(this.floorId);
                });
                $.each(floor_arr_raw, function(i, el){
                    if($.inArray(el, floor_arr) === -1) floor_arr.push(el);
                });    
                $.each(all_floor, function(i, el){
                    if($.inArray(el, all_floor_arr) === -1) all_floor_arr.push(el);
                });  
                if(floor_arr != "") {
                    levelSearched = [];
                    $("#ui-levels-floors > div").each(function() {
                        if($.inArray($(this).attr("level"), floor_arr) !== -1) {
                            $(this).addClass("active-floor-color");
                            levelSearched.push($(this).attr("level"));
                        }
                    });
                }    
                var indexOfFloorHadPinned = new Array();
                var indexOfCurrentFloor = 0;
                var arrAbs = new Array();
                var indexMin = 0;
                if (floor_arr != "") {
                    // console.log(floor_arr);
                    if($.inArray(beforeLevel.id.toString(), floor_arr) !== -1) {
                        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, beforeLevel.id));
                    }
                    else {
                        $.each(floor_arr, function(i, fa) {
                            indexOfFloorHadPinned.push(all_floor_arr.indexOf(fa));
                        });
                        indexOfCurrentFloor = all_floor_arr.indexOf(beforeLevel.id.toString());
                        $.each(indexOfFloorHadPinned, function(i, vl) {
                            arrAbs.push(Math.abs(vl - indexOfCurrentFloor));
                        }); 
                        indexMin = arrAbs.indexOf(Math.min.apply(Math, arrAbs));
                        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, all_floor_arr[indexOfFloorHadPinned[indexMin]]));
                    }
                }
                //End

                onsiteSearchDialog.hide();
                // showRecomendDialog();
            });

            // Tax Free
            $('#recommend_taxfree').on('click', function () {

                //Thuan 20160705
                indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
                var drawing = indoormap.mapDataObject.getCurrentDrawing();        
                var beforeLevel = indoormap.mapDataObject.getCurrentLevel();
                $("#ui-levels-floors > div").each(function() {
                    $(this).removeClass("active-floor-color");
                });
                var floor_arr_raw = new Array();
                var floor_arr = new Array();
                var all_floor = new Array();
                var all_floor_arr = new Array();
                jQuery.each(pShops, function (i) {
                    all_floor.push(this.floor_id);
                });

                var pin_src = 'img/pin_taxFree.svg';
                var pin = {"src": pin_src, "ox":16, "oy":32};
                var group = 'Pins';
                makerOverlay(taxfree,pin,group);
                jQuery.each(taxfree, function (i) {
                    floor_arr_raw.push(this.floorId);
                });
                $.each(floor_arr_raw, function(i, el){
                    if($.inArray(el, floor_arr) === -1) floor_arr.push(el);
                });    
                $.each(all_floor, function(i, el){
                    if($.inArray(el, all_floor_arr) === -1) all_floor_arr.push(el);
                });  
                if(floor_arr != "") {
                    levelSearched = [];
                    $("#ui-levels-floors > div").each(function() {
                        if($.inArray($(this).attr("level"), floor_arr) !== -1) {
                            $(this).addClass("active-floor-color");
                            levelSearched.push($(this).attr("level"));
                        }
                    });
                }    
                var indexOfFloorHadPinned = new Array();
                var indexOfCurrentFloor = 0;
                var arrAbs = new Array();
                var indexMin = 0;
                if (floor_arr != "") {
                    if($.inArray(beforeLevel.id.toString(), floor_arr) !== -1) {
                        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, beforeLevel.id));
                    }
                    else {
                        $.each(floor_arr, function(i, fa) {
                            indexOfFloorHadPinned.push(all_floor_arr.indexOf(fa));
                        });
                        indexOfCurrentFloor = all_floor_arr.indexOf(beforeLevel.id.toString());
                        $.each(indexOfFloorHadPinned, function(i, vl) {
                            arrAbs.push(Math.abs(vl - indexOfCurrentFloor));
                        }); 
                        indexMin = arrAbs.indexOf(Math.min.apply(Math, arrAbs));
                        indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, all_floor_arr[indexOfFloorHadPinned[indexMin]]));
                    }
                }       
                //End

                onsiteSearchDialog.hide();
                // showRecomendDialog();
            });
        });
    }

    $('#recommend_button').on('click', function () {
        //showRecomendDialog();
        //Thuan edited 20160705
        if(pShops != null) showOnsiteSearchDialog();
    });

    // 屋内地図遷移
    var goBack = function () {
        var form = $('<form action="outdoor_map" method="get">');
        if (pArea_id != "11") {
            form.append('<input type="hidden" name="indoor_lat" value="' + pLat + '">')
            form.append('<input type="hidden" name="indoor_lon" value="' + pLon + '">')
                    .submit();
        } else {
            form.append('<input type="hidden" name="area_lat" value="' + pLat + '">')
            form.append('<input type="hidden" name="area_lng" value="' + pLon + '">')
            form.append('<input type="hidden" name="area_id" value="11">')
                    .submit();
        }
    };

    var setUpdateDate = function(last_updated) {
        last_updated = formatDate(last_updated);
        $("#last_updated").empty();
        $("#last_updated").append(last_updated);
    };

    $('#back_button').on('click', function () {
        goBack();
    });

    //Thuan added 20160705
    var setRedPin = function(shopId, idat) {
        idat = (typeof idat === 'undefined') ? '' : idat;
        var market = {
            "id": shopId,
            "mt": micello.maps.markertype.NAMED,
            "mr": "RedPin",
            "idat": "<div>" + idat + "</div>",
            "anm": "Pins"
        }
        indoormap.mapDataObject.addMarkerOverlay(market);
    }

    var makerOverlay = function(target,pin,group){
        if(target != null) {
            $.each(target,function(){
                var mark = {
                    "id": this.shopId, // the geometry id
                    "mt": micello.maps.markertype.IMAGE,
                    "mr": pin, 
                    "anm": group
                };  
                indoormap.mapDataObject.addMarkerOverlay(mark);
            });
        }
    };

    var checkRelationalCategory = function(categoryList, childCateId, parentCateId) {
        var res = false;
        $.each(categoryList, function(i, v) {
            if($.inArray(childCateId, v) !== -1 && $.inArray(parentCateId, v) !== -1) {
                res = true;
            }
        });
        return res;
    }

    var renderCategoryListToDialog = function() {
        var category_arr_raw = new Array();
        var category_arr = new Array();
        var category_parent = new Array();
        $.each(pShops, function(i, s){
            if($.inArray(s.category_id, category_arr_raw) === -1 && s.category_id != null) category_arr_raw.push(s.category_id);
        });
        $.each(category_arr_raw, function(i, s){
            if($.inArray(s, i18n_id_ctgy) !== -1) category_arr.push(s);
        });
        $.each(categoryMaster, function(i, c) {
            if($.inArray(c.category_id, category_arr) !== -1) {
                var rela_cate = [c.category_id, c.category_parentId, ""];
                category_parent.push(rela_cate);
            }
        });
        for(var i = 0; i < category_parent.length; i++) {
            var parentId = "";
            for (var j = 0; j < categoryMaster.length; j++) {
                if(category_parent[i][1] == categoryMaster[j]['category_id']) {
                    parentId = categoryMaster[j]['category_parentId'];
                }
            }
            category_parent[i][2] = parentId;
        }

        // var maxLevelCategory = 0;
        $.each(category_parent, function(index, value) {
            if(value[0].charAt(1) == "1") category_list.push(value);
            else if(value[0].charAt(1) == "2") category_icon.push(value[0]); 
        });

        $.each(category_list, function(i, vl) {
            if($.inArray(vl[2], category_level1) === -1) category_level1.push(vl[2]);
            if($.inArray(vl[1], category_level2) === -1) category_level2.push(vl[1]);
            if($.inArray(vl[0], category_level3) === -1) category_level3.push(vl[0]);
        });
       
        $.each(category_level1, function(i, v) {
            if($.inArray(v, i18n_id_ctgy) === -1) { if(i != -1) { category_level1.splice(i, 1); }}
        });
        $.each(category_level2, function(i, v) {
            if($.inArray(v, i18n_id_ctgy) === -1) { if(i != -1) { category_level2.splice(i, 1); }}
        });
        $.each(category_level3, function(i, v) {
            if($.inArray(v, i18n_id_ctgy) === -1) { if(i != -1) { category_level3.splice(i, 1); }}
        });

        $("#category-menu").append('<div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="800"></span></div>');
        var html = "";
        html += '<dl class="acMenu slideMenu">';
        for(var i = 0; i < category_level1.length; i++) {
            html += '<dt class="list-other">';
            html += '<span class="plus-minus"><img src="stylesheets/ionicons/fonts/plus-round.png" width="24" class="plus"/>';
            html += '<img src="stylesheets/ionicons/fonts/minus-round.png" width="24" class="minus" style="display:none"/></span>';
            html += '<span><img src="img/icon_category_' + category_level1[i] + '.png" width="26" height="26"></span><span class="i18ntext" data-i18n="'+ category_level1[i] +'"></span>';
            html += '</dt>';
            html += '<dd>';
            html += '<dl class="acMenu slideMenu ">';
            for(var j = 0; j < category_level2.length; j++) {
                if(checkRelationalCategory(category_list, category_level2[j], category_level1[i])) {
                    html += '<dt>';
                    html += '<span class="plus-minus"><img src="stylesheets/ionicons/fonts/plus-round.png" width="24" class="plus"/>';
                    html += '<img src="stylesheets/ionicons/fonts/minus-round.png" width="24" class="minus" style="display:none"/></span>';
                    html += '<span class="i18ntext" data-i18n="'+ category_level2[j] +'"></span>';
                    html += '</dt>';
                    html += '<dd>';
                    html += '<dl class="acMenu slideMenu ">';
                    for(var k = 0; k < category_level3.length; k++) {
                        if(checkRelationalCategory(category_list, category_level3[k], category_level2[j])) {
                            html += '<dt>';
                            html += '<span class="plus-minus"><img src="stylesheets/ionicons/fonts/plus-round.png" width="24" class="plus"/>';
                            html += '<img src="stylesheets/ionicons/fonts/minus-round.png" width="24" class="minus" style="display:none"/></span>';
                            html += '<span class="i18ntext" data-i18n="'+ category_level3[k] +'"></span>';
                            html += '</dt>';
                            html += '<dd>';
                            html += '<ul id="list'+ category_level3[k] +'">';
                            html += '</ul>';
                            html += '</dd>';
                        }
                    }
                    html += '</dl>';
                    html += '</dd>';
                }
            }
            html += '</dl>';
            html += '</dd>';
        }
        html += '</dl>';

        $("#category-menu").append(html);
        $("#category-menu").append('\
            <div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="801"></span></div>\
            <ul class="list">');

        for(var i = 0; i < category_icon.length; i++) {
            $("#category-menu").append('\
                <li class="list__item list__item--chevron" id="select_icon_' + category_icon[i] + '">\
                    <div class="recomend-icon"><img name="icon" src="img/icon/icon_' + category_icon[i] + '.png" width="26" height="26"></div>\
                    <span class="list__item__line-height i18ntext" data-i18n="' + category_icon[i] + '"></span>\
                </li>');
        }
        $("#category-menu").append('</ul>\
            <div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="802"></span></div>');
        $("#category-menu").append('\
            <ul class="list">\
                <li class="list__item list__item--chevron" id="recommend_ch">\
                    <div class="recomend-icon">\
                        <object data="img/icon-concierge.svg" type="image/svg+xml" width="23" height="26"></object>\
                    </div>\
                    <span class="list__item__line-height i18ntext" data-i18n="407"></span>\
                </li>\
                <li class="list__item list__item--chevron" id="recommend_taxfree">\
                    <div class="recomend-icon">\
                        <object data="img/icon-taxfree.svg" type="image/svg+xml" width="23" height="26"></object>\
                    </div>\
                    <span class="list__item__line-height i18ntext" data-i18n="406"></span>\
                </li>\
            </ul>');
    };

    //Handler category click
    $(document).on("click", ".acMenu dt span.i18ntext", function(event){
        var categoryId = $(this).data('i18n');
        indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
        var drawing = indoormap.mapDataObject.getCurrentDrawing();
        var beforeLevel = indoormap.mapDataObject.getCurrentLevel();

        $("#ui-levels-floors > div").each(function() {
            $(this).removeClass("active-floor-color");
        });
        var categoryMaster_arr = new Array();
        $.each(categoryMaster, function(i, v) {
            categoryMaster_arr.push([v.category_id, v.category_parentId]);
        });

        var pShopIds = new Array();
        if($.inArray(categoryId.toString(), category_level1) !== -1) {
            var pCate = new Array();
            $.each(category_level2, function(i, v) {
                if(checkRelationalCategory(categoryMaster_arr, v, categoryId.toString())) {
                    pCate.push(v);
                }
            });
            $.each(pCate, function(i1, v1) {
                $.each(category_level3, function(i1, v2) {
                    if(checkRelationalCategory(categoryMaster_arr, v2, v1)) {
                        pShopIds.push(v2);
                    } 
                });
            });
        }
        else if($.inArray(categoryId.toString(), category_level2) !== -1) {
            $.each(category_level3, function(i, v) {
                if(checkRelationalCategory(categoryMaster_arr, v, categoryId.toString())) {
                    pShopIds.push(v);
                }
            });
        }
        else {
            pShopIds.push(categoryId.toString());
        }

        var floor = 0;
        var floor_arr_raw = new Array();
        var floor_arr = new Array();
        var all_floor = new Array();
        var all_floor_arr = new Array();
        $.each(pShops, function(i){
            all_floor.push(this.floor_id);
            if (this.category_id && $.inArray(this.category_id, pShopIds) >= 0) {
                setRedPin(this.shop_id);
                floor = this.floor_id;
                floor_arr_raw.push(floor);
            }
        });
        $.each(floor_arr_raw, function(i, el){
            if($.inArray(el, floor_arr) === -1) floor_arr.push(el);
        });
        $.each(all_floor, function(i, el){
            if($.inArray(el, all_floor_arr) === -1) all_floor_arr.push(el);
        });
        if(floor_arr) {
            levelSearched = [];
            $("#ui-levels-floors > div").each(function() {
                if($.inArray($(this).attr("level"), floor_arr) !== -1) {
                    $(this).addClass("active-floor-color");
                    levelSearched.push($(this).attr("level"));
                }
            });
        }
        var indexOfFloorHadPinned = new Array();
        var indexOfCurrentFloor = 0;
        var arrAbs = new Array();
        var indexMin = 0;
        if (floor > 0) {
            if($.inArray(beforeLevel.id.toString(), floor_arr) !== -1) {
                indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, beforeLevel.id));
            }
            else {
                $.each(floor_arr, function(i, fa) {
                    indexOfFloorHadPinned.push(all_floor_arr.indexOf(fa));
                });
                indexOfCurrentFloor = all_floor_arr.indexOf(beforeLevel.id.toString());
                $.each(indexOfFloorHadPinned, function(i, vl) {
                    arrAbs.push(Math.abs(vl - indexOfCurrentFloor));
                }); 
                indexMin = arrAbs.indexOf(Math.min.apply(Math, arrAbs));
                indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, all_floor_arr[indexOfFloorHadPinned[indexMin]]));
            }
       }
       onsiteSearchDialog.hide();
    });

    var pinShopList = function(categoryId){
        indoormap.mapDataObject.removeMarkerOverlay("Pins", true);
        var drawing = indoormap.mapDataObject.getCurrentDrawing();        
        var beforeLevel = indoormap.mapDataObject.getCurrentLevel();
        $("#ui-levels-floors > div").each(function() {
            $(this).removeClass("active-floor-color");
        });
        var floor_arr_raw = new Array();
        var floor_arr = new Array();
        var all_floor = new Array();
        var all_floor_arr = new Array();
        var floor = 0;
        jQuery.each(pShops, function (i) {
            all_floor.push(this.floor_id);
            if (this.category_id == categoryId.toString()) {
                floor = this.floor_id;
                setRedPin(this.shop_id);
                floor_arr_raw.push(floor);
            }
        });
        $.each(floor_arr_raw, function(i, el){
            if($.inArray(el, floor_arr) === -1) floor_arr.push(el);
        });
        $.each(all_floor, function(i, el){
            if($.inArray(el, all_floor_arr) === -1) all_floor_arr.push(el);
        });
        if(floor_arr) {
            levelSearched = [];
            $("#ui-levels-floors > div").each(function() {
                if($.inArray($(this).attr("level"), floor_arr) !== -1) {
                    $(this).addClass("active-floor-color");
                    levelSearched.push($(this).attr("level"));
                }
            });
        }
        var indexOfFloorHadPinned = new Array();
        var indexOfCurrentFloor = 0;
        var arrAbs = new Array();
        var indexMin = 0;
        if (floor > 0) {
            if($.inArray(beforeLevel.id.toString(), floor_arr) !== -1) {
                indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, beforeLevel.id));
            }
            else {
                $.each(floor_arr, function(i, fa) {
                    indexOfFloorHadPinned.push(all_floor_arr.indexOf(fa));
                });
                indexOfCurrentFloor = all_floor_arr.indexOf(beforeLevel.id.toString());
                $.each(indexOfFloorHadPinned, function(i, vl) {
                    arrAbs.push(Math.abs(vl - indexOfCurrentFloor));
                }); 
                indexMin = arrAbs.indexOf(Math.min.apply(Math, arrAbs));
                indoormap.mapDataObject.setLevel(searchLevlObj(drawing.l, all_floor_arr[indexOfFloorHadPinned[indexMin]]));
            }
        }
   }

    init();

});