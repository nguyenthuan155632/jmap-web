var jmap_i18n = new JMapI18N();
var i18n_id = ["10001", "501", "502", "503", "504", "505", "404", "406", "407", "800", "801", "802", "803", "804", "805", "806", "807", "808", "809"];
var i18n_id_ctgy = new Array();
jmap_i18n.getCategoryIdList().done(function (data) {
    for(var i = 0; i < data.response.info.texts.length; i++) {
        i18n_id_ctgy.push(data.response.info.texts[i].id);
    }
});
var lang = browserLanguage();
var i18n_taxfree, i18n_concierge;
var resources = {};
result = lang.indexOf("-");
if (result != -1) {
    lang = lang.substring(0, result) + lang.substring(result).toUpperCase();
}
resources[lang] = {translation: {}}
jmap_i18n.getResources(lang, i18n_id).done(function (data) {
    for (var i = 0; i < data.response.info.texts.length; i++) {
        resources[lang].translation[data.response.info.texts[i].id] =
                data.response.info.texts[i].attrs.name[0];
    }
    i18n.init({lng: lang, resStore: resources, fallbackLng: lang}).done(function () {
        window.JmapConfig.string = {
            10001: i18n.t("10001")
        };
        $(".i18ntext").i18n();
        i18n_taxfree = i18n.t("406");
        i18n_concierge = i18n.t("407");
    });
});
jmap_i18n.getCategoryResources(lang, i18n_id_ctgy).done(function (data) {
    for (var i = 0; i < data.response.info.texts.length; i++) {
        resources[lang].translation[data.response.info.texts[i].id] =
                data.response.info.texts[i].attrs.category[0];
    }
    i18n.init({lng: lang, resStore: resources, fallbackLng: lang}).done(function () {
        $(".i18ntext").i18n();
    });
});

jQuery(function ($) {

    var self = this;

    // あいまい検索時にセンタリングする緯度経度
    var LAT = getParameter('indoor_lat');//'<%= params[:indoor_lat] %>';
    var LNG = getParameter('indoor_lon');//'<%= params[:indoor_lon] %>';
    if (LAT == null || LAT == '' || LNG == null || LNG == '') {
        LAT = "35.670998";
        LNG = "139.765470";
    }

    var rec_concierge = false;
    var rec_dutyfree = false;

    var jmap = new JMap();
    var outdoormap = new OutdoorMap();

    // リコメンドダイアログ
    var recdialog = null;
    // 施設選択ダイアログ
    var buildselectDialog = null;

    // 入力パラメータ
    var pArea_id = getParameter('area_id');//'<%= params[:area_id] %>';
    var pArea_lat = getParameter('area_lat');//'<%= params[:area_lat] %>';
    var pArea_lng = getParameter('area_lng');//'<%= params[:area_lng] %>';
    var pFunc = getParameter('func');//'<%= params[:func] %>';
    var pSearch_word = getParameter('search_word');//'<%= params[:search_word] %>';

    var pBuilding_id = '';
    var pBuilding_name = '';
    var pUpdated = '';
    var pShops = null;
    var pBuildingList = {};
    var pBuild_type = null;
    var pIcon = null;

    //TODO クッキー利用
    var cookieCnt = 0;
    var showCnt = 0;
    var adBuilding = ["7341", "7331", "8697"];  //広告あり施設ID

    //Thuan added 20160712
    var category_list = new Array();
    var category_icon = new Array();
    var categoryMaster = new Array();
    var category_level1 = new Array();
    var category_level2 = new Array();
    var category_level3 = new Array();
    //End

    // 初期表示
    var init = function () {

        outdoormap.init();

        // リスト初期化
        listInit();

        // エリアタップ
        if (pFunc == 'map_click') {

            //最新緯度経度情報を保持すする
            LAT = pArea_lat;
            LNG = pArea_lng;

            // 中心指定
            outdoormap.setCenter(pArea_lng, pArea_lat, true);
            if (pArea_id && pArea_id == 11) {
                getAirports();
            }
            else {
                // 中心指定
                outdoormap.setCenter(pArea_lng, pArea_lat, true);
                moveMap(LNG, LAT);
            }
        }
        // 検索（戻るとき）
        else {
            if (pArea_id && pArea_id == 11) {
                getAirports();
            }
            else {
                // 中心指定(銀座へ)
                outdoormap.setCenter(LNG, LAT, true);
                moveMap(LNG, LAT);
                // 検索
                if (pSearch_word != null && pSearch_word != '') {
                    serachAreasVenues();
                }
            }
        }

        // イベントを登録
        if (pArea_id && pArea_id == 11) {
            outdoormap.registEvent(getAirports, clickMap);
        }
        else {
            outdoormap.registEvent(moveMap, clickMap);
        }
    };

    // 検索
    var serachAreasVenues = function () {
        // APIコール
        jmap.findAreasAndBuildings(pSearch_word).done(function (data) {

            jmap.errorHandling(data);

            var info = data.response.info.object;

            // 免税店とコンシェルジュの有無をフラグ化
            jQuery.each(info, function (i) {

                this.concierge_count > 0 ? this.exist_concierge = 1 : this.exist_concierge = 0;
                this.duty_free_count > 0 ? this.exist_duty_free = 1 : this.exist_duty_free = 0;

            });

            // 施設プロット
            // outdoormap.prot(info,createPopup,destroyPopup);

            // 一覧描画
            renderAreaList(info);

            // リストオープン
            listOpen();
        })
                .fail(function () {
                    console.log(ERROR_MESSAGE_02);
                });
    }

    // 一覧表をレンダリング
    var renderAreaList = function (data) {

        $('#searchlist').empty();

        //  取得したデータを使って一覧に表示
        jQuery.each(data, function (i) {

            var listdata = this;

            var icons = '';
            if (this.duty_free_count > 0) {
                icons += '<object data="img/icon-taxfree.svg" type="image/svg+xml" width="20" height="22"></object>' + i18n_taxfree + '(' + this.duty_free_count + ')&nbsp;&nbsp;&nbsp;';
            }
            if (this.concierge_count > 0) {
                icons += '<object data="img/icon-concierge.svg" type="image/svg+xml" width="20" height="22"></object>' + i18n_concierge + '(' + this.concierge_count + ')';
            }

            // 画像指定がない場合はデフォルト画像を設定する。
            this.background_image = jmap.getDefaultImg(this.background_image);

            var li = $('\
			<li class="list__item list__item--tappable">\
            	<div class="building-box">\
					<div class="thumb-box">\
                    	<img src="' + this.background_image + '" width="100%" alt="" />\
                    </div>\
                    <div class="detail-box">\
                    	<dl>\
                        	<dt>' + this.name + '</dt>\
                            <dd class="detail">' + icons + '</dd>\
                        </dl>\
                    </div>\
                </div>\
            </li>\
			')
                    .on('click', function () {
                        clickList(listdata);
                    });

            $('#searchlist').append(li);

        });

    };

    // 一覧表をクリック
    var clickList = function (data) {

        // 中心指定
        outdoormap.setCenter(data.longitude, data.latitude, false);

        if (data.object_type == '1') {
            // TODO 施設の詳細は取得不可
            // showBuildSelectDialog('#tab-button', data);
        }
        else {

            showBuildSelectDialog('#tab-button', data);
        }

        // リストクローズ
        listClose();

    };

    // ピンクリック時のコールバック
    var createPopup = function (feature) {

        //var lonLat = feature.geometry.getBounds().getCenterLonLat();

        var lonLat = feature.geometry.getBounds().getCenterLonLat().transform(
                new OpenLayers.Projection('EPSG:900913'),
                new OpenLayers.Projection('EPSG:4326')
        );

        outdoormap.setCenter(lonLat.lon, lonLat.lat, false);

        // 禁止施設判定
        if (feature.attributes.display_flag != 1) {
            if (self.buildLimitIndoorDialog) {
                self.buildLimitIndoorDialog.hide();
            }
            showBuildLimitIndoorDialog('#tab-button', feature.attributes);
        } else {
            if (self.buildselectDialog) {
                //self.buildselectDialog.destroy();
                self.buildselectDialog.hide();
                //self.buildselectDialog = null;
            }
            // 施設情報ダイアログ
            if (pIcon) {
                showSingleBuildSelectDialog('#tab-button', feature.attributes);
            } else {
                showBuildSelectDialog('#tab-button', feature.attributes);
            }
        }
    };

    // ピン選択解除時のコールバック
    var destroyPopup = function (feature) {

        if (self.buildselectDialog) {
            //self.buildselectDialog.destroy();
            self.buildselectDialog.hide();
            //self.buildselectDialog = null;
        }

        if (self.buildLimitIndoorDialog) {
            self.buildLimitIndoorDialog.hide();
        }

    };

    // 地図移動コールバック
    var moveMap = function (longitude, latitude) {
//            setCurrentPosition();
        // 最新の緯度経度を保持する。
        LAT = latitude;
        LNG = longitude;

        // 半径検索
        jmap.findBuildingsWithRadius(longitude, latitude, pBuild_type, pIcon).done(function (data) {

            jmap.errorHandling(data);

            var info = data.response.info.building_info;

            // 施設プロット
            outdoormap.prot(info, createPopup, destroyPopup, pIcon);
//                showShopResponse(info);    //TODO debug
        })
                .fail(function () {
                    console.log(ERROR_MESSAGE_02);
                });
    };

    var getAirports = function() {
        jmap.getAirports().done(function (data) {
            jmap.errorHandling(data);
            var info = data.response.info.building_info;
            outdoormap.prot(info, createPopup, destroyPopup, pIcon);
        }).fail(function () {
            console.log(ERROR_MESSAGE_02);
        });
    };

    // TODO debug shop response
    var showShopResponse = function (obj) {
        var properties = "";
        for (var idx in obj) {
            properties += idx + "=" + obj[idx].id + "\n";
        }
        alert(properties);
    }

    // 地図クリックコールバック
    var clickMap = function () {
        if (self.buildselectDialog) {
            //self.buildselectDialog.destroy();
            self.buildselectDialog.hide();
            //self.buildselectDialog = null;
        }
    };

    // 商業施設のみ表示
    var clickIconList = function (icon) {

        // 絞り込んだアイコン
        pIcon = icon;

        // 選択されたカテゴリ取得
        pBuild_type = $('[name="buildtype"]:checked').map(function () {
            return $(this).val();
        }).get();

        // 半径検索
        jmap.findBuildingsWithRadius(LNG, LAT, pBuild_type, pIcon).done(function (data) {

            jmap.errorHandling(data);

            var info = data.response.info.building_info;

            // 施設プロット
            outdoormap.prot(info, createPopup, destroyPopup, pIcon);

        })
                .fail(function () {
                    console.log(ERROR_MESSAGE_02);
                });
    }

    // リコメンドクリック時
    var recommendConcierge = function () {
        self.rec_concierge = $('#recommend_concierge').prop('checked');
        self.rec_dutyfree = $('#recommend_duty_free').prop('checked');

        // ロギング
        if (self.rec_concierge) {
            jmap.outputLogConcierge();
        }

        outdoormap.recommend(self.rec_concierge, self.rec_dutyfree);
    };

    var recommendDutyfree = function () {

        self.rec_concierge = $('#recommend_concierge').prop('checked');
        self.rec_dutyfree = $('#recommend_duty_free').prop('checked');

        // ロギング
        if (self.rec_dutyfree) {
            jmap.outputLogDutyfree();
        }

        outdoormap.recommend(self.rec_concierge, self.rec_dutyfree);
    };

    // 屋内地図遷移
    var goIndoorMap = function (info) {
        // 建物ごとでクッキー判定
        if ($.inArray(info.id, adBuilding) >= 0) {
            cookieCnt = $.cookie(info.id);
            if ($.cookie(info.id)) {
                cookieCnt++;
            } else {
                cookieCnt = 1;
            }
            $.cookie(info.id, cookieCnt);
        }

        var form;
        var ad_img_filename;
        if (cookieCnt <= showCnt) {
            form = $('<form action="indoor_map" method="get">');
        } else {
            if (lang.toLowerCase() == 'ja') {
                ad_img_filename = 'logo_jp_01.svg';
            }
            else if (lang.toLowerCase() == 'en') {
                ad_img_filename = 'logo_en_02.svg';
            }
            else if (lang.toLowerCase() == 'zh-tw') {
                ad_img_filename = 'logo_zh-tw_02.svg';
            }
            else {
                ad_img_filename = 'img_ad.jpg';
            }
                form = $('<form action="indoor_map_ad" method="get">');

                //TODO apiからの値を設定する
                form
                        .append('<input type="hidden" name="ad_img" value="img/ad/'+ad_img_filename+'">')
                        .append('<input type="hidden" name="ad_title" value="">')
                        .append('<input type="hidden" name="ad_overview" value="">')
                        .append('<input type="hidden" name="ad_btn_label" value="Skip this advertising...">')

        }
        form.append('<input type="hidden" name="id" value="' + info.id + '">')
                .append('<input type="hidden" name="lat" value="' + LAT + '">')
                .append('<input type="hidden" name="lon" value="' + LNG + '">')
                .append('<input type="hidden" name="area_id" value="' + pArea_id + '">')
                .append('<input type="hidden" name="updated" value="' + info.last_updated + '">')    // apiからの値を設定する
                .appendTo(document.body)
                .submit();
    };

    // 屋内地図遷移（店舗指定あり）
    var clickShop = function (data, i) {
        // 建物ごとでクッキー判定
        if ($.inArray(pBuilding_id, adBuilding) >= 0) {
            cookieCnt = $.cookie(pBuilding_id);
            if ($.cookie(pBuilding_id)) {
                cookieCnt++;
            } else {
                cookieCnt = 1;
            }
            $.cookie(pBuilding_id, cookieCnt);
        }

        var form;
        var ad_img_filename;
        if (cookieCnt <= showCnt) {
            form = $('<form action="indoor_map" method="get">');
        } else {
            if (lang.toLowerCase() == 'ja') {
                ad_img_filename = 'logo_jp_01.svg';
            }
            else if (lang.toLowerCase() == 'en') {
                ad_img_filename = 'logo_en_02.svg';
            }
            else if (lang.toLowerCase() == 'zh-tw') {
                ad_img_filename = 'logo_zh-tw_02.svg';
            }
            else {
                ad_img_filename = 'img_ad.jpg';
            }
            form = $('<form action="indoor_map_ad" method="get">');
                //TODO apiからの値を設定する
                form
//                        .append('<input type="hidden" name="ad_link" value="http://item.shopping.c.yimg.jp/i/l/cosmepia-y_4979006067064">')
                    .append('<input type="hidden" name="ad_img" value="img/ad/'+ad_img_filename+'">')
                        .append('<input type="hidden" name="ad_title" value="">')
                        .append('<input type="hidden" name="ad_overview" value="">')
                        .append('<input type="hidden" name="ad_btn_label" value="Skip this advertising...">')
        }

        if (pArea_id == 11) {
            form.append('<input type="hidden" name="id" value="' + pBuilding_id + '">')
                    .append('<input type="hidden" name="shop_id" value="' + data[i].shop_id + '">')
                    .append('<input type="hidden" name="floor_id" value="' + data[i].floor_id + '">')
                    .append('<input type="hidden" name="lat" value="' + LAT + '">')
                    .append('<input type="hidden" name="lon" value="' + LNG + '">')
                    .append('<input type="hidden" name="area_id" value="' + pArea_id + '">')
                    .append('<input type="hidden" name="drawing_index" value="' + data[i].drawing_index + '">')
                    .append('<input type="hidden" name="updated" value="' + pUpdated + '">')    //TODO apiからの値を設定する
                    .appendTo(document.body)
                    .submit();
        }
        else {
            form.append('<input type="hidden" name="id" value="' + pBuilding_id + '">')
                    .append('<input type="hidden" name="shop_id" value="' + data[i].shop_id + '">')
                    .append('<input type="hidden" name="floor_id" value="' + data[i].floor_id + '">')
                    .append('<input type="hidden" name="lat" value="' + LAT + '">')
                    .append('<input type="hidden" name="lon" value="' + LNG + '">')
                    .append('<input type="hidden" name="area_id" value="' + pArea_id + '">')
                    .append('<input type="hidden" name="updated" value="' + pUpdated + '">')    //TODO apiからの値を設定する
                    .appendTo(document.body)
                    .submit();
        }
    };

    // 施設選択ダイアログ
    var showBuildSelectDialog = function (obj, info) {
        //if(self.buildselectDialog) return;
        if (self.buildselectDialog && self.buildselectDialog.isShown()) return;

        if (self.buildselectDialog) {
            self.buildselectDialog.show(obj);
            $(".i18ntext").i18n();

            $('#buildname').text(info.name);
            $('#buildaddr').text("〒" + info.zip + " " + info.address);
            $('#buildtext').html(info.content);
            $('#buildbtn').off('click');
            $('#buildbtn').on('click', function () {
//                    goIndoorMap(info.id);
                goIndoorMap(info);
            });
            $('#searchbtn').off('click');
            $('#searchbtn').on('click', function () {
                goOnsiteSearchDialog(info.id);
            });
            $('#buildurl').off('click');
            $('#buildurl').on('click', function () {
                window.open(info.url);
            });
        }
        else {

            ons.createPopover('build-select-dialog.html').then(function (popover) {
                self.buildselectDialog = popover;
                popover.show(obj);
                $(".i18ntext").i18n();

                $('#buildname').text(info.name);
                $('#buildaddr').text("〒" + info.zip + " " + info.address);
                $('#buildtext').html(info.content);
                $('#buildbtn').off('click');
                $('#buildbtn').on('click', function () {
//                            goIndoorMap(info.id);
                    goIndoorMap(info);
                });
                $('#searchbtn').off('click');
                $('#searchbtn').on('click', function () {
                    goOnsiteSearchDialog(info.id);
                });
                $('#buildurl').off('click');
                $('#buildurl').on('click', function () {
                    window.open(info.url);
                });
            });
        }

        // リストクローズ
        listClose();
    };

    // Indoor禁止施設選択ダイアログ
    var showBuildLimitIndoorDialog = function (obj, info) {
        if (self.buildLimitIndoorDialog && self.buildLimitIndoorDialog.isShown()) return;
        if (self.buildLimitIndoorDialog) {
            self.buildLimitIndoorDialog.show(obj);
            $(".i18ntext").i18n();

            $('#buildname_l').text(info.name);
            $('#buildaddr_l').text("〒" + info.zip + " " + info.address);
        }
        else {
            ons.createPopover('build-limit-indoor-dialog.html').then(function (popover) {
                self.buildLimitIndoorDialog = popover;
                popover.show(obj);
                $(".i18ntext").i18n();

                $('#buildname_l').text(info.name);
                $('#buildaddr_l').text("〒" + info.zip + " " + info.address);
            });
        }
        // リストクローズ
        listClose();
    };

    // 施設選択ダイアログ（シンプル版）
    var showSingleBuildSelectDialog = function (obj, info) {
        if (self.singleBuildSelectDialog && self.singleBuildSelectDialog.isShown()) return;

        if (self.singleBuildSelectDialog) {
            self.singleBuildSelectDialog.show(obj);

            $('#buildname_s').text(info.name);
            $('#buildaddr_s').text("〒" + info.zip + " " + info.address);
            $('#buildtext_s').html(info.content);
            $('#buildbtn_s').off('click');
            $('#buildbtn_s').on('click', function () {
                goOnsiteSearchDialog(info.id);
            });

        }
        else {

            ons.createPopover('single-build-select-dialog.html').then(function (popover) {
                self.singleBuildSelectDialog = popover;
                popover.show(obj);

                $('#buildname_s').text(info.name);
                $('#buildaddr_s').text("〒" + info.zip + " " + info.address);
                $('#buildtext_s').html(info.content);
                $('#buildbtn_s').on('click', function () {
                    goOnsiteSearchDialog(info.id);
                });
            });
        }
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

    // カテゴリ検索ダイアログ
    var showSearchDialog = function () {

        if (self.searchdialog) {
            self.searchdialog.show("none");
            return;
        }

        ons.createDialog('root-search-dialog.html').then(function (dialog) {

            //Thuan added 20160712
            renderRootCategoryListToDialog();
            //End

            $('img[name="icon"]').each(function () {
                if ($(this).attr('src').indexOf('/' + lang.toLowerCase() + '/') == -1) {
                    var onSrc = $(this).attr('src').replace('img/icon/', 'img/icon/' + lang.toLowerCase() + '/');
                    $(this).attr('src', onSrc);
                }
            });

            self.searchdialog = dialog;
            dialog.show("none");
            $(".i18ntext").i18n();

            // アイコン
            //Thuan added 20160712
            $.each(category_icon, function(i, v) {
                $('#select_icon_root_' + v).on('click', function() {
                    clickIconList(v);
                    rootSearchDialog.hide();
                });
            });
            //End

            // 中国人コンシェルジュ
            $('#recommend_ch').on('click', function () {
                rootSearchDialog.hide();
                showRecomendDialog();
            });

            // Tax Free
            $('#recommend_taxfree').on('click', function () {
                rootSearchDialog.hide();
                showRecomendDialog();
            });
        });
    }

    // 施設内検索ダイアログ
    var goOnsiteSearchDialog = function (buildid) {
        if (pBuildingList[buildid]) {

            if (pIcon) {
                showMultiToiletDialog(pIcon, pBuildingList[buildid]);
            } else {
                showOnsiteSearchDialog(pBuildingList[buildid]);
            }

        } else {
            // APIコール
            jmap.getIndoorMap(buildid).done(function (data) {

                jmap.errorHandling(data);
                pBuildingList[buildid] = data.response.info;

                if (pIcon) {
                    showMultiToiletDialog(pIcon, data.response.info);
                } else {
                    showOnsiteSearchDialog(data.response.info);
                }

            })
                    .fail(function () {
                        console.log(ERROR_MESSAGE_02);
                    });
        }
    }

    // 施設内検索ダイアログ表示
    var showOnsiteSearchDialog = function (info) {
        pBuilding_id = info.building_id;
        pBuilding_name = info.building_name;
        pUpdated = info.last_updated;
        pShops = info.shop_info;
        categoryMaster = info.category_master;
        if (self.onsitesearchdialog) {
            $("#buildname-search").text(pBuilding_name);
            self.onsitesearchdialog.show("none");

            // カテゴリ単位の店舗リストのレンダリング
            renderShopListToCategory();
            return;
        }

        ons.createDialog('onsite-search-dialog.html').then(function (dialog) {

            //Thuan added 20160712
            renderOnsiteCategoryListToDialog();
            //End

            $('img[name="icon"]').each(function () {
                if ($(this).attr('src').indexOf('/' + lang.toLowerCase() + '/') == -1) {
                    var onSrc = $(this).attr('src').replace('img/icon/', 'img/icon/' + lang.toLowerCase() + '/');
                    $(this).attr('src', onSrc);
                }
            });

            // カテゴリ単位の店舗リストのレンダリング
            renderShopListToCategory();

            self.onsitesearchdialog = dialog;
            $("#buildname-search").text(pBuilding_name);
            dialog.show("none");
            $(".i18ntext").i18n();

            // アイコン
            //Thuan added 20160712
            $.each(category_icon, function(i, v) {
                $('#select_icon_' + v).on('click', function() {
                    showMultiToiletDialog(v);
                });
            });
            //End

            // 中国人コンシェルジュ
            $('#recommend_ch').on('click', function () {
                onsiteSearchDialog.hide();
                showRecomendDialog();
            });

            // Tax Free
            $('#recommend_taxfree').on('click', function () {
                onsiteSearchDialog.hide();
                showRecomendDialog();
            });
        });
    }

    // 商業施設のみ表示
    var showMultiToiletDialog = function (icon, info) {

        if (info != null) {
            pBuilding_id = info.building_id;
            pBuilding_name = info.building_name;
            pUpdated = info.last_updated;
            pShops = info.shop_info;
        }

        if (self.multidialog) {
            // 指定したアイコンの店舗リストのレンダリング
            renderShopList(icon);

            self.multidialog.show("none");
            return;
        }

        ons.createDialog('multi-toilet-dialog.html').then(function (dialog) {

            // 指定したアイコンの店舗リストのレンダリング
            renderShopList(icon);

            $("#buildname-multi").text(pBuilding_name);
            self.multidialog = dialog;
            dialog.show("none");
        });
    }

    // 指定したアイコンの店舗リストのレンダリング
    var renderShopList = function (icon) {
        $("#buildname-multi").empty();
        $("#buildname-multi").text(pBuilding_name);
        $('#shoplist').empty();

        var listdata = this;

        //  取得したデータを使って一覧に表示
        jQuery.each(pShops, function (i) {
            if (this.category_id == icon) {
                var li = $('\
      <li class="list__item list__item--chevron">\
        <div class="recomend-icon"><img src="img/pin_location.png" height="26"></div><span class="list__item__line-height">' + this.floor_number + ' ' + this.shop_name + '</span>\
      </li>\
      ')
                        .on('click', function () {
                            clickShop(pShops, i);
                        });

                $('#shoplist').append(li);
            }
        });
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

    //Thuan added 20160712
    var renderRootCategoryListToDialog = function() { 
        category_icon = [];
        $.each(i18n_id_ctgy, function(index, value) {
            if(value.charAt(1) == "2") category_icon.push(value); 
        });        
        var html = "";
        html += '<div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="801"></span></div>';
        html += '<ul class="list">';
        for(var i = 0; i < category_icon.length; i++) {
            html += '<li class="list__item list__item--chevron" id="select_icon_root_' + category_icon[i] + '">';
            html += '<div class="recomend-icon"><img name="icon" src="img/icon/icon_' + category_icon[i] + '.png" width="26" height="26"></div>';
            html += '<span class="list__item__line-height i18ntext" data-i18n="' + category_icon[i] + '"></span>';
            html += '</li>';
        }
        html += '</ul>';

        $('#list-root-search').append(html);
    }

    var renderOnsiteCategoryListToDialog = function() {
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

        $.each(category_parent, function(index, value) {
            if(value[0].charAt(1) == "1") category_list.push(value);
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

        category_icon = [];
        $.each(i18n_id_ctgy, function(index, value) {
            if(value.charAt(1) == "2") category_icon.push(value); 
        });
        var html = "";
        html += '<div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="800"></span></div>';
        html += '<dl class="acMenu cateMenu">';
        for(var i = 0; i < category_level1.length; i++) {
            html += '<dt>';
            html += '<object data="stylesheets/ionicons/fonts/plus-round.svg" type="image/svg+xml" width="24" class="plus"></object>';
            html += '<object data="stylesheets/ionicons/fonts/minus-round.svg" type="image/svg+xml" width="24" class="minus" style="display:none"></object>';
            html += '<span><img src="img/icon_category_' + category_level1[i] + '.png" width="26" height="26"></span><span class="i18ntext" data-i18n="' + category_level1[i] + '"></span>';
            html += '</dt>';
            html += '<dd>';
            html += '<dl class="acMenu cateMenu ">';
            for(var j = 0; j < category_level2.length; j++) {
                if(checkRelationalCategory(category_list, category_level2[j], category_level1[i])) {
                    html += '<dt>';
                    html += '<object data="stylesheets/ionicons/fonts/plus-round.svg" type="image/svg+xml" width="24" class="plus"></object>';
                    html += '<object data="stylesheets/ionicons/fonts/minus-round.svg" type="image/svg+xml" width="24" class="minus" style="display:none"></object>';
                    html += '<span class="i18ntext" data-i18n="' + category_level2[j] + '"></span></dt>';
                    html += '</dt>';
                    html += '<dd>';
                    html += '<dl class="acMenu cateMenu ">';
                    for(var k = 0; k < category_level3.length; k++) {
                        if(checkRelationalCategory(category_list, category_level3[k], category_level2[j])) {
                            html += '<dt>';
                            html += '<object data="stylesheets/ionicons/fonts/plus-round.svg" type="image/svg+xml" width="24" class="plus"></object>';
                            html += '<object data="stylesheets/ionicons/fonts/minus-round.svg" type="image/svg+xml" width="24" class="minus" style="display:none"></object>';
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
        html += '<div style="background-color:#eee; padding:5px;"><span class="i18ntext" data-i18n="801"></span></div>';
        html += '<ul class="list">';
        for(var i = 0; i < category_icon.length; i++) {
            html += '<li class="list__item list__item--chevron" id="select_icon_' + category_icon[i] + '">';
            html += '<div class="recomend-icon"><img name="icon" src="img/icon/icon_' + category_icon[i] + '.png" width="26" height="26"></div>';
            html += '<span class="list__item__line-height i18ntext" data-i18n="' + category_icon[i] + '"></span>';
            html += '</li>';
        }
        html += '</ul>';

        $('#list-onsite-search').append(html);
    }

    var checkRelationalCategory = function(categoryList, childCateId, parentCateId) {
        var res = false;
        $.each(categoryList, function(i, v) {
            if($.inArray(childCateId, v) !== -1 && $.inArray(parentCateId, v) !== -1) {
                res = true;
            }
        });
        return res;
    }
    //End

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
                        clickShop(pShops, i);
                    });

            for(var j = 0; j < category_level3.length; j++) {
                if(this.category_id == category_level3[j]) {
                    $('#list' + this.category_id).append(li);
                }
            }

        });
    };

    $('#recommend_button').on('click', function () {
        //showRecomendDialog();
        showSearchDialog();
    });

    // エリア・施設検索
    $('#searchButton').on('click', function () {
        // リストクローズ
        listClose();
        // 検索
        if ($('#search').val() != '') {
            pSearch_word = $('#search').val();
            serachAreasVenues();
        }
    });

    // レコメンドダイアログ
    var isListOpen = function () {
        return toggle;
    }


    var pos_id;
    var plotCurrentPsition = function (pos) {
//            console.log("pos.coords.longitude:"+pos.coords.longitude+" pos.coords.latitude:"+pos.coords.latitude);
        outdoormap.plotCurrentPosition(pos.coords.longitude, pos.coords.latitude);
    }

    var error = function (err) {
//            console.log(err.message);
        navigator.geolocation.clearWatch(pos_id);
    }

    var setCurrentPosition = function () {
        var options = {timeout: 20000, enableHighAccuracy: true, maximumAge: 10000};
//            pos_id = navigator.geolocation.watchPosition(plotCurrentPsition, error, options);
        pos_id = navigator.geolocation.getCurrentPosition(plotCurrentPsition, error, options);
    }

    init();
    if (pArea_id && pArea_id == 11) {
        var pArea_lat = getParameter('area_lat');//'<%= params[:area_lat] %>';
        var pArea_lng = getParameter('area_lng');//'<%= params[:area_lng] %>';
        outdoormap.showAirport(pArea_lng, pArea_lat);

    }
    setCurrentPosition();


});