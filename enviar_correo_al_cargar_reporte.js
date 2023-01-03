var Enviar_correo_al_cargar_reporte = {

    init: function () {

        // Funciones principales
        Enviar_correo_al_cargar_reporte.set_Enviar_correo_al_cargar_reporte();
        Enviar_correo_al_cargar_reporte.datatable_Enviar_correo_al_cargar_reporte();
      // Enviar_correo_al_cargar_reporte.importar_excel_Enviar_correo_al_cargar_reporte();
        Enviar_correo_al_cargar_reporte.catalogos();

        // Funciones para eventos
        Enviar_correo_al_cargar_reporte.modalShow();
        Enviar_correo_al_cargar_reporte.modalHide();
        Enviar_correo_al_cargar_reporte.AgregarNuevo();
        Enviar_correo_al_cargar_reporte.actualizarTabla();
        Enviar_correo_al_cargar_reporte.truncateEnviar_correo_al_cargar_reporte();

    },

    datatable_Enviar_correo_al_cargar_reporte: function () {
        var table = $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable({
            "stateSave": false,
            "responsive": true,
            "serverSide": false,
            "pageLength": 50,
            "scrollCollapse": true,
            "lengthMenu": [10, 25, 50, 75, 100],
            "ajax": {
                "url": "get_enviar_correo_al_cargar_reporte_by_datatable",
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
                    "targets": 5,
                    "visible": false,
                },
                {
                    "targets": 6,
                    "visible": false,
                },
                {
                    "targets": 7,
                    "visible": false,
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
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-success fs-20 update-enviar_correo_al_cargar_reporte"><i class="ri-edit-2-line"></i></a>\
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-danger fs-20 delete-enviar_correo_al_cargar_reporte" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Delete">\
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

        $('#tb-datatable-enviar_correo_al_cargar_reporte tbody').on('click', '.delete-enviar_correo_al_cargar_reporte', function () {

            document.getElementById("form_enviar_correo_al_cargar_reporte").reset();
            $("label.error").hide();
            $(".error").removeClass("error");

            var id = this.id;

            let element_by_id= 'form_enviar_correo_al_cargar_reporte';
            let message=  'Eliminando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $.ajax({
                url:"delete_enviar_correo_al_cargar_reporte",
                data: {"id": id},
                cache: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                    success: function(response)
                    {
                        console.log("response", response);

                        $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();
                        $('#modalFormIUEnviar_correo_al_cargar_reporte').modal('hide');
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
                                            url:"undo_delete_enviar_correo_al_cargar_reporte",
                                            data: {"id" : id},
                                            cache: false,
                                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                                            type: 'POST',
                                                success: function(response)
                                                {
                                                    n.close();
                                                    $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();

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

        $('#tb-datatable-enviar_correo_al_cargar_reporte tbody').on('click', '.update-enviar_correo_al_cargar_reporte', function () {
            // Abrir modal!
            $('#modalFormIUEnviar_correo_al_cargar_reporte').modal('show');

            var id = this.id;
            document.getElementById("form_enviar_correo_al_cargar_reporte").reset();

            if ($("#id").length)
            {
                $("#id").remove();
            }

            $("#form_enviar_correo_al_cargar_reporte").prepend('<input type="hidden" name="id" id="id" value=" '+ id +' ">');

            $("#modalFormIUEnviar_correo_al_cargar_reporte .modal-title").html("Editar enviar_correo_al_cargar_reporte");

            let element_by_id= 'form_enviar_correo_al_cargar_reporte';
            let message=  'Cargando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $.ajax({
                url:"get_enviar_correo_al_cargar_reporte_by_id",
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

    set_Enviar_correo_al_cargar_reporte: function () {
        $("#form_enviar_correo_al_cargar_reporte").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_enviar_correo_al_cargar_reporte");
                var postData = new FormData(get_form);

                let element_by_id= 'form_enviar_correo_al_cargar_reporte';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_enviar_correo_al_cargar_reporte",
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
                            $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();
                            document.getElementById("form_enviar_correo_al_cargar_reporte").reset();
                            $('#modalFormIUEnviar_correo_al_cargar_reporte').modal('hide');
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
              vc_correo: {
                required: true
              }
            }
            , messages: {
                vc_correo: {
                    minlength: "Mensaje personalizado vc_correo"
                }
              }
        });
    },


    modalShow: function () {
        $('#modalFormIUEnviar_correo_al_cargar_reporte').on('shown.bs.modal', function (e) {
            $('#vc_correo', e.target).focus();
        });

        $('#modalImportFormEnviar_correo_al_cargar_reporte').on('shown.bs.modal', function (e) {
            $('#vc_importar', e.target).focus();
        });
    },

    modalHide: function () {
        $('#modalFormIUEnviar_correo_al_cargar_reporte').on('hidden.bs.modal', function (e) {
            var validator = $("#form_enviar_correo_al_cargar_reporte").validate();
            validator.resetForm();
            $("label.error").hide();
            $(".error").removeClass("error");
            
            if ($("#id").length)
            {
                $("#id").remove();
            }
            document.getElementById("form_enviar_correo_al_cargar_reporte").reset();
        });
    },

    AgregarNuevo: function () {
        $(document).on("click", "#add_new_enviar_correo_al_cargar_reporte", function () {
            document.getElementById("form_enviar_correo_al_cargar_reporte").reset();            
            $("#modalFormIUEnviar_correo_al_cargar_reporte .modal-title").html("Nuevo Enviar_correo_al_cargar_reporte");
        });
    },

    actualizarTabla: function () {
        $(document).on("click", "#refresh_Enviar_correo_al_cargar_reporte", function () {

            let element_by_id= 'tb-datatable-enviar_correo_al_cargar_reporte';
            let message=  'Actualizando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();
            setTimeout(() => {
                console.log("World!");
                $loading.waitMe('hide');
            }, 1000);

        });
    },

    truncateEnviar_correo_al_cargar_reporte: function () {
        $(document).on("click", "#truncate_Enviar_correo_al_cargar_reporte", function () {
            $.ajax({
                url:"truncate_enviar_correo_al_cargar_reporte",
                cache: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                    success: function(response)
                    {
                        $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();
                    },
                    error: function(response)
                    {

                    }
            });
        });
    },

    importar_excel_Enviar_correo_al_cargar_reporte: function() {

        // define the form and the file input
        var $form = $('#FormImportarEnviar_correo_al_cargar_reporte');

        // enable fileuploader plugin
        $form.find('input:file').fileuploader({
            addMore: true,
            changeInput: '<div class="fileuploader-input">' +
                '<div class="fileuploader-input-inner">' +
                '<div>${captions.feedback} ${captions.or} <span>${captions.button}</span></div>' +
                '</div>' +
                '</div>',
            theme: 'dropin',
            upload: true,
            enableApi: true,
            onSelect: function(item) {
                item.upload = null;
                $(".btn-importar").removeClass('btn-disabled disabled');
                $(".btn-importar").removeAttr('disabled');            
            },
            onRemove: function(item) {
                if (item.data.uploaded)
                    $.post('files/assets/js/lumic/fileuploader-2.2/examples/drag-drop-form/php/ajax_remove_file_enviar_correo_al_cargar_reporte.php', {
                        file: item.name
                    }, function(data) {
                        // if (data)
                            // $(".text-success").html("");
                    });
            },
            captions: $.extend(true, {}, $.fn.fileuploader.languages['en'], {
                feedback: 'Arrastra y suelta aquí',
                or: 'ó <br>',
                button: 'Buscar archivo'
            })
          });

        // form submit
        $form.on('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(),
                _fileuploaderFields = [];

            // append inputs to FormData
            $.each($form.serializeArray(), function(key, field) {
                formData.append(field.name, field.value);
            });
            // append file inputs to FormData
            $.each($form.find("input:file"), function(index, input) {
                var $input = $(input),
                    name = $input.attr('name'),
                    files = $input.prop('files'),
                    api = $.fileuploader.getInstance($input);


                // add fileuploader files to the formdata
                if (api) {
                    if ($.inArray(name, _fileuploaderFields) > -1)
                        return;
                    files = api.getChoosedFiles();
                    _fileuploaderFields.push($input);
                }

                for (var i = 0; i < files.length; i++) {
                    formData.append(name, (files[i].file ? files[i].file : files[i]), (files[i].name ? files[i].name : false));
                }
            });

            $.ajax({
                url: $form.attr('action') || '#',
                data: formData,
                type: $form.attr('method') || 'POST',
                enctype: $form.attr('enctype') || 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $form.find('.form-status').html('<div class="progressbar-holder"><div class="progressbar"></div></div>');
                    $form.find('input[type="submit"]').attr('disabled', 'disabled');
                },
                xhr: function() {
                    var xhr = $.ajaxSettings.xhr();

                    if (xhr.upload) {
                        xhr.upload.addEventListener("progress", this.progress, false);
                    }

                    return xhr;
                },
                success: function(result, textStatus, jqXHR) {
                    // update input values
                    try {
                        var data = JSON.parse(result);

                        for (var key in data) {
                            var field = data[key],
                                api;

                            // if fileuploader input
                            if (field.files) {
                                var input = _fileuploaderFields.filter(function(element) {
                                        return key == element.attr('name').replace('[]', '');
                                    }).shift(),
                                    api = input ? $.fileuploader.getInstance(input) : null;

                                if (field.hasWarnings) {
                                    for (var warning in field.warnings) {
                                        alert(field.warnings[warning]);
                                    }

                                    return this.error ? this.error(jqXHR, textStatus, field.warnings) : null;
                                }

                                if (api) {
                                    // update the fileuploader's file names
                                    for (var i = 0; i < field.files.length; i++) {
                                        $.each(api.getChoosedFiles(), function(index, item) {
                                            if (field.files[i].old_name == item.name) {
                                                item.name = field.files[i].name;
                                                item.html.find('.column-title > div:first-child').text(field.files[i].name).attr('title', field.files[0].name);
                                            }
                                            item.data.uploaded = true;
                                        });
                                    }

                                    api.updateFileList();
                                }
                            } else {
                                $form.find('[name="' + key + '"]:input').val(field);
                            }
                        }
                    } catch (e) {}

                    $form.find('input[type="submit"]').removeAttr('disabled');

                    $("#modal_form_importar").modal("hide");
                    $('#modal_importar_success').modal({
                        show : true,
                        backdrop: 'static',
                        keyboard: false
                    });

                    let path= data['files']['files'][0]['file'];
                    $.post( "enviar_correo_al_cargar_reporte/importar_enviar_correo_al_cargar_reporte", {"path": path} ,function( data )
                    {
                        console.log(data);
                    });

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $form.find('.form-status').html('<p class="text-error">Error!</p>');
                    $form.find('input[type="submit"]').removeAttr('disabled');
                    $(".btn-importar").removeClass('btn-disabled disabled');
                    $(".btn-importar").removeAttr('disabled');                     
                },
                progress: function(e) {
                    if (e.lengthComputable) {
                        var t = Math.round(e.loaded * 100 / e.total).toString();

                        $form.find('.form-status .progressbar').css('width', t + '%');
                    }
                }
            });
        });
    },



    importar_excel_Enviar_correo_al_cargar_reporte: function() {

        // define the form and the file input
        var $form = $('#FormImportarEnviar_correo_al_cargar_reporte');

        // enable fileuploader plugin
        $form.find('input:file').fileuploader({
            addMore: true,
            changeInput: '<div class="text-center" style="cursor: pointer;">' +
                '<div class="fileuploader-input-inner">' +
                '<div>${captions.feedback} ${captions.or} <span>${captions.button}</span></div>' +
                '</div>' +
                '</div>',
            theme: 'dropin',
            upload: true,
            enableApi: true,
            onSelect: function(item) {
                item.upload = null;
                $(".btn-importar").removeClass('btn-disabled disabled');
                $(".btn-importar").removeAttr('disabled');            
            },
            onRemove: function(item) {
                if (item.data.uploaded)
                    $.post('ajax_remove_file_enviar_correo_al_cargar_reporte.php', {
                        file: item.name
                    }, function(data) {
                        // if (data)
                            // $(".text-success").html("");
                    });
            },
            captions: $.extend(true, {}, $.fn.fileuploader.languages['en'], {
                feedback: 'Arrastra y suelta aquí',
                or: 'ó <br>',
                button: 'Buscar archivo'
            })
          });

        // form submit
        $form.on('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(),
                _fileuploaderFields = [];

            // append inputs to FormData
            $.each($form.serializeArray(), function(key, field) {
                formData.append(field.name, field.value);
            });
            // append file inputs to FormData
            $.each($form.find("input:file"), function(index, input) {
                var $input = $(input),
                    name = $input.attr('name'),
                    files = $input.prop('files'),
                    api = $.fileuploader.getInstance($input);


                // add fileuploader files to the formdata
                if (api) {
                    if ($.inArray(name, _fileuploaderFields) > -1)
                        return;
                    files = api.getChoosedFiles();
                    _fileuploaderFields.push($input);
                }

                for (var i = 0; i < files.length; i++) {
                    formData.append(name, (files[i].file ? files[i].file : files[i]), (files[i].name ? files[i].name : false));
                }
            });


            let element_by_id= 'FormImportarEnviar_correo_al_cargar_reporte';
            let message=  'Importando archivo...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $.ajax({
                url: $form.attr('action') || '#',
                data: formData,
                type: $form.attr('method') || 'POST',
                enctype: $form.attr('enctype') || 'multipart/form-data',
                cache: false,
                contentType: false,
                processData: false,
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                beforeSend: function() {
                    $form.find('.form-status').html('<div class="progressbar-holder"><div class="progressbar"></div></div>');
                    $form.find('input[type="submit"]').attr('disabled', 'disabled');
                },
                xhr: function() {
                    var xhr = $.ajaxSettings.xhr();

                    if (xhr.upload) {
                        xhr.upload.addEventListener("progress", this.progress, false);
                    }

                    return xhr;
                },
                success: function(result, textStatus, jqXHR) {
                    // update input values
                    try {
                        var data = JSON.parse(result);

                        if (data['b_status'] == false){
                            Swal.fire({
                                position : "top-end",
                                icon : "error",
                                title : data['data']['vc_message'],
                                showConfirmButton : false,
                                timer : 1500
                            });
                        }

                        for (var key in data) {
                            var field = data[key],
                                api;

                            // if fileuploader input
                            if (field.files) {
                                var input = _fileuploaderFields.filter(function(element) {
                                        return key == element.attr('name').replace('[]', '');
                                    }).shift(),
                                    api = input ? $.fileuploader.getInstance(input) : null;

                                if (field.hasWarnings) {
                                    for (var warning in field.warnings) {
                                        alert(field.warnings[warning]);
                                    }

                                    return this.error ? this.error(jqXHR, textStatus, field.warnings) : null;
                                }

                                if (api) {
                                    // update the fileuploader's file names
                                    for (var i = 0; i < field.files.length; i++) {
                                        $.each(api.getChoosedFiles(), function(index, item) {
                                            if (field.files[i].old_name == item.name) {
                                                item.name = field.files[i].name;
                                                item.html.find('.column-title > div:first-child').text(field.files[i].name).attr('title', field.files[0].name);
                                            }
                                            item.data.uploaded = true;
                                        });
                                    }

                                    api.updateFileList();
                                }
                            } else {
                                $form.find('[name="' + key + '"]:input').val(field);
                            }
                        }
                    } catch (e) {}

                    $form.find('input[type="submit"]').removeAttr('disabled');

                    $loading.waitMe('hide');

                    $("#modalImportFormEnviar_correo_al_cargar_reporte").modal("hide");
                    $('#tb-datatable-enviar_correo_al_cargar_reporte').DataTable().ajax.reload();

                    document.getElementById("FormImportarEnviar_correo_al_cargar_reporte").reset();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $form.find('.form-status').html('<p class="text-error">Error!</p>');
                    $form.find('input[type="submit"]').removeAttr('disabled');
                    $(".btn-importar").removeClass('btn-disabled disabled');
                    $(".btn-importar").removeAttr('disabled');                     
                    $loading.waitMe('hide');
                },
                progress: function(e) {
                    if (e.lengthComputable) {
                        var t = Math.round(e.loaded * 100 / e.total).toString();

                        $form.find('.form-status .progressbar').css('width', t + '%');
                    }
                }
            });
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

Enviar_correo_al_cargar_reporte.init();