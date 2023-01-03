var Desepenio = {

    init: function () {

        // Funciones principales
        Desepenio.set_import_Desepenio();
        Desepenio.datatable_Desepenio(rango_fecha='');
        Desepenio.eventosClick();

        // Funciones para eventos
        Desepenio.modalShow();
        Desepenio.modalHide();
        Desepenio.AgregarNuevo();
        Desepenio.actualizarTabla();
    },

    datatable_Desepenio: function (rango_fecha='') {
        
        var table = $('#tb-datatable-desepenio').DataTable({
            "stateSave": false,
            "responsive": false,
            "serverSide": false,
            "scrollX": true,
            "destroy": true,
            "scrollY": "590px",
            "scrollCollapse": true,
            "fixedColumns": true,
            "pageLength": 50,
            "bPaginate": true,
            "bLengthChange": false,
            "dom": "lrtip",
            "lengthMenu": [10, 25, 50, 75, 100],
            "ajax": {
                "url": "get_desepenio_by_datatable",
                "type": "GET",
                "data": {
                    "rango_fecha": rango_fecha
                },
                "headers": {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            },
            "processing": true,
            "autoWidth": true,
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
                "sLoadingRecords": '<div class="text-center text-primary avatar-sm" role="status">\
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
            }            ,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
            },
            stateLoadCallback: function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
            },
            fnDrawCallback: function( oSettings ) {

            },
            "columnDefs": [
                {
                    "targets": 0,
                    "class": "text-center"
                }
                // ,{
                //     "targets": 1,
                //     "class": "fw-bold text-primary",
                //     "render": function (data, type, row, meta) {
                //         return '<a href="javascript:void(0);" class="btn btn-soft-primary d-block update-desepenio" id="'+row[0]+'"  >'+row[1]+'</a>';
                //     },                    
                // }
                ,{
                    "targets": 4,
                    "class": "text-center",
                }
                ,{
                    "targets": 5,
                    "class": "text-center",
                }
                ,{
                    "targets": 6,
                    "class": "text-center",
                }
                ,{
                    "targets": 11,
                    "class": "text-center"
                }
                ,{
                    "targets": 12,
                    "class": "text-center"
                }
                ,{
                    "targets": 13,
                    "class": "text-center"
                }
                ,{
                    "targets": 14,
                    "class": "text-center"
                }
                ,{
                    "targets": 15,
                    "class": "text-center"
                }
            ]
        });

        $('#buscar_reporte').keyup(function(){
            table.search($(this).val()).draw() ;
        });

    },

    set_import_Desepenio: function () {
        $("#form_import_desepenio").validate({
            submitHandler: function (form) {
                var get_form = document.getElementById("form_import_desepenio");
                var postData = new FormData(get_form);

                let element_by_id= 'form_import_desepenio';
                let message=  'Cargando...' ;
                let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

                $.ajax({
                    url: "set_import_desepenio",
                    data: postData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'POST',
                    success: function (response) {

                        $loading.waitMe('hide');

                        try {
                            var json = JSON.parse(response);
                        } catch (e) {
                            alert(response);
                            return;
                        }

                        if (json["b_status"]) {
                            $('#tb-datatable-desepenio').DataTable().ajax.reload();
                            document.getElementById("form_import_desepenio").reset();
                            $('#modalImportFormDesepenio').modal('hide');
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
              vc_importar: {
                required: true
              }
            }
            , messages: {
                vc_importar: {
                    minlength: "Mensaje personalizado vc_importar"
                }
              }
        });
    },

    modalShow: function () {
        $('#modalFormIUDesepenio').on('shown.bs.modal', function (e) {
            $('#vCampo1_desepenio', e.target).focus();
        });

        $('#modalImportFormDesepenio').on('shown.bs.modal', function (e) {
            $('#vc_importar', e.target).focus();
        });
    },

    modalHide: function () {
        $('#modalFormIUDesepenio').on('hidden.bs.modal', function (e) {
            var validator = $("#form_desepenio").validate();
            validator.resetForm();
            $("label.error").hide();
            $(".error").removeClass("error");
            
            if ($("#id").length)
            {
                $("#id").remove();
            }
            document.getElementById("form_desepenio").reset();
            document.getElementById("form_import_desepenio").reset();
        });
    },

    AgregarNuevo: function () {
        $(document).on("click", "#add_new_desepenio", function () {
            document.getElementById("form_desepenio").reset();            
            $("#modalFormIUDesepenio .modal-title").html("Nuevo Desepenio");
        });
    },

    actualizarTabla: function () {
        $(document).on("click", "#refresh_Desepenio", function () {

            let element_by_id= 'tb-datatable-desepenio';
            let message=  'Actualizando...' ;
            let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

            $('#tb-datatable-desepenio').DataTable().ajax.reload();
            setTimeout(() => {
                console.log("World!");
                $loading.waitMe('hide');
            }, 1000);

        });
    },

    eventosClick: function(e){

    },    

    calendar_desempeno: function(idtrab){

        let vc_search= $("#vc_search").val();

        $.ajax({
            url: "calendar_desempeno",
            type: "POST",
            data: {'vc_search': vc_search ,'rango_fecha': vc_search, idtrab: idtrab},
            dataType: 'JSON',
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'POST',
            success: function(response)
            {
                $('.modal_detalles').html(response);
            },
            error: function(response)
            {}
        });

        $('#ModalPopovers').modal('show');
    },
};

Desepenio.init();