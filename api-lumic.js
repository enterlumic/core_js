var Api_by_lumic = {

    init: function(){
      $(document).on("click", "#reset-api", function(){


        $.ajax({
            url:"reset_api",
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'POST',
                success: function(response)
                {
                    $('#tb-datatable-api_by_lumic').DataTable().ajax.reload();
                }
        });

    });

    $('#modal_form_reemplazar_tema').on('hidden.bs.modal', function (e) {
        document.getElementById("vc_reemplazar_tema").value = "";
    });


    $('#modal_form_reemplazar_tema').on('shown.bs.modal', function (e) {
        $('#vc_reemplazar_tema', e.target).focus();
    });

    $('textarea').on('paste', function(event) {
        event.preventDefault();//prevent pasted text being added
        // add ID so we can clear textarea
        let text_area_id = $(this).attr('id');
        $('#' + text_area_id).val('');
        let clip = event.originalEvent.clipboardData.getData('Text');
        let final_clip = clip.replace(/\s+/g, ' ');
        let spacio= final_clip.replaceAll(' ', '\n');

        $('#' + text_area_id).val(spacio);

    });


    },

    html: function(i) {
        return "<div class='col-sm-6'>\
                    <div class='form-group fill'>\
                        <input class='form-control global_filter' type='text' data-id='" + i + "' data-tipo='Tema' data-name='\",v_vc_name,\"' id='vTema" + i + "_\", v_vc_name , \"' value='vTema" + i + "_\", v_vc_name , \"'   >\
                    </div>\
                </div>\
                <div class='col-sm-6'>\
                    <div class='form-group fill'>\
                        <input class='form-control global_filter' type='text' data-id='" + i + "' data-tipo='Campo' data-name='\",v_vc_name,\"' id='vCampo" + i + "_\", v_vc_name , \"' value='vCampo" + i + "_\", v_vc_name , \"'>\
                    </div>\
                </div>";
    },

    editor: function() {
        var valor = '';

        for (var i = 1; i <= 30; i += 1) {
            var a = Api_by_lumic.html(i);
            valor += a;
        }

        $("#campos").val(valor);

        if ($("#vc_description_update").length)
            $("#vc_description_update").Editor();

        $("#agregar-nota").click(function() {
            $("#vc_name_update").val("");
            $("#form_notes_update Editor-editor").html("");
        });

        $(document).keyup(function(e) {
            if (e.key === "Escape")
                $("#cerrar-modal").click();
        });

        $(document).on('keydown', function(e) {
            if (e.ctrlKey && e.which === 83) {
                e.preventDefault();
                return false;
            }
        });
    },

    datatable: function() {

        var table = $('#tb-datatable-api_by_lumic').DataTable({
            "sDom": "<'row'<'col-sm-6'<'dt_actions'>l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
            "stateSave": false,
            "pageLength": 50,
            "scrollCollapse": true,
            "lengthMenu": [10, 25, 50, 75, 100],
            "ajax": "get_api_by_lumic",
            "scrollY":"300px",
            "scrollX": true,
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            },
            "columnDefs": [{
                    "targets": [0],
                    "visible": true,
                    "width": "5%"
                }
                , {
                    "targets": 1,
                    "render": function(data, type, row, meta) {

                        var btn =   '<a data-toggle="modal" data-id="' + row[0] + '" href="#modal_form_update" class="fs-15 update-api_by_lumic"><i class="ri-edit-2-line"></i></a>\
                                        <a href="javascript:void(0);" id="' + row[0] + '" class="link-success fs-15 delete-api_by_lumic"><i class="ri-delete-bin-line"></i></a>';
                        return btn + row[1];
                    }
                }
                , {
                    "targets": +2,
                    "visible": false,
                    "width": "5%",
                    "defaultContent": ""
                }
            ]
        });

        $('#tb-datatable-api_by_lumic tbody').on('click', '.update-api_by_lumic', function() {
            var id = $(this).attr("data-id");

            $("#id").val(id);

            $.ajax({
                url:"api_by_id",
                data: { 'id': id },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                type: 'POST',
                success: function(response)
                {
                    $("#form_apy_by_lumic_update .Editor-editor").html(response['vc_name']);
                }
            });

        });

        $('#tb-datatable-api_by_lumic tbody').on('click', '.delete-api_by_lumic', function() {
            var id = this.id;

            $.post("delete_api_by_lumic", {
                "id": id
            }, function(data) {
                if (data) {
                    $('#tb-datatable-api_by_lumic').DataTable().ajax.reload();

                    var n = new Noty({
                        type: "warning",
                        close: false,
                        text: "<b>Se movio a la papelera<b>",
                        timeout: 5e3,
                        buttons: [
                            Noty.button('Deshacer', 'btn btn-success', function() {
                                $.post("api_by_lumic/undo_delete_api_by_lumic/", {
                                    "id": id
                                }, function(data) {
                                    if (data) {
                                        n.close();
                                        $('#tb-datatable-api_by_lumic').DataTable().ajax.reload();
                                    } else {
                                        alert("Ocurrio un error");
                                    }
                                });
                            }, {
                                id: 'id-' + id,
                                'data-status': 'ok'
                            }), Noty.button('Cerrar', 'btn btn-error', function() {
                                n.close();
                            })
                        ]
                    });
                    n.show();
                } else {
                    alert("Ocurrio un error");
                }
            });
        });
    },

    update_api_by_lumic: function() {

        $("#form_apy_by_lumic_update").validate({
            submitHandler: function(form) {

                var id = $("#id").val();
                var vc_description_update = $("#form_apy_by_lumic_update .Editor-editor").html();

                if (id > 0) {
                    $.ajax({
                        url:"set_update_api_by_lumic",
                        data: {"id": id, "vc_description_update": vc_description_update },
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        type: 'POST',
                        success: function(response)
                        {
                            $('#tb-datatable-api_by_lumic').DataTable().ajax.reload();
                            $("#form_apy_by_lumic_update .close").click();
                        }
                    });
                } else {
                    alert("Es posible que la nota ya no existe, favor de revisar");
                }
            }
        });
    },

    descargarArchivoApi: function(proyecto, text, fileType, fileName, mySQL) {

        $("#find_replace").addClass("disabled").text("Cambiando...");

        $("#text-ssh-" + fileName).html("");
        var attr;
        $('#' + text + ' input').each(
            function(index) {
                var input = $(this);
                var data = typeof input.attr('data-grep') !== 'undefined' ? input.attr('data-grep') : "";
                index = index + 1;
                $("#text-ssh-" + fileName).append(data);
            }
        );

        $.ajax({
            url:"guardar_sh",
            data: {"fileName": fileName, "textSSH": "cd /var/www/html/" + proyecto + " \n" + $("#text-ssh-" + fileName).html() + "\n" + mySQL },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'POST',
            success: function(response)
            {
                $("#find_replace").removeClass("disabled").text("Cambiar");
                $(this).removeClass("disabled");
                var n = new Noty({
                    type: "success",
                    close: false,
                    text: "<b>Se modificaron los campos<b>",
                    timeout: 10e2,
                    buttons: [
                        Noty.button('Cerrar', 'btn btn-warning', function() {
                            n.close();
                        })
                    ]
                });
                n.show();                
            }
        });

    },

    EliminarProyecto: function(proyecto, fileName, fileName2) {
        $.ajax({
            url:"eliminar_proyecto",
            data: {"proyecto": proyecto, "fileName": fileName, "fileName2": fileName2 },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'POST',
            success: function(data)
            {
                Api_by_lumic.notify(data, 'inverse');
            }
        });
    },

    EliminarBD: function(proyecto, nombre_tabla) {
        $.ajax({
            url:"eliminar_bd",
            data: {"proyecto": proyecto, "nombre_tabla": nombre_tabla },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'POST',
                success: function(data)
                {
                    Api_by_lumic.notify(data, 'inverse');
                }
        });
    },

    CrearCore: function(proyecto, nombre_tabla) {
        $("#crear-core").validate({
            submitHandler: function(form) {

                var get_form = document.getElementById("crear-core");
                var postData = new FormData(get_form);

                $.ajax({
                    url: "APPLICATION_EXECUTE",
                    data: postData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'POST',
                    success: function(response) {

                        Api_by_lumic.notify(response, 'inverse');

                        $("#tb-datatable-api_by_lumic").DataTable().search($("#name_strtolower").val()).draw();
                        $("#crear-nuevo").attr("disabled", false);
                        $('#tb-datatable-api_by_lumic').DataTable().ajax.reload();

                    }
                });
            }
        });
    },

    notify: function(message, type) {
        $(".alert").remove();

        $.notify({
            message: message
        }
        , {
            type: type,
            allow_dismiss: false,
            label: 'Cancel',
            className: 'btn-xs btn-inverse',
            placement: {
                from: 'top',
                align: 'right'
            },
            delay: 2500,
            offset: {
                x: 30,
                y: 0
            }
        });
    },
    ReplaceUpdate: function() {
        $(document).on("keyup", ".Editor-editor .global_filter", function() {
            var v_id = $(".Editor-editor #" + this.id).attr("data-id");
            var v_vc_name = $(".Editor-editor #" + this.id).attr("data-name");
            var v_tipo = $(".Editor-editor #" + this.id).attr("data-tipo");
            var valDataGrep = "grep -wrl 'v" + v_tipo + v_id + "_" + v_vc_name + "' ./ | xargs sed -i 's/v" + v_tipo + v_id + "_" + v_vc_name + "/" + $(this).val() + "/g' \n";

            $(".Editor-editor #" + this.id).attr("data-grep", valDataGrep);
            $(".Editor-editor #" + this.id).attr("value", $(this).val());
        });
    },

    set_Reemplazar_tema: function(){
        $("#form_reemplazar_tema").validate(
        {
            submitHandler:function(form)
            {
                var lines = $('#vc_reemplazar_tema').val().split('\n');

                $(".Editor-editor .cambiar_tema").each(function (key, data){

                    if ( typeof lines[key] !== 'undefined' && lines[key] !== '' )
                    {
                        var v_id = $(".Editor-editor #" + this.id).attr("data-id");
                        var v_vc_name = $(".Editor-editor #" + this.id).attr("data-name");
                        var v_tipo = $(".Editor-editor #" + this.id).attr("data-tipo");
                        let lines_key= lines[key];
                        lines_key= lines_key.replace('/', '\\/').replace('vc', '').replace('_', '').replace('id', '');
                        lines_key = lines_key.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                            return letter.toUpperCase();
                        });

                        var valDataGrep = "grep -wrl 'v" + v_tipo + v_id + "_" + v_vc_name + "' ./ | xargs sed -i 's/v" + v_tipo + v_id + "_" + v_vc_name + "/" + lines_key + "/g' \n";

                        $(".Editor-editor #" + this.id).attr("data-grep", valDataGrep );
                        $(".Editor-editor #" + this.id).attr("value", lines_key );
                    }
                });

                $(".Editor-editor .cambiar_campo").each(function (key, data){
                    if ( typeof lines[key] !== 'undefined' && lines[key] !== '')
                    {
                        var v_id = $(".Editor-editor #" + this.id).attr("data-id");
                        var v_vc_name = $(".Editor-editor #" + this.id).attr("data-name");
                        var v_tipo = $(".Editor-editor #" + this.id).attr("data-tipo");
                        let lines_key= lines[key];
                        lines_key= lines_key.replace('/', '_');

                        var valDataGrep = "grep -wrl 'v" + v_tipo + v_id + "_" + v_vc_name + "' ./ | xargs sed -i 's/v" + v_tipo + v_id + "_" + v_vc_name + "/" + lines_key + "/g' \n";

                        $(".Editor-editor #" + this.id).attr("data-grep", valDataGrep );
                        $(".Editor-editor #" + this.id).attr("value", lines_key );

                    }
                });

                $("#modal_form_reemplazar_tema .close").click();
            }
            , errorPlacement: function(error, element) {
                error.insertAfter($("#"+element.attr("name")).next("span"));
            }
            , rules: {
                vc_reemplazar_tema: {
                required: true,
            }
          }
        });
    }
};