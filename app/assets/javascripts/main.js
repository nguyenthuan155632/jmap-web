$(document).ready(function() {
    var currentURL = window.location.pathname;
    $(".navbar-nav li").removeClass("active");
    $(".navbar-nav li a[href='" + currentURL + "']").parent().addClass("active");
});

$(document).ready(function() {

    function archiveAjax(id, isAdd) {
        var defer = $.Deferred();
        var data = {
            id: id,
            authenticity_token: window._token
        };

        if (isAdd) {
            url = "http://" + window.location.hostname + "/archive";
        } else {
            url = "http://" + window.location.hostname + "/restore"
        }

        $.ajax({
            type: "post",
            url: url,
            contentType: 'application/x-www-form-urlencoded;json',
            dataType: "json",
            data: $.param(data),
            success: function(data) {
                defer.resolve(data);
            },
            error: function(xhr, textStatus, errorThrown) {
                defer.reject();
            }
        });
        return defer.promise();
    }

    $('#mapList').on('click', '.archive_btn', function() {
        var id = $(this).data("id");
        archiveAjax(id, true).done(function(response) {
            location.reload(true);
        });
    });

    $('#mapList').on('click', '.restore_btn', function() {
        var id = $(this).data("id");
        archiveAjax(id, false).done(function(response) {
            location.reload(true);
        });
    });


    $('input[name=isArchive]').change(function() {
        window.location.href = "?archive=" + $(this).val();
    });

});