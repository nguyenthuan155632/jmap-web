$(document).ready(function() { 

	// For todays date;
	Date.prototype.today = function (format) { 
		if(format) {
			return this.getFullYear() + "-" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-" + ((this.getDate() < 10)?"0":"") + this.getDate();
		}
		else {
			return this.getFullYear() + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + ((this.getDate() < 10)?"0":"") + this.getDate();
		}
	}

	// For the time now
	Date.prototype.timeNow = function (format) {
		if(format) {
			return ((this.getHours() < 10)?"0":"") + this.getHours() + ":" + ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
		}
		else {
			return ((this.getHours() < 10)?"0":"") + this.getHours() + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
		}
	}

	// Get word_library table from word_management database
	function init_word_db(lg) {
    	var defer = $.Deferred(); 
		var data = {
			target_lang: lg
		};

		$.ajax({
			type:"get",
			url: "http://" + window.location.hostname + "/import/word_library",
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
    }

    // Get poi_libraries table from word_management database
	function init_poi_db() {
    	var defer = $.Deferred(); 
		var data = {};

		$.ajax({
			type:"get",
			url: "http://" + window.location.hostname + "/import/poi_libraries",
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
    }

	// Insert data into tasks table (database)    
    function insert_db(tsk, lang, ori, ext, reg, file, stat) {
    	var defer = $.Deferred(); 
		var data = {
			task: tsk, 
			language: lang, 
			original: ori,
			extract: ext,
			registration: reg, 
			filename: filename,
			status: stat,
			authenticity_token: window._token
		};

		$.ajax({
			type:"post",
			url: "http://" + window.location.hostname + "/import/insert_db",
			contentType: 'application/x-www-form-urlencoded;json',
			dataType: "json",
			data:$.param(data), 
			success: function(data) {
				defer.resolve(data);
			},
			error: function(xhr, textStatus, errorThrown) {
				defer.reject();
			},
		});
		return defer.promise();
    }

    // Insert data into word_library table (database)
    function insert_word_db(word_id, source_word, target_lang, target_word, source_shortname, target_shortname) {
    	var defer = $.Deferred(); 
		var data = {
			word_id: word_id,
			source_lang: "ja",
			source_word: source_word,
			target_lang: target_lang,
			target_word: target_word,
			source_shortname: source_shortname,
			target_shortname: target_shortname,
			authenticity_token: window._token								// Authentication Token for ajax's post method 
		};

		$.ajax({
			type:"post",
			url: "http://" + window.location.hostname + "/import/insert_word_db",
			contentType: 'application/x-www-form-urlencoded;json',
			dataType: "json",
			data:$.param(data),
			success: function(data) {
				defer.resolve(data);
			},
			error: function(xhr, textStatus, errorThrown) {
				defer.reject();
			},
		});
		return defer.promise();
    }

    // Insert data into poi_libraries table (database)
    function insert_poi_db(id, shop_id, shop_name, categoryid_1, categoryid_2, categoryid_3, categoryid_4) {
    	var defer = $.Deferred(); 
		var data = {
			id: id,
			shop_id: shop_id,
			shop_name: shop_name,
			categoryid_1: categoryid_1,
			categoryid_2: categoryid_2,
			categoryid_3: categoryid_3, 
			categoryid_4: categoryid_4,
			authenticity_token: window._token								// Authentication Token for ajax's post method 
		};

		$.ajax({
			type:"post",
			url: "http://" + window.location.hostname + "/import/insert_poi_db",
			contentType: 'application/x-www-form-urlencoded;json',
			dataType: "json",
			data:$.param(data),
			success: function(data) {
				defer.resolve(data);
			},
			error: function(xhr, textStatus, errorThrown) { 
				defer.reject();
			},
		});
		return defer.promise();
    }

    // Convert Array to CSV
    function convert_arr_to_csv(array) {
    	var csv = "";
    	array.forEach(function(info, index){
		   dataStr = info.join(",");
		   csv += index < array.length ? dataStr + "\n" : dataStr;
		});
		csv = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csv);
		return csv;
    }

    function shortname(input, lang, lngVar) {
		var length = input.length;
		var output = "";
		if(length > lngVar) {
			output = input.substr(0, lngVar) + '...';
		} else {
			output = input;
		} 
		return output;
	}

	function checkExistExtract(value, array) {
		var result = [];

		return result;
	}

    // Get date from Import Page, contain some values from user input
	var data = JSON.parse(localStorage.getItem('_data'));
	var language = JSON.parse(localStorage.getItem('_language'));
	var filename = JSON.parse(localStorage.getItem('_filename'));
	var action = localStorage.getItem('_action');
	var task = localStorage.getItem('_task');
	var lengthText_en = parseInt(localStorage.getItem('_lengthText_en'));
	var lengthText_zh_cn = parseInt(localStorage.getItem('_lengthText_zh_cn'));
	var lengthText_zh_tw = parseInt(localStorage.getItem('_lengthText_zh_tw'));
	var lengthText_zh_ko = parseInt(localStorage.getItem('_lengthText_zh_ko'));
	if(lengthText_en == 0 || lengthText_en == NaN) {
		lengthText_en = 10;
	}
	if(lengthText_zh_cn == 0 || lengthText_zh_cn == NaN) {
		lengthText_zh_cn = 10;
	}
	if(lengthText_zh_tw == 0 || lengthText_zh_tw == NaN) {
		lengthText_zh_tw = 10;
	}
	if(lengthText_zh_ko == 0 || lengthText_zh_ko == NaN) {
		lengthText_zh_ko = 10;
	}
	localStorage.removeItem('_data');
	localStorage.removeItem('_language');
	localStorage.removeItem('_filename');
	localStorage.removeItem('_action');
	localStorage.removeItem('_task');
	localStorage.removeItem('_lengthText_en');
	localStorage.removeItem('_lengthText_zh_cn');
	localStorage.removeItem('_lengthText_zh_tw');
	localStorage.removeItem('_lengthText_zh_ko');
	// console.log(lengthText_en, lengthText_zh_ko, lengthText_zh_tw, lengthText_zh_cn);

	var datetime = new Date().today(false) + new Date().timeNow(false);
	var _datetime = new Date().today(true) + " " + new Date().timeNow(true);

	// Handle
	if(!data) return false;
	else {
		// Add new record (only javascript/jquery, not insert into task table yet)
		$('#import-list tbody tr:first').after('\
			<tr>\
				<td class="datetime-row">---</td>\
				<td class="task-row">---</td>\
				<td class="status-row"><span class="label label-danger">---</span></td>\
				<td class="language-row">---</td>\
				<td class="file-row">---</td>\
				<td class="link-extract-row"><img style="width: 20px;" src="/img/waiting.gif" /></td>\
				<td class="link-regis-row"><img style="width: 20px;" src="/img/waiting.gif" /></td>\
			</tr>'
		);
		// Variable (arrOriginal) contain original input file
		arrOriginal = convert_arr_to_csv(data);

		// Append text/html to new record above
		$('#import-list tbody .datetime-row').text(_datetime);
		$('#import-list tbody .file-row').html('<a href="' + arrOriginal + '" download="' + filename + '">'+ filename +'</a>');		// Create link download for original input file (use jquery-csv library)
		if(task == "translation") {
			$('#import-list tbody .task-row').text('翻訳');
			$('#import-list tbody .language-row').text(language.toString());
			var word_data = null;
			// Execute asynchronously for seperation languages
			init_word_db(language).done(function(response) {
				// Get data from word_libary table
				// console.log(response);
				word_data = response;											// Extract difference
				if(action == "extract") {
					$('#import-list tbody .status-row').html('<span class="label label-danger">wait</span>');
					var arrExtract = [];
					var arrRegistration = [];
					// Foreach seperation languages
					$.each(word_data, function(index, value) {
						var arrResult = [];	
						var arrResult_2 = [];
						arrResult_2.push(["type","id","name","lang","value"]);
						for(var j = 0; j < data.length; j++) {
				    		var exist = false;
				    		for(var k = 0; k < value.length; k++) {
				    			if(data[j][4] == value[k]['source_word']) {
				    				arrResult_2.push([data[j][0], data[j][1], data[j][2], value[k]['target_lang'], value[k]['target_word']]);
				    				exist = true;
				    				break;
				    			}
				    		}
				    		if(!exist) {
				    			arrResult.push(data[j]);						// Get values different from database (does not exist in database)
				    		}
				    	}
				    	// Convert array to csv format
						encodedUri = convert_arr_to_csv(arrResult);
						encodedUri_2 = convert_arr_to_csv(arrResult_2);
						$('#import-list tbody .link-extract-row').append('<a href="' + encodedUri + '" download="'+index+'_差分_'+filename+'">'+ index +':DL </a>');
						$('#import-list tbody .link-regis-row').append('<a href="' + encodedUri_2 + '" download="'+index+'_置換_'+filename+'">'+ index +':DL </a>');
						
						var arrLang = {};
						arrLang[index] = encodedUri;
						arrExtract.push(arrLang);
						var arrLang_2 = {};
						arrLang_2[index] = encodedUri_2;
						arrRegistration.push(arrLang_2);
					});
					// Insert new record into task table (database) - execute ajax to server /import/insert_db
					arrExtract = JSON.stringify(arrExtract);
					arrRegistration = JSON.stringify(arrRegistration);
					insert_db("翻訳", language.toString(), arrOriginal, arrExtract, arrRegistration, filename, "wait").done(function(res) {
						$('#import-list tbody .link-extract-row img').css('display', 'none');
						$('#import-list tbody .link-regis-row img').css('display', 'none');
					});
				}
				// Insert/Update data from input file into database
				else if(action == "registration") {
					var arrTask_ext = [];
					var arrTask_reg = [];
					
					$.each(word_data, function(index, value) { 
						var arrExtract = [];
						var arrRegistration = [];
						arrExtract.push(["type","id","name","lang","value","shortname"]);
						arrRegistration.push(["type","id","name","lang","value","shortname"]);
						for(var i = 1; i < data.length; i++) {
							if(data[i][0] == "") {
								break;
							}
							// var pushArr = [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4]];	


							if(index == "en") {
								lengthText = lengthText_en;
							}
							else if(index == "zh-cn") {
								lengthText = lengthText_zh_cn;
							}
							else if(index == "zh-tw") {
								lengthText = lengthText_zh_tw;
							}
							else if(index == "zh-ko") {
								lengthText = lengthText_zh_ko;
							}


							if(data[i][5] == index && data[i][6] != "") {										// If "language" && data have translated
								
								var source_shortname = shortname(data[i][4], "ja", lengthText);
								var target_shortname = shortname(data[i][6], index, lengthText);
								arrRegistration.push([data[i][0], data[i][1], data[i][2], data[i][5], data[i][6], target_shortname]);
								var id = 0;
								for(var j = 0; j < value.length; j++) {
									if(data[i][4] == value[j]["source_word"]) {
										id = value[j]["word_id"];
										break;
									}
								}
								if(id) {
									insert_word_db(id, data[i][4], data[i][5], data[i][6], source_shortname, target_shortname).done(function() {});		// Update to database (word_library table) base on "id" - word_id
								}
								else {
									insert_word_db(0, data[i][4], data[i][5], data[i][6], source_shortname, target_shortname).done(function() {});		// Insert into database (word_library table)
								}
							}

							else {
								var id = 0;
								for(var j = 0; j < value.length; j++) {
									if(data[i][4] == value[j]["source_word"]) {
										id = value[j]["word_id"];
										break;
									}
								}
								if(id) {
									arrRegistration.push([data[i][0], data[i][1], data[i][2], value[j]["target_lang"], value[j]["target_word"], value[j]["target_shortname"]]);
								}
								else {
									var source_shortname = shortname(data[i][4], "ja", lengthText);
									// for(var k = 0; k < arrExtract.length; k++) {
									// 	console.log(pushArr);
									// 	console.log(arrExtract);
									// 	break;
									// 	if($.inArray(pushArr[4], arrExtract[k]) === -1) {
									arrExtract.push([data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], source_shortname]);
										// }
									// }
								}
							}
						}

						// console.log(arrExtract);

						// Convert array to csv format (2 tasks: extraction/registration)
						var extract_data = "";
						var registration_data = "";
						if(arrExtract.length > 1) {
							extract_data = convert_arr_to_csv(arrExtract);
							$('#import-list tbody .link-extract-row').append('<a href="' + extract_data + '" download="'+index+'_差分_'+filename+'">'+ index +':DL </a>');
						}
						else {
							extract_data = '---';
							$('#import-list tbody .link-extract-row').append('--- ');
						}
						if(arrRegistration.length > 1) {
							registration_data = convert_arr_to_csv(arrRegistration);
							$('#import-list tbody .link-regis-row').append('<a href="' + registration_data + '" download="'+index+'_置換_'+filename+'">'+ index +':DL </a>');
						}
						else {
							registration_data = '---';
							$('#import-list tbody .link-regis-row').append('--- ');
						}

						var arrLang_ext = {};
						var arrLang_reg = {};
						arrLang_ext[index] = extract_data;
						arrLang_reg[index] = registration_data;
						arrTask_ext.push(arrLang_ext);
						arrTask_reg.push(arrLang_reg);
					});

					var status = "";
					if($('#import-list tbody .link-extract-row a').length) {
						status = "doing";
						$('#import-list tbody .status-row').html('<span class="label label-warning">'+status+'</span>');
					}
					else {
						status = "done";
						$('#import-list tbody .status-row').html('<span class="label label-success">'+status+'</span>');
					}

					// Encode json
					arrTask_ext = JSON.stringify(arrTask_ext);
					arrTask_reg = JSON.stringify(arrTask_reg);
					// Insert new record into task table (database) - execute ajax to server /import/insert_db
					insert_db("翻訳", language.toString(), arrOriginal, arrTask_ext, arrTask_reg, filename, status).done(function(res) {
						$('#import-list tbody .link-extract-row img').css('display', 'none');
						$('#import-list tbody .link-regis-row img').css('display', 'none');
					});
				}
			});
		}
		else if(task == "classification") {
			$('#import-list tbody .task-row').text('カテゴリ分類');
			$('#import-list tbody .language-row').text('---');
			var poi_libraries = null;
			init_poi_db().done(function(response) {
				poi_libraries = response;
				if(action == "extract") {
					$('#import-list tbody .status-row').html('<span class="label label-danger">wait</span>');
					var arrExtract = [];
					var arrRegistration = [];
					var arrResult = [];
					var arrResult_2 = [];
					arrResult_2.push(["id", "value", "categoryid_1", "categoryid_2", "categoryid_3", "categoryid_4"]);
					for(var i = 0; i < data.length; i++) {
						var exist = false;
						for(var j = 0; j < poi_libraries.length; j++) {
							if(data[i][0] == poi_libraries[j]["shop_id"]) {
								arrResult_2.push([data[i][0], data[i][1], poi_libraries[j]["categoryid_1"], poi_libraries[j]["categoryid_2"], poi_libraries[j]["categoryid_3"], poi_libraries[j]["categoryid_4"]]);
								exist = true;
								break;
							}
						}
						if(!exist) {
			    			arrResult.push(data[i]);						// Get values different from database (does not exist in database)
			    		}
					}
					// Convert array to csv format
					encodedUri = convert_arr_to_csv(arrResult);
					encodedUri_2 = convert_arr_to_csv(arrResult_2);
					$('#import-list tbody .link-extract-row').append('<a href="' + encodedUri + '" download="差分_'+filename+'">download</a>');
					$('#import-list tbody .link-regis-row').append('<a href="' + encodedUri_2 + '" download="置換_'+filename+'">download</a>');
					arrExtract.push(encodedUri);
					arrExtract = JSON.stringify(arrExtract);
					arrRegistration.push(encodedUri_2);
					arrRegistration = JSON.stringify(arrRegistration);
					insert_db("カテゴリ分類", "---", arrOriginal, arrExtract, arrRegistration, filename, "wait").done(function(res) {
						$('#import-list tbody .link-extract-row img').css('display', 'none');
						$('#import-list tbody .link-regis-row img').css('display', 'none');
						// $('#import-list tbody .link-regis-row').text('---');
					});
				}
				else if(action == "registration") {
					var arrTask_ext = [];
					var arrTask_reg = [];
					var arrExtract = [];
					var arrRegistration = [];
					var status = "done"; 
					var color_label = "success";
					for(var i = 0; i < data.length; i++) {
						if(data[i][2] == "" && data[i][3] == "" && data[i][4] == "" && data[i][5] == "") {
							status = "doing";
							color_label = "warning";
							break;
						}
					}
					$('#import-list tbody .status-row').html('<span class="label label-'+ color_label +'">'+ status +'</span>');
					arrExtract.push(["id","value","categoryid_1","categoryid_2","categoryid_3","categoryid_4"]);
					arrRegistration.push(["id","value","categoryid_1","categoryid_2","categoryid_3","categoryid_4"]);
					for(var i = 1; i < data.length; i++) {
						if(data[i][2] == "" && data[i][3] == "" && data[i][4] == "" && data[i][5] == "") {
							var id = 0;
							for(var j = 0; j < poi_libraries.length; j++) {
								if(data[i][0] == poi_libraries[j]["shop_id"]) { 
									id = poi_libraries[j]["id"];
									break;
								}
							}
							if(id) {
								arrRegistration.push([data[i][0], data[i][1], poi_libraries[j]["categoryid_1"], poi_libraries[j]["categoryid_2"], poi_libraries[j]["categoryid_3"], poi_libraries[j]["categoryid_4"]]);
							}
							else {
								arrExtract.push(data[i]);
							}
						}
						else {
							arrRegistration.push(data[i]);
							var id = 0;
							for(var j = 0; j < poi_libraries.length; j++) {
								if(data[i][0] == poi_libraries[j]["shop_id"]) {
									id = poi_libraries[j]["id"];
								}
							}
							if(id) {
								insert_poi_db(id, data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]).done(function() {});		// Update to database (poi_libraries table) base on id
							}
							else {
								insert_poi_db(0, data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]).done(function() {});		// Insert into database (poi_libraries table)
							}
						}
					}
					var status = "";
					// Convert array to csv format (2 tasks: extraction/registration)
					var extract_data = "";
					var registration_data = "";
					if(arrExtract.length > 1) {
						status = "doing";
						$('#import-list tbody .status-row').html('<span class="label label-warning">'+status+'</span>');
						extract_data = convert_arr_to_csv(arrExtract);
						$('#import-list tbody .link-extract-row').append('<a href="' + extract_data + '" download="差分_' + filename + '">download</a>');
					}
					else {
						status = "done";
						$('#import-list tbody .status-row').html('<span class="label label-success">'+status+'</span>');
						extract_data = "---";
						$('#import-list tbody .link-extract-row').text('---');
					}
					if(arrRegistration.length > 1) {
						registration_data = convert_arr_to_csv(arrRegistration);
						$('#import-list tbody .link-regis-row').append('<a href="' + registration_data + '" download="置換_' + filename + '">download</a>');
					}
					else {
						registration_data = "---";
						$('#import-list tbody .link-regis-row').text('---');
					}
					arrTask_ext.push(extract_data);
					arrTask_reg.push(registration_data);
					arrTask_ext = JSON.stringify(arrTask_ext);
					arrTask_reg = JSON.stringify(arrTask_reg);
					// Insert new record into task table (database) - execute ajax to server /import/insert_db
					insert_db("カテゴリ分類", "---", arrOriginal, arrTask_ext, arrTask_reg, filename, status).done(function(res) {
						$('#import-list tbody .link-extract-row img').css('display', 'none');
						$('#import-list tbody .link-regis-row img').css('display', 'none');
					});
				}
			});
		}
	}
});