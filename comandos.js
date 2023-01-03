var Comandos = {

    init: function() {

        // $("#modal_form_modal_add_git").modal("show");

        // $('#modal_form_modal_remove_files').modal('show');

// setTimeout(function() {
//     $("#modal_form_modal_remove_files").modal("show")
// }, 2e3);

        Comandos.modalShow();
        Comandos.modalHide();
        Comandos.AgregarNuevo();
        Comandos.actualizarTabla();
        Comandos.kcomandos();
        Comandos.crear_bash();
        Comandos.vue();
        Comandos.set_Comandos();
        Comandos.theme();
    },

    datatable_Comandos: function() {
        var table = $('#tb-datatable-comandos').DataTable({
            "orderCellsTop": true,
            "fixedHeader": true,
            "stateSave": false,
            "responsive": true,
            "crossDomain": true,
            "pageLength": 5,
            "scrollCollapse": true,
            "lengthMenu": [5, 10, 25, 50, 75, 100],
            "scrollY": "400px",
            "ajax": {
                "url": "http://console/comandos/get_comandos_by_datatable",
                "type": "POST",
                "data": {
                    "extra": 1
                }
            },
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            },
            stateSaveCallback: function(settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
            },
            stateLoadCallback: function(settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
            },
            drawCallback: function() {
                $('.dataTables_paginate > .pagination').addClass('pagination-sm') // make pagination small
            },
            "columnDefs": [{
                    "visible": true,
                    "targets": 0,
                    "class": "text-center"
                },
                {
                    "visible": true,
                    "targets": 1,
                    "width": "5%"
                },
                {
                    "targets": [2],
                    "render": function(data, type, row, meta) {

                        var valid_url = /^(ftp|http|https):\/\/[^ "]+$/.test(row[2]);

                        if (valid_url) {
                            return '<a href="' + row[2] + '" target="_blank">' + row[2] + '</a>';
                        } else {
                            return row[2];
                        }

                    }
                },
                {
                    "targets": [1],
                    "class": 'text-right',
                    "render": function(data, type, row, meta) {
                        return row[1] + '<div class="btn-group btn-group-xs" role="group">&nbsp;&nbsp;&nbsp;&nbsp;\
                      <a href="#modal_form_modal_comandos" id="' + row[0] + '" data-bs-toggle="modal" class="btn btn-sm btn-soft-info update-comandos"><i class="mdi mdi-pencil-outline"></i></a>\
                            <a href="javascript:void(0)" id="' + row[0] + '" class="btn btn-sm btn-soft-danger delete-comandos"><i class="mdi mdi-delete-outline"></i></a></div>';
                    }
                },
                {
                    "visible": false,
                    "targets": 3
                }
            ]
        });

        $('#tb-datatable-comandos tbody').on('click', '.delete-comandos', function() {

            document.getElementById("form_comandos").reset();
            $("label.error").hide();
            $(".error").removeClass("error");

            var id_comandos = this.id;

            $.post("http://console/comandos//delete_comandos", {
                "id_comandos": id_comandos
            }, function(data) {
                try {
                    var result = JSON.stringify(result);
                    var json = JSON.parse(data);
                } catch (e) {
                    console.log(data);
                }

                if (data) {
                    $('#tb-datatable-comandos').DataTable().ajax.reload();
                    var n = new Noty({
                        type: "warning",
                        close: false,
                        text: "<b>Se movio a la papelera<b>",
                        timeout: 20e3,
                        buttons: [
                            Noty.button('Deshacer', 'btn btn-success', function() {
                                $.post("comandos/undo_delete_comandos", {
                                    "id_comandos": id_comandos
                                }, function(data) {
                                    if (data) {
                                        n.close();
                                        $('#tb-datatable-comandos').DataTable().ajax.reload();
                                    } else {
                                        alert("Ocurrio un error");
                                    }
                                }); // post
                            }, {
                                'id': 'id-' + json['data']['id'],
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

        $('#tb-datatable-comandos tbody').on('click', '.update-comandos', function() {

            var id = this.id;
            document.getElementById("form_comandos").reset();
            $("#id_comandos").remove();
            $("#form_comandos").prepend("<input type=\"hidden\" name=\"id_comandos\" id=\"id_comandos\" value=" + id + ">");
            console.log("id", id);

            $("#modal_form_modal_comandos .modal-title").html("Editar comando");

            $.post("http://console/comandos/get_comandos_by_id", {
                "id_comandos": id
            }, function(data) {
                try {
                    var result = JSON.stringify(result);
                    var json = JSON.parse(data);
                } catch (e) {
                    console.log(data);
                }

                if (json["b_status"]) {
                    var p = json['data'];
                    for (var key in p) {
                        if (p.hasOwnProperty(key)) {
                            if (p[key] !== "") {
                                $("#" + key).addClass("fill");

                                if ($("#" + key).prop('type') == "text" ||
                                    $("#" + key).prop('type') == "textarea" ||
                                    $("#" + key).prop('type') == "number" ||
                                    $("#" + key).prop('type') == "url" ||
                                    $("#" + key).prop('type') == "tel"
                                ) {
                                    $("#" + key).val(p[key]);
                                }

                                if ($("#" + key).prop('type') == "file") {

                                    if (p[key] !== "") {
                                        $("#" + key).attr("required", false);
                                    }

                                    if (p[key] !== null) {
                                        var filename = p[key].replace(/^.*[\\\/]/, '')
                                        $("#" + key).after("<a href=\"" + p[key] + "\" target=\"_blank\" class=\"external_link  abrir-" + key + " \"> " + filename.substr(0, 15) + " </a>");
                                    }
                                }

                                if ($("#" + key).prop('nodeName') == "SELECT") {
                                    $('#' + key + ' option[value="' + p[key] + '"]').prop('selected', true);
                                }
                            }
                        }
                    }
                } else {
                    alert("Revisar console para mas detalle");
                    console.log(json);
                }
                $(".btn-action-form").attr("value", "Actualizar");
                $(".btn-action-form").prop("disabled", false);
            }); //  Fin $.post
        });
    },

    set_Comandos: function() {
        $("#form_comandos").validate({
            submitHandler: function(form) {
                var get_form = document.getElementById("form_comandos");
                var postData = new FormData(get_form);

                $.ajax({
                    url: "http://console/comandos/set_comandos",
                    data: postData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function(response) {
                        try {
                            var json = JSON.parse(response);
                        } catch (e) {
                            alert(response);
                            return;
                        }

                        $('#tb-datatable-comandos').DataTable().ajax.reload();
                        document.getElementById("form_comandos").reset();
                        $('#modal_form_modal_comandos').modal('hide');
                    }
                });
            },
            errorPlacement: function(error, element) {
                console.log(element.attr("name"));
                error.insertAfter($("#" + element.attr("name")));
            }
        });
    },

    modalShow: function() {
        $('#modal_form_modal_comandos').on('shown.bs.modal', function(e) {
            $('#vc_atajo_teclado', e.target).focus();
        });
    },

    modalHide: function() {
        $('#modal_form_modal_comandos').on('hidden.bs.modal', function(e) {
            var validator = $("#form_comandos").validate();
            validator.resetForm();
            $("label.error").hide();
            $(".error").removeClass("error");
        });

        $('.modal').on('hidden.bs.modal', function(e) {
            $("#estado_actual").html("");
        });

        // Aplica para todas las reglas de modal
        $(document).keydown(function(event) {
            if (event.keyCode == 27) {
                $('.close').click();
            }
        });

    },

    AgregarNuevo: function() {
        $(document).on("click", ".agregar-comandos", function() {
            document.getElementById("form_comandos").reset();
            $("#id_comandos").remove();

            if ($(".alert-inverse").length) {
                $(".alert-inverse").remove();
            }

            $("#modal_form_modal_comandos .modal-title").html("Nuevo Comando");
        });
    },

    actualizarTabla: function() {
        $(document).on("click", "#actualizar-tbl-comandos", function() {
            let element_by_id = 'form_amazon_hub';
            let message = 'Procesando...';
            let $loading = Comandos.f_cargando(element_by_id, message);
            $('#tb-datatable-comandos').DataTable().ajax.reload();
            $loading.waitMe('hide');
        });
    },

    kcomandos: function() {
        document.addEventListener('keydown', (event) => {

            const keyName = event.key;

            if ($('#modal_form_modal_seleccionar_opciones').hasClass('show')) {
                $("#tbl-mas-de-un-comando td:eq( " + keyName + " )").css("color", "red");
                return;
            }

            if ($(event.target).is('input') || $(event.target).is('textarea'))
                return false;

            if (keyName == "ArrowUp" ||
                keyName == "ArrowLeft" ||
                keyName == "ArrowRight" ||
                keyName == "ArrowDown" ||
                keyName == "Tab" ||
                keyName == "AltGraph" ||
                keyName == "Shift" ||
                keyName == "CapsLock" ||
                keyName == "Escape"
            ) {
                $("body").attr("id", "");
                $("#estado_actual").html("...");
                return;
            }

            if (keyName == "Backspace") {
                $("body").attr("id", "");
                $("#estado_actual").html("...");
                return;
            }

            if (keyName == "¿") {
                $("body").attr("id", "");
                $("#estado_actual").html("...");


                $.ajax({
                    url:"validar_debug",
                    cache: false,
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'GET',
                        success: function(data)
                        {

                            if ( ! $("#modals-interno").hasClass("d-none") && data){
                                $("#modals-interno").addClass("d-none");
                            }else{
                                $("#modals-interno").removeClass("d-none");
                            }

                        },
                        error: function(response)
                        {
                            console.log("response", response);
                        }
                });

            }

            if (keyName == "" || keyName == "Alt" || keyName == "Control")
                return;

            var get_id = $("body").attr("id") + keyName;
            var copiado;

            $("body").attr("id", get_id);
            get_id = $("body").attr("id");

            $("#estado_actual").html(get_id);

            setTimeout(function() {
                $("#estado_actual").html("");
            }, 19000)

            if (keyName == "'") {
                Comandos.request_by_id(get_id, keyName);
                return;
            }

            Comandos.request(get_id, keyName);
        });
    },

    request_by_id: function(id, keyName) {
        $.post("http://console/comandos/get_comandos_all_by_id", {
            id: id
        }, function(data) {
            try {
                var result = JSON.stringify(result);
                var json = JSON.parse(data);
            } catch (e) {
                console.log(data);
            }

            if (keyName.indexOf("Enter") == 0) {
                $("#estado_actual").html("");
                $("body").attr("id", "");
            }

            let id_comandos = json.data[0]['id_comandos'];

            if (json.b_status) {
                $("#response").append(json);

                if (json['data'].length > 1) {
                    Comandos.MasDeUnComando(json);
                } else {
                    Comandos.EsUnComando(json);
                }
            }
        });
    },

    request: function(get_id, keyName) {
        $.post("http://console/comandos/get_comandos_all", {
            vc_atajo_teclado: get_id
        }, function(data) {
            try {
                var result = JSON.stringify(result);
                var json = JSON.parse(data);
            } catch (e) {
                console.log(data);
            }

            $("#ejecucion_constante").html(data);

            if (keyName.indexOf("Enter") == 0) {
                $("#estado_actual").html("");
                $("body").attr("id", "");
            }

            let id_comandos = json.data[0]['id_comandos'];

            if (json.b_status) {

                let message = $('#es_nuevo').length ? 'Enviando...' : 'Actualizando...';
                let element_by_id = 'tb-datatable-comandos';

                let $loading = Comandos.f_cargando(element_by_id, message);

                $.post("http://console/comandos//set_log_comando", {
                    "id_comandos": id_comandos
                });

                if (json['data'].length > 1) {
                    Comandos.MasDeUnComando(json);
                    $("#response").append("+ " + json.data[0].vc_comando + "<br>");
                } else {
                    Comandos.EsUnComando(json);
                    $("#response").append(json.data[0].vc_comando + "<br>");
                }

                $loading.waitMe('hide');

            }
        });
    },

    EsUnComando: function(json) {
        var regExp = /_modal_/;

        console.log("regExp", regExp);

        if (regExp.test(json.data[0].vc_comando) === true) {
            
            $(".alert-inverse").remove();

            $('#' + json.data[0].vc_comando).modal('show');

            $('#' + json.data[0].vc_comando).on('shown.bs.modal', function(e) {

                if ($(this).find("input").length > 0) {
                    $(this).find('input:first').focus();
                } else if (($(this).find("textarea").length > 0)) {
                    $(this).find('textarea').focus();
                }
            });
            return;
        }

        var valid_url = /^(ftp|http|https):\/\/[^ "]+$/.test(json.data[0].vc_comando);
        var valid_file = /^(file):\/\/\/[^ "]+$/.test(json.data[0].vc_comando);
        console.log("json.data[0].vc_comando", json.data[0].vc_comando);

        if (valid_url || valid_file) {
            window.open(json.data[0].vc_comando, '_blank');
        }

        if (json.data[0].vc_path_script == '') {
            copiado = Comandos.CopyToClipboard(json.data[0].vc_comando);
        }

        if (json.data[0].vc_path_script !== '') {
            let element_by_id = 'tb-datatable-comandos';

            $.post(json.data[0].vc_path_script, {
                vc_comando: json.data[0].vc_comando
            }, function(response) {
                if (json.data[0].vc_path_script !== '') {
                    copiado = Comandos.CopyToClipboard(response);
                    $("#response").append(copiado);
                }
            });
        }
    },

    MasDeUnComando: function(json) {

        var tr;
        $(json['data']).each(function(key, data) {

            let valid_url = /^(ftp|http|https):\/\/[^ "]+$/.test(data['vc_comando']);
            let comando = data['vc_comando'];

            if (valid_url) {
                comando = '<a href="' + data['vc_comando'] + '" target="_blank"> ' + data['vc_comando'] + ' </a>';
            }

            tr += "<tr>\
                  <td>" + key + "</td>\
                  <td>" + comando + "</td>\
                </tr>";
        });

        $("#estado_actual").html("");
        $("#tbody-opciones").html("");

        $("#tbody-opciones").append(tr);
        $('#modal_form_modal_seleccionar_opciones').modal('show');

    },

    CopyToClipboard: function(vc_comando) {
        var dummy = $('<textarea id="comodin">').val(vc_comando).appendTo('body').select();
        var v = document.execCommand('copy');
        $("#comodin").remove();
        $(".alert-inverse").remove();
        LibreriaGeneral.NotyCore(titulo = '', mensaje = vc_comando, nFrom = 'top', nAlign = 'center', icon = 'feather icon-bell', type = 'inverse', animIn = 'animIn', animOut = 'animOut');
    },

    borrarComando: function(copiado) {
        $("#estado_actual").html("...");
        $("body").attr("id", "");
    },

    vue: function(copiado) {
        // var app = new Vue({
        //   el: '#app',
        //   data: {
        //     message: 'Hola Vue!',
        //     hover: true,
        //   }
        // });

    },

    crear_bash: function() {

        $("#form_modal_replace").validate({
            submitHandler: function(form) {
                let vc_buscar = $("#vc_buscar").val();
                vc_buscar = vc_buscar.replaceAll("/", "\\/");
                vc_buscar = vc_buscar.replaceAll("&", "\\&");

                let vc_reemplazar = $("#vc_reemplazar").val();
                vc_reemplazar = vc_reemplazar.replaceAll("/", "\\/");
                vc_reemplazar = vc_reemplazar.replaceAll("&", "\\&");

                let bash_prueba = "grep -wr '" + vc_buscar + "' ";
                let bash = "grep -wrl '" + vc_buscar + "' ./ | xargs sed -i 's/" + vc_buscar + "/" + vc_reemplazar + "/g'";

                copiado = Comandos.CopyToClipboard(bash);
                Comandos.borrarComando(copiado);

                $("#response_prueba").html(bash_prueba);
                $("#response").append(bash);

                $('.close').click();
                document.getElementById("form_modal_replace").reset();
            }
        });

        $("#form_modal_campos").validate({
            submitHandler: function(form) {
                let lines = $('#vc_buscar_campos').val();

                $.ajax({
                    url: "http://console/comandos//campos",
                    data: {
                        lines: lines
                    },
                    type: 'POST',
                    success: function(response) {

                        copiado = Comandos.CopyToClipboard(response.trim());
                        Comandos.borrarComando(copiado);
                        $('.close').click();
                        document.getElementById("form_modal_campos").reset();
                    },
                    error: function(response) {

                    }
                });
            }
        });

        $("#modal_remove_files").validate({
            submitHandler: function(form) {
                let lines = $('#vc_path_replace').val().split('\n');
                let rm = '';
                $.each(lines, function(key, value) {
                    if (value !== '')
                        rm += "mv " + value + " /home/gmartinez/cubeta; \n";
                    // rm += "rm -r "+value + "; \n";
                });

                copiado = Comandos.CopyToClipboard(rm);
                Comandos.borrarComando(copiado);
                $('.close').click();
                document.getElementById("modal_remove_files").reset();
            }
        });

        $("#form_subl").validate({
            submitHandler: function(form) {
                let lines = $('#vc_subl').val().split('\n');
                let subl = '';
                $.each(lines, function(key, value) {
                    if (value !== '')
                        subl += "subl " + value + "; \n";
                });

                copiado = Comandos.CopyToClipboard(subl);
                Comandos.borrarComando(copiado);
                $('.close').click();
                document.getElementById("form_subl").reset();
            }
        });

        $("#modal_add_git").validate({
            submitHandler: function(form) {
                let lines = $('#vc_add_git').val().split('\n');

                let rm = '';
                $.each(lines, function(key, value) {
                    if (value !== '') {
                        rm += "git add " + value + "; \n";
                    }
                });

                rm = rm.replaceAll('modificados:', '');
                rm = rm.replaceAll('  ', ' ');

                let valor = rm;
                copiado = Comandos.CopyToClipboard(valor);

                Comandos.borrarComando(copiado);
                $('.close').click();
                document.getElementById("modal_add_git").reset();
            }
        });

        $("#modal_git_checkout").validate({
            submitHandler: function(form) {
                var lines = $('#vc_git_checkout').val().split('\n');

                let rm = '';
                $.each(lines, function(key, value) {
                    if (value !== '')
                        rm += "git checkout " + value + "; \n";
                });

                rm = rm.replaceAll('modificados:', '');
                rm = rm.replaceAll('  ', ' ');
                copiado = Comandos.CopyToClipboard(rm);
                Comandos.borrarComando(copiado);
                $('.close').click();
                document.getElementById("modal_git_checkout").reset();
            }
        });
    },

    f_cargando: function(element_by_id, message) {
        let effect = $('ios').data('loadingEffect');
        let $loading = $('#' + element_by_id).waitMe({
            effect: effect,
            text: message,
            bg: 'rgba(255,255,255,0.90)',
            color: '#555'
        });
        return $loading;
    },

    theme: function() {
        if ($("#name-user").length) {
            let nombre = $("#name-user").html();

            if (nombre.trim() == "gus") {
                // $('.card-body, .navbar-header').css('background-color', '#f0f2f5');
                // $('.card').css('background-color', '#f0f2f5');
                $('body').css('background-color', '#f0f2f5');
                $('.page-content').css('background-color', '#f0f2f5');
                $('table').removeClass('table-hover');
            }
        }
    },
};

function reloj (){
    let nombre = $("#name-user").html().trim();
    if ($("#name-user").length && nombre == "gus") {

        Comandos.init();

        function f_reloj() {

            if (!$("#div_reloj").length) {
                return;
            }

            var date = new Date();
            var h = date.getHours(); // 0 - 23
            var m = date.getMinutes(); // 0 - 59
            var s = date.getSeconds(); // 0 - 59
            var session = "AM";

            if (h == 0) {
                h = 12;
            }

            if (h > 12) {
                h = h - 12;
                session = "PM";
            }

            h = (h < 10) ? "0" + h : h;
            m = (m < 10) ? "0" + m : m;
            s = (s < 10) ? "0" + s : s;

            var time = h + ":" + m + ":" + s + " " + session;
            document.getElementById("div_reloj").innerText = time;
            document.getElementById("div_reloj").textContent = time;

            setTimeout(f_reloj, 1000);
        }

        f_reloj();
    }    
}

reloj();