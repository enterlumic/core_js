var Sql_server = {

    init: function () {

        // Funciones principales
        Sql_server.set_Sql_server();
        Sql_server.set_import_Sql_server();
        Sql_server.datatable_Sql_server();
        Sql_server.catalogos();

        // Funciones para eventos
        Sql_server.modalShow();
        Sql_server.modalHide();
        Sql_server.AgregarNuevo();
        Sql_server.actualizarTabla();
    },

    datatable_Sql_server: function () {
        var table = $('#tb-datatable-sql_server').DataTable({
            "stateSave": false,
            "responsive": true,
            "serverSide": false,
            "pageLength": 50,
            "scrollCollapse": true,
            "lengthMenu": [10, 25, 50, 75, 100],
            "ajax": {
                "url": "get_sql_server_by_datatable",
                "type": "GET",
                "data": {
                    "extra": 1
                },
                "headers": {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            },
            "processing": true,
            "language": {
                "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Cargando...</span>',
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": '<div class="text-center">\
                                                    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#25a0e2,secondary:#00bd9d" style="width:75px;height:75px">\
                                                    </lord-icon>\
                                                    <h5 class="mt-2">Sin resultados</h5>\
                                                    <p class="text-muted mb-0">Hemos buscado en más de 50 Registros No encontramos ningún registro para su búsqueda.</p>\
                                                </div>',
                "sEmptyTable": "Ningún registro disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": '<div class="spinner-border text-primary avatar-sm" role="status">\
                                        <span class="visually-hidden">Loading...</span>\
                                    </div>',
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
            // guarda el estado de la tabla (paginación, filtrado, etc.)
            ,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
            },
            stateLoadCallback: function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
            },
            fnDrawCallback: function( oSettings ) {

            },
            "columnDefs": [{
                    "targets": 0,
                    "render": function (data, type, row, meta) {
                        var contador = meta.row + 1;
                        return contador;
                    },
                    "class": "text-center"
                },
                {
                    "targets": 8,
                    "visible": false,
                },
                {
                    "targets": 9,
                    "visible": false,
                },
                {
                    "targets": 10,
                    "visible": false,
                },
                {
                    "targets": 11,
                    "render": function (data, type, row, meta) {
                        return '<div>\
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-success fs-20 update-sql_server"><i class="ri-edit-2-line"></i></a>\
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-danger fs-20 delete-sql_server" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Delete">\
                                    <i class="ri-delete-bin-line"></i>\
                                </a>\
                            </div>';
                    },
                    "class": "text-center"
                }
            ]
        });

        // setInterval( function () {
        //     table.ajax.reload( null, false );
        // }, 5000 );

        $('#tb-datatable-sql_server tbody').on('click', '.delete-sql_server', function () {

            document.getElementById("form_sql_server").reset();
            $("label.error").hide();
            $(".error").removeClass("error");

            var id = this.id;

            let element_by_id= 'form_sql_server';
            let message=  'Eliminando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $.ajax({
                url:"delete_sql_server",
                data: {"id": id},
                cache: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                    success: function(response)
                    {
                        console.log("response", response);

                        $('#tb-datatable-sql_server').DataTable().ajax.reload();
                        $('#modalFormIUSql_server').modal('hide');
                        $loading.waitMe('hide');

                        var n = new Noty({
                            type: "warning",
                            close: false,
                            text: "<b>Se movio a la papelera<b>" ,
                            layout: 'topCenter',
                            timeout: 20e3,
                                buttons: [
                                  Noty.button('Deshacer', 'btn btn-success btn-sm', function () {
                                        $.ajax({
                                            url:"undo_delete_sql_server",
                                            data: {"id" : id},
                                            cache: false,
                                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                                            type: 'POST',
                                                success: function(response)
                                                {
                                                    n.close();
                                                    $('#tb-datatable-sql_server').DataTable().ajax.reload();

                                                    new Noty({
                                                        text: 'Se ha deshecho la acción.',
                                                        type: "warning",
                                                        layout: 'topCenter',
                                                        timeout: 1e3,
                                                    }).show();


                                                },
                                                error: function(response)
                                                {
                                                    alert("Ocurrio un error");
                                                }
                                        });
                                  }
                                  ,{
                                      'id'         : 'id-'+id
                                    , 'data-status': 'ok'
                                  }
                                  )
                                  , Noty.button('Cerrar', 'btn btn-error', function () {
                                        n.close();
                                    })
                                ]
                        });
                        n.show();
                    },
                    error: function(response)
                    {
                        $loading.waitMe('hide');
                    }
            });
        });

        $('#tb-datatable-sql_server tbody').on('click', '.update-sql_server', function () {
            // Abrir modal!
            $('#modalFormIUSql_server').modal('show');

            var id = this.id;
            document.getElementById("form_sql_server").reset();

            if ($("#id").length)
            {
                $("#id").remove();
            }

            $("#form_sql_server").prepend('<input type="hidden" name="id" id="id" value=" '+ id +' ">');

            $("#modalFormIUSql_server .modal-title").html("Editar sql_server");

            let element_by_id= 'form_sql_server';
            let message=  'Cargando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $.ajax({
                url:"get_sql_server_by_id",
                data: {id: id},
                cache: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                    success: function(response)
                    {
                        $loading.waitMe('hide');

                        try {
                            var result = JSON.stringify(result);
                            var json = JSON.parse(response);
                        } catch (e) {
                            console.log(response);
                        }

                        if (json["b_status"]) {
                            var p = json['data'];
                            for (var keyIni in p) {
                                for (var key in p[0]) {
                                    if (p[0].hasOwnProperty(key)) {
                                        if (p[0][key] !== "") {
                                            $("#" + key).addClass("fill");

                                            if ($("#" + key).prop('type') == "text" ||
                                                $("#" + key).prop('type') == "textarea" ||
                                                $("#" + key).prop('type') == "email" ||
                                                $("#" + key).prop('type') == "number" ||
                                                $("#" + key).prop('type') == "url" ||
                                                $("#" + key).prop('type') == "tel"
                                            ) {
                                                $("#" + key).val(p[0][key]);
                                            }

                                            if ($("#" + key).prop('type') == "file") {
                                                if (p[0][key] !== "") {
                                                    $("#" + key).attr("required", false);
                                                }

                                                if (p[0][key] !== null) {
                                                    var filename = p[0][key].replace(/^.*[\\\/]/, '')
                                                    $("#" + key).after("<a href=\"" + p[0][key] + "\" target=\"_blank\" class=\"external_link  abrir-" + key + " \"> " + filename.substr(0, 15) + " </a>");
                                                }
                                            }

                                            if ($("#" + key).prop('nodeName') == "SELECT") {
                                                console.log("key", key);
                                                $('#' + key + ' option[value="' + p[0][key] + '"]').prop('selected', true);
                                            }
                                        }
                                    }
                                }
                            }

                        } 
                        else 
                        {
                            alert("Revisar console para mas detalle");
                            console.log(json);
                        }
                    },
                    error: function(response)
                    {
                        $loading.waitMe('hide');
                    }
            });
        });
    },

    set_Sql_server: function () {
        $("#form_sql_server").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_sql_server");
                var postData = new FormData(get_form);

                let element_by_id= 'form_sql_server';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_sql_server",
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
                            $('#tb-datatable-sql_server').DataTable().ajax.reload();
                            document.getElementById("form_sql_server").reset();
                            $('#modalFormIUSql_server').modal('hide');
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
              vCampo1_sql_server: {
                required: true
              }
            }
            , messages: {
                vCampo1_sql_server: {
                    minlength: "Mensaje personalizado vCampo1_sql_server"
                }
              }
        });
    },

    set_import_Sql_server: function () {
        $("#form_import_sql_server").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_import_sql_server");
                var postData = new FormData(get_form);

                let element_by_id= 'form_import_sql_server';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_import_sql_server",
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
                            $('#tb-datatable-sql_server').DataTable().ajax.reload();
                            document.getElementById("form_import_sql_server").reset();
                            $('#modalImportFormSql_server').modal('hide');
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
              vCampo1_sql_server: {
                required: true
              }
            }
            , messages: {
                vCampo1_sql_server: {
                    minlength: "Mensaje personalizado vCampo1_sql_server"
                }
              }
        });
    },

    modalShow: function () {
        $('#modalFormIUSql_server').on('shown.bs.modal', function (e) {
            $('#vCampo1_sql_server', e.target).focus();
        });

        $('#modalImportFormSql_server').on('shown.bs.modal', function (e) {
            $('#vc_importar', e.target).focus();
        });
    },

    modalHide: function () {
        $('#modalFormIUSql_server').on('hidden.bs.modal', function (e) {
            var validator = $("#form_sql_server").validate();
            validator.resetForm();
            $("label.error").hide();
            $(".error").removeClass("error");
            
            if ($("#id").length)
            {
                $("#id").remove();
            }
            document.getElementById("form_sql_server").reset();
            document.getElementById("form_import_sql_server").reset();
        });
    },

    AgregarNuevo: function () {
        $(document).on("click", "#add_new_sql_server", function () {
            document.getElementById("form_sql_server").reset();            
            $("#modalFormIUSql_server .modal-title").html("Nuevo Sql_server");
        });
    },

    actualizarTabla: function () {
        $(document).on("click", "#refresh_Sql_server", function () {

            let element_by_id= 'tb-datatable-sql_server';
            let message=  'Actualizando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $('#tb-datatable-sql_server').DataTable().ajax.reload();
            setTimeout(() => {
                console.log("World!");
                $loading.waitMe('hide');
            }, 1000);

        });
    },

    catalogos: function(){
        // Rellenar marca
        // $.post( "cat_marcas/get_cat_marcas"
        //   , function( data )
        //       {
        //         try {
        //             var result = JSON.stringify(result);
        //             var json   = JSON.parse(data);
        //         } catch (e) {
        //             console.log(data);
        //         }
                
        //         if (json["b_status"])
        //         {
        //           $(json['data']).each(function(i, j){
        //               $("#id_cat_marcas").append("<option value="+j['id']+"> "+j['vc_nombre']+" </option>");
        //           });
        //         }

        //       }
        // );
        // Fin Rellenar marca
    },

};

Sql_server.init();