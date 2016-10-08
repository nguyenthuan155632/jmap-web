$(document).ready(function() {

    // The event listener for the file upload
    document.getElementById('file_input').addEventListener('change', getFile, false);
    document.getElementById('extract-button').addEventListener('click', function (e) { upload(e, false) }, false);
    document.getElementById('registration-button').addEventListener('click', function (e) { upload(e, true) }, false);

    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        	isCompatible = true;
        }
        return isCompatible;
    }

    // Get input file
    var file;
    function getFile(evt) {
    	if (!browserSupportFileUpload()) {
            $('#myModal .modal-body p').text('The File APIs are not fully supported in this browser!');
            $('#myModal').modal('show');
        } 
        else {
            file = evt.target.files[0];
        }
    }

    // Check format file (format fields)
    function is_valid_format_file(data, fields) {
        var is_valid = true;
        if(data.length != fields.length) { 
            is_valid = false;
            $('#myModal .modal-body p').text('ファイルのフォーマットは正しくありません。再度、ご確認ください。');
            $('#myModal').modal('show');
            return false;
        }
        $.each(fields, function(i, t) {
            if($.inArray(t, data) === -1) {
                is_valid = false;
                $('#myModal .modal-body p').text('ファイルのフォーマットは正しくありません。再度、ご確認ください。');
                $('#myModal').modal('show');
                return false;
            }
        });
        return is_valid;
    }

    // Method that reads and processes the selected file
    function upload(evt, isRegistration) {
		if (!browserSupportFileUpload()) {
            $('#myModal .modal-body p').text('The File APIs are not fully supported in this browser!');
            $('#myModal').modal('show');
        } 
        else if($('#file_input').val() == "") {
            $('#myModal .modal-body p').text('ご指定のファイルが見つかりません。');
            $('#myModal').modal('show');
        }    
        else {
            // Validate radio button
        	if($('input[name=task]:checked').val() === undefined) { 
                $('#myModal .modal-body p').text('Please choose task to fire!');
                $('#myModal').modal('show'); 
                return false; 
            }
            else if($('input[name=task]:checked').val() == 'translation') {
                if($('input[name=trans_lang]:checked').val() === undefined) { 
                    $('#myModal .modal-body p').text('対象言語をご指定ください。');
                    $('#myModal').modal('show');
                    return false; 
                }
            }
            // Get input checkboxes which user checked
        	var language = [];
        	$('input[name=trans_lang]:checked').each(function(){
			    language.push(this.value);
			});
        	var data = null;
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                // data = $.csv.toArrays(csvData);           // Convert csv file to array
                data = Papa.parse(csvData)["data"];
                console.log(data);
                if (data && data.length > 0) {
                    // Translation task
                	if($('input[name=task]:checked').val() == "translation") {
                        localStorage.setItem('_task', 'translation');
                        // Registration action
                        if(isRegistration) {
                            var arrField = ["type", "id", "name", "src-lang", "src-value", "tgt-lang", "tgt-value"];
                            localStorage.setItem('_action', 'registration');
                            localStorage.setItem('_lengthText_en', $('input[name=text_length_en]').val());
                            localStorage.setItem('_lengthText_zh_cn', $('input[name=text_length_zh_cn]').val());
                            localStorage.setItem('_lengthText_zh_tw', $('input[name=text_length_zh_tw]').val());
                            localStorage.setItem('_lengthText_zh_ko', $('input[name=text_length_zh_ko]').val());
                            if(!is_valid_format_file(data[0], arrField)) { return false; }
                        }
                        // Extraction action
                        else {
                            var arrField = ["type", "id", "name", "lang", "value"];
                            localStorage.setItem('_action', 'extract');
                            if(!is_valid_format_file(data[0], arrField)) { return false; }
                        }
                    }
                    // Category Classification task 
                    else if($('input[name=task]:checked').val() == "classification") { 
                        localStorage.setItem('_task', 'classification');
                        // Registration action
                        if(isRegistration) {
                            var arrField = ["id", "value", "categoryid_1", "categoryid_2", "categoryid_3", "categoryid_4"];
                            localStorage.setItem('_action', 'registration');
                            if(!is_valid_format_file(data[0], arrField)) { return false; }
                        }
                        // Extraction action
                        else {
                            var arrField = ["id", "value"];
                            localStorage.setItem('_action', 'extract');
                            if(!is_valid_format_file(data[0], arrField)) { console.log(arrField); return false; }
                        }
                    }
                    // Set local storage variable to get it in another page
                    localStorage.setItem('_data', JSON.stringify(data));
                    localStorage.setItem('_language', JSON.stringify(language));
                    localStorage.setItem('_filename', JSON.stringify(file.name));
                    window.location.href = "http://" + window.location.hostname + "/import/list";       // redirect to List page
				}
			}
		}
	}
});

