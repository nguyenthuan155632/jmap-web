var JMapI18N = function() {
    this.i18n_api_url = window.JmapConfig.api.location;
	this.i18n_type = "screen";
	this.i18n_attr_name = "name";
};

JMapI18N.prototype.getResources = function(lang, i18n_id) {

	var defer = $.Deferred(); 
	var data = {
		type: this.i18n_type,
		id: i18n_id,
		name: this.i18n_attr_name,
		lang: lang
	};

	$.ajax({
		type:"post",
		url: this.i18n_api_url + "query/",
		contentType: 'application/x-www-form-urlencoded;json',
		dataType: "json",
		data:$.param(data),
		success: function(data) {
			// console.log("i18n query success.");
			defer.resolve(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			// console.log("i18n query failed.");
			defer.reject();
		}
	});
	return defer.promise();
};

JMapI18N.prototype.getCategoryResources = function(lang, i18n_id) {

	var defer = $.Deferred();
	var data = {
		type: "category",
		id: i18n_id,
		name: "category",
		lang: lang
	};

	$.ajax({
		type:"post",
		url: this.i18n_api_url + "query/",
		contentType: 'application/x-www-form-urlencoded;json',
		dataType: "json",
		data:$.param(data),
		success: function(data) {
			defer.resolve(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			defer.reject();
		}
	});
	return defer.promise();
};

JMapI18N.prototype.getCategoryIdList = function() {

	var defer = $.Deferred();
	var data = {
		type: "list"
	};

	$.ajax({
		type:"post",
		url: this.i18n_api_url + "query/",
		contentType: 'application/x-www-form-urlencoded;json',
		dataType: "json",
		data:$.param(data),
		success: function(data) {
			defer.resolve(data);
		},
		error: function(xhr, textStatus, errorThrown) {
			defer.reject();
		}
	});
	return defer.promise();
};