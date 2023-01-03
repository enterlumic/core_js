var Dashboard = {

    init: function() {
        Dashboard.cron_reporte();
        Dashboard.fn_login();
    },

    cron_reporte: function() {
        $.ajax({
            url:"cron_reporte",
            cache: false,
            contentType: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {
                    try {
                        var json   = JSON.parse(data);
                    } catch (e) {
                        console.log(data);
                    }

                    let info='';
                    $(json).each(function(i, j){
                        info += '   <tr>\
                                        <td style="width: 50px;">\
                                            <div class="font-size-22 text-primary">\
                                                <i class="bx bx-timer"></i>\
                                            </div>\
                                        </td>\
                                        <td>\
                                            <div>\
                                                <h5 class="font-size-14 mb-1">'+j['vc_info']+'</h5>\
                                                <p class="text-muted mb-0">'+j['created_at']+'</p>\
                                            </div>\
                                        </td>\
                                    <tr>';
                    });

                    $('#div-cron-reporte').html(info);

                },
                error: function(response)
                {
                    console.log("response", response);
                }
        });        
    },

    fn_login: function() {
        $.ajax({
            url:"_login",
            cache: false,
            contentType: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {
                    try {
                        var json   = JSON.parse(data);
                    } catch (e) {
                        console.log(data);
                    }

                    let info='';
                    $(json).each(function(i, j){
                        info += '   <tr>\
                                        <td>'+j['created_at']+'</td>\
                                        <td>'+j['email']+'</td>\
                                        <td>'+j['total']+'</td>\
                                    <tr>';
                    });
                    $('#tb-datatable-login').html(info);
                },
                error: function(response)
                {
                    console.log("response", response);
                }
        });        
    },
};

Dashboard.init();