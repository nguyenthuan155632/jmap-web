// Outdoor Map JavaScript Document

var OutdoorMap = function(){

	self = this;
	this.map = new OpenLayers.Map("mapField");
	this.mapnik = new OpenLayers.Layer.OSM();

	this.epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
	this.vectorLayer = null;
    this.currentPositionLayer = null;
	
};

// イベント登録
OutdoorMap.prototype.registEvent = function(callbackMove,callbackClick){
	
	this.map.events.register('moveend',this.map,function(){

		var lonLat = self.map.getCenter().transform(
			new OpenLayers.Projection('EPSG:900913'),
			new OpenLayers.Projection('EPSG:4326')
		);
		callbackMove(lonLat.lon,lonLat.lat);

	});

	this.map.events.register('click',this.map,function(){
		callbackClick();
	});
	
};

// 中心表示
OutdoorMap.prototype.setCenter = function(longitude,latitude,init){

	var lonLat = new OpenLayers.LonLat(longitude,latitude)
	.transform(
		new OpenLayers.Projection("EPSG:4326"), 
		new OpenLayers.Projection("EPSG:900913")
	);
	
	if(init){
		this.map.setCenter(lonLat, 15);
	}else{
		this.map.panTo(lonLat);
	}
	
	
};

// Plot current position
OutdoorMap.prototype.plotCurrentPosition = function(lon, lat) {
    var size = new OpenLayers.Size(32, 32);
    if (this.currentPositionLayer) {
        this.map.removeLayer(this.currentPositionLayer);
    }

    this.currentPositionLayer = new OpenLayers.Layer.Vector("Overlay");
    var projectTo = this.map.getProjectionObject();

    jQuery (function() {
            var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(lon,lat).transform(self.epsg4326, projectTo),
                {
                    icon: "img/current_location.png"
                },
                {externalGraphic: "img/current_location.png", graphicHeight: 64, graphicWidth: 64, graphicXOffset:-(size.w/2),  graphicYOffset:-size.h  }
                //JS-comment-end
            );
            self.currentPositionLayer.addFeatures(feature);
        }
    );
    this.map.addLayer(this.currentPositionLayer);

}

// ピンプロット
OutdoorMap.prototype.prot = function(data, createPopup, destroyPopup, icon){
    
    var size = new OpenLayers.Size(32, 32);
    
    if (this.vectorLayer) {
        this.map.removeLayer(this.vectorLayer);
    }
    
    this.vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    
    var projectTo = this.map.getProjectionObject(); //The map projection (Spherical Mercator)
    
    //  取得したデータを使ってピンをたてる
    jQuery.each(data, function() {
        
        if (this.object_type && this.object_type != 2) return;
        
        var iconImg = '';
        if (icon === null) {
            iconImg = 'img/icon-' + this.business +'.svg';
        } else {
            var lang = browserLanguage();
            iconImg = 'img/pin/' + lang + '/' + icon +'.png';
        }
        
        // Define markers as "features" of the vector layer:
        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(this.longitude,this.latitude).transform(self.epsg4326, projectTo),
            //{description:this.name, exist_duty_free: this.exist_duty_free , exist_concierge : this.exist_concierge} ,
            {
                name: this.name,
                exist_duty_free: this.exist_duty_free,
                exist_concierge: this.exist_concierge,
                id: this.id,
                zip: this.zip,
                address: this.address,
                content: this.content,
                url: this.url,
                icon: iconImg,
                last_updated: this.last_updated,
                display_flag: this.display_flag
            },
            //JS-comment-start  "icon01.png"を変更して画像を指定してください。
            // TODO 業種によってアイコンを変更
            {externalGraphic: iconImg, graphicHeight: 32, graphicWidth: 32, graphicXOffset:-(size.w/2),  graphicYOffset:-size.h  }
            //JS-comment-end
        );    
        self.vectorLayer.addFeatures(feature);
    });
    this.map.addLayer(this.vectorLayer);
    
    // ポップアップセレクターを追加
    var controls = {
        selector: new OpenLayers.Control.SelectFeature(this.vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };
    this.map.addControl(controls['selector']);
    controls['selector'].activate();
    
    var rec_concierge = $('#recommend_concierge').prop('checked');
    var rec_dutyfree = $('#recommend_duty_free').prop('checked');
    OutdoorMap.prototype.recommend(rec_concierge,rec_dutyfree);
};

// リコメンド
OutdoorMap.prototype.recommend = function(concierge,dutyfree) {
	
	// ピンをループ
	jQuery.each(self.vectorLayer.features,function(){

		var disp = false;
		var image = null;
		if(concierge && dutyfree){
			if(this.attributes.exist_concierge === 1 && this.attributes.exist_duty_free === 1){
				image = 'img/pin_cn_Flag.svg';
			}else if(this.attributes.exist_concierge === 1 && this.attributes.exist_duty_free !== 1){
				image = 'img/pin_cn_Flag.svg';
			}else if(this.attributes.exist_concierge !== 1 && this.attributes.exist_duty_free === 1){
				image = 'img/pin_taxFree.svg';
			}else{
				image = this.attributes.icon;
			}
			disp = true;			
		}
		else if(concierge && !dutyfree){
			if(this.attributes.exist_concierge === 1){
				image = 'img/pin_cn_Flag.svg';
			}else{
				image = this.attributes.icon;
			}
			disp = true;			
		}
		else if(!concierge && dutyfree){
			if(this.attributes.exist_duty_free === 1){
				image = 'img/pin_taxFree.svg';
			}else{
				image = this.attributes.icon;
			}
			disp = true;
		}
		else if(!concierge && !dutyfree){
			image = this.attributes.icon;
			disp = true;
		}

		// 表示
		if(disp){
			this.style.display = '';
			// 画像変更
			this.style.externalGraphic = image;
		}
		// 非表示
		else{
			//this.style.display = 'none';
		}

	
	});
	
	// 再描画
	self.vectorLayer.redraw();
	
};

// 初期表示
OutdoorMap.prototype.init = function() {

	this.map.addLayer(this.mapnik);

};


OutdoorMap.prototype.showAirport = function (longitude,latitude) {
    var lonLat = new OpenLayers.LonLat(longitude,latitude)
        .transform(
        new OpenLayers.Projection("EPSG:4326"),
        new OpenLayers.Projection("EPSG:900913")
    );
    this.map.setCenter(lonLat, 5);
    //this.map.zoom = 5;
}

