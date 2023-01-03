var Cortes_por_hora = {

    init: function () {

        // Funciones principales
        Cortes_por_hora.set_Cortes_por_hora();
        Cortes_por_hora.set_import_Cortes_por_hora();
        Cortes_por_hora.datatable_Cortes_por_hora(rango_fecha='');

        // Funciones para eventos
        Cortes_por_hora.modalShow();
        Cortes_por_hora.modalHide();
        Cortes_por_hora.AgregarNuevo();
        Cortes_por_hora.actualizarTabla();
        Cortes_por_hora.truncateCortes_por_hora();
    },

    datatable_Cortes_por_hora: function (rango_fecha) {

        let element_by_id= 'div-fechas';
        let message=  'Actualizando...' ;
        let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

        $.ajax({
            url:"get_cortes_por_hora_by_datatable",
            data: {rango_fecha: rango_fecha},            
            cache: false,
            contentType: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {
                    try {
                        var result = JSON.stringify(result);
                        var json   = JSON.parse(data);
                    } catch (e) {
                        console.log(data);
                    }
                    $loading.waitMe('hide');

                    $("#div-fechas").html( "" );

                    let sales='';
                    let fecha='';
                    let _html='';

                    const v_hrs = ['&#186', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', 'TOTAL', 'HRS', 'SPH'];

                    let txt = "";
                    _html +='<div class="col-1">';
                    for (let x in v_hrs) {
                        _html+= '<div class="d-flex justify-content-center border border-dark border-opacity-25">\
                                    <div class="ms-2 text-muted d-flex">'+v_hrs[x]+'</div>\
                                </div>';
                    }
                    _html +='</div>';
                    $("#div-fechas").append(_html);

                    _html='';

                    $("#div-fechas").append(_html);
                        _html+= '<div class="col-1 border border-dark border-opacity-25" style="background-color:#90d14f !important; width: 3%;  padding: 160px 0; text-align: center;">\
                                    R4\
                                </div>';
                    $("#div-fechas").append(_html);


                    _html='';

                    $.each(json['data'], function(i, item) {
                        fecha= item['fecha'];
                        id_fecha= fecha.replaceAll(" ", "_");
                        _html=  '<div class="col-1">\
                                        <p class="text-muted text-truncate mb-0 border border-dark border-opacity-25" style="text-align:center">'+fecha+'</p>\
                                        <div id="'+id_fecha+'" >   </div>\
                                </div>';
                        $("#div-fechas").append(_html);
                    });

                    $.each(json['data'], function(i, valor) {
                        id_fecha= valor['fecha'].replaceAll(" ", "_");
                        let total= valor['datos'].length - 1;

                        $.each(valor['datos'], function(_i, _item) {
                            let id_hrs;
                            if(total == _i){
                                id_hrs= 'id="'+id_fecha+'"';

                                $("#"+id_fecha).after( '<div id="v_hrs_'+id_fecha+'" class="d-flex justify-content-center border border-dark border-opacity-25">\
                                                            <div class="ms-2 text-muted d-flex">'+valor['v_hrs']+'</div>\
                                                        </div>' );

                                $("#v_hrs_"+id_fecha).after('<div id="v_total_'+id_fecha+'" class="d-flex justify-content-center border border-dark border-opacity-25">\
                                                                <div class="ms-2 text-muted d-flex">'+valor['v_total_hrs']+'</div>\
                                                            </div>' );

                                $("#v_total_"+id_fecha).after( '<div class="d-flex justify-content-center border border-dark border-opacity-25">\
                                                                    <div class="ms-2 text-muted d-flex">'+valor['sph']+'</div>\
                                                                </div>' );
                            }else{
                                id_hrs= '';
                            }

                            sales= _item['sales'];
                            _html= '<div class="d-flex justify-content-center border border-dark border-opacity-25" '+id_hrs+'>\
                                        <span class="badge badge-soft-success font-size-12 d-none"> '+ _item['interval_hour'] +' </span>\
                                        <div class="ms-2 text-muted d-flex">'+sales+'</div>\
                                    </div>';
                            $("#"+id_fecha).append(_html);
                        });

                        if (total < 12){
                            let falta= 12 - total;
                            for (var i =0; i < falta; i++) {
                                $("#"+id_fecha).after( '<div class="d-flex justify-content-center border border-dark border-opacity-25">\
                                                            <div class="ms-2 text-muted d-flex">-</div>\
                                                        </div>' );
                            }
                        }

                    });


                },
                error: function(response)
                {
                    console.log("response", response);
                }
        });

    },

    set_Cortes_por_hora: function () {
        $("#form_cortes_por_hora").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_cortes_por_hora");
                var postData = new FormData(get_form);

                let element_by_id= 'form_cortes_por_hora';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_cortes_por_hora",
                    data: postData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'POST',
                    success: function (response) {
                        
                        console.log("response", response);

                        $loading.waitMe('hide');

                        try {
                            var json = JSON.parse(response);
                        } catch (e) {
                            alert(response);
                            return;
                        }

                        if (json["b_status"]) {
                            $('#tb-datatable-cortes_por_hora').DataTable().ajax.reload();
                            document.getElementById("form_cortes_por_hora").reset();
                            $('#modalFormIUCortes_por_hora').modal('hide');
                        } else {
                            alert(json);
                        }
                    },
                    error: function (response) {
                        $loading.waitMe('hide');
                        alert(response);
                    }
                });
            }
            , rules: {
              event_date: {
                required: true
              }
            }
            , messages: {
                event_date: {
                    minlength: "Mensaje personalizado event_date"
                }
              }
        });
    },

    set_import_Cortes_por_hora: function () {
        $("#form_import_cortes_por_hora").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_import_cortes_por_hora");
                var postData = new FormData(get_form);

                let element_by_id= 'form_import_cortes_por_hora';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_import_cortes_por_hora",
                    data: postData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'POST',
                    success: function (response) {
                        
                        console.log("response", response);

                        $loading.waitMe('hide');

                        try {
                            var json = JSON.parse(response);
                        } catch (e) {
                            alert(response);
                            return;
                        }

                        if (json["b_status"]) {
                            $('#tb-datatable-cortes_por_hora').DataTable().ajax.reload();
                            document.getElementById("form_import_cortes_por_hora").reset();
                            $('#modalImportFormCortes_por_hora').modal('hide');
                        } else {
                            alert(json);
                        }
                    },
                    error: function (response) {
                        $loading.waitMe('hide');
                        alert(response);
                    }
                });
            }
            , rules: {
              event_date: {
                required: true
              }
            }
            , messages: {
                event_date: {
                    minlength: "Mensaje personalizado event_date"
                }
              }
        });
    },

    modalShow: function () {
        $('#modalFormIUCortes_por_hora').on('shown.bs.modal', function (e) {
            $('#event_date', e.target).focus();
        });

        $('#modalImportFormCortes_por_hora').on('shown.bs.modal', function (e) {
            $('#vc_importar', e.target).focus();
        });
    },

    modalHide: function () {
        $('#modalFormIUCortes_por_hora').on('hidden.bs.modal', function (e) {
            var validator = $("#form_cortes_por_hora").validate();
            validator.resetForm();
            $("label.error").hide();
            $(".error").removeClass("error");
            
            if ($("#id").length)
            {
                $("#id").remove();
            }
            document.getElementById("form_cortes_por_hora").reset();
            document.getElementById("form_import_cortes_por_hora").reset();
        });
    },

    AgregarNuevo: function () {
        $(document).on("click", "#add_new_cortes_por_hora", function () {
            document.getElementById("form_cortes_por_hora").reset();            
            $("#modalFormIUCortes_por_hora .modal-title").html("Nuevo Cortes_por_hora");
        });
    },

    actualizarTabla: function () {
        $(document).on("click", "#refresh_Cortes_por_hora", function () {

            $('#tb-datatable-cortes_por_hora').DataTable().ajax.reload();

        });
    },

    truncateCortes_por_hora: function () {
        $(document).on("click", "#truncate_Cortes_por_hora", function () {
            $.ajax({
                url:"truncate_cortes_por_hora",
                cache: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                    success: function(response)
                    {
                        $('#tb-datatable-cortes_por_hora').DataTable().ajax.reload();
                    },
                    error: function(response)
                    {

                    }
            });
        });
    },

};

Cortes_por_hora.init();