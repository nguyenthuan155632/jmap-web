const ERROR_MESSAGE_01 = 1
const ERROR_MESSAGE_02 = 2;
const ERROR_MESSAGE_03 = 3;
var ERROR_MESSAGE_JA = ["検索結果0件でした。",
                        "検索エラーです。",
                        "位置情報の利用を許可してから、ご利用ください。"];
var ERROR_MESSAGE_EN = ["検索結果0件でした。",
                        "検索エラーです。",
                        "位置情報の利用を許可してから、ご利用ください。"];

var ERROR_MESSAGE_CN = ["検索結果0件でした。",
                        "検索エラーです。",
                        "位置情報の利用を許可してから、ご利用ください。"];

var ERROR_MESSAGE_TW = ["検索結果0件でした。",
                        "検索エラーです。",
                        "位置情報の利用を許可してから、ご利用ください。"];

// Get and show error message
var showErorMessage = function(index) {
    var message = getErorMessage(index - 1);
    alert(message);
};
// Get error message
var getErorMessage = function(index) {
    var ret = ERROR_MESSAGE_JA[index];
    var lang = browserLanguage();
    if (lang == "en") {
        ret=  ERROR_MESSAGE_EN[index];
    } else if (lang == "zh-cn") {
        ret=  ERROR_MESSAGE_CN[index];
    } else if (lang == "zh-tw") {
        ret=  ERROR_MESSAGE_TW[index];
    }
    return ret;
};



