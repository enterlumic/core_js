var Control_a_ceros = {

    init: function () {

        // Funciones principales
        Control_a_ceros.datatable_reporte_control_a_ceros(v_dt_fechas='');

        $('.nav-tabs a').on('shown.bs.tab', function(event){
            let tab = $(event.target).text();

            if (tab.trim() == 'Reporte' ){
                Control_a_ceros.datatable_reporte_control_a_ceros(v_dt_fechas='');
            }

            if (tab.trim() == 'Uso de sistema' ){
                Control_a_ceros.datatable_uso_de_sistema(v_dt_fechas='');
            }

        });


    },

    datatable_reporte_control_a_ceros: function (v_dt_fechas) {

        let element_by_id= 'preloader-control-a-ceros';
        let message=  'Cargando...' ;
        let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

        $.ajax({
            url:"get_control_a_ceros_by_datatable_full",
            //url:"get_control_a_ceros_by_datatable",
            data: {rango_fecha: v_dt_fechas},
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {                    
                    try {
                        var data = JSON.parse(data);
                    } catch (e) {
                        $loading.waitMe('hide');
                        $("#div-table-reporte").html(data);
                        return;
                    }

                    $("#div-table-reporte").html('<table id="tb-datatable-control_a_ceros" class="table stripe row-border order-column" style="width:100%"></table>');

                    columns = [];

                    var rowData = data[0];

                    Object.keys( rowData ).forEach( function (key, index) {
                        columns.push( {data: key, title: key} ); 
                    });

                    var table1 = $('#tb-datatable-control_a_ceros').DataTable({
                        scrollX: true,
                        serverSide: false,
                        scrollY: "590px",
                        scrollCollapse: true,
                        bPaginate: true,
                        bLengthChange: false,
                        data: data,
                        columns: columns,
                        dom: 'Brtip',
                        //buttons: [
                        //    {
                        //        extend: 'excel',
                        //        title: 'Reporte a cero',
                        //        className: 'btn header-item noti-icon btn-personalizado-xlxs',
                        //        excelStyles: {
                        //            template: 'blue_medium',
                        //        },
                        //    },
                        //],
                        buttons: [],
                        fixedColumns:   {
                            left: 2,
                            right: 0
                        },
                        "columnDefs": [
                            {
                                "targets": 2,
                                "visible": true,
                            },
                            {
                                "targets": 3,
                                "visible": true,
                            },
                            {
                                "targets": 4,
                                "visible": true,
                                "class": "text-center"
                            },
                            {
                                "targets": 6,
                                "visible": true,
                                "class": "text-center"
                            }
                        ],
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
                            "sLoadingRecords": '<div class="text-center text-primary avatar-sm" role="status"></div>',
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
                    });

                    $('#btn-personalizados').html('');
                    //table1.buttons().container().appendTo( '#btn-personalizados' );
                    //$('.btn-personalizado-xlxs').html('<i class="mdi mdi-microsoft-excel text-success"></i>');
                    //$('.btn-personalizado-xlxs').removeClass('btn-secondary header-item');
                    //$('.btn-personalizado-xlxs').addClass('header-item noti-icon');

                    $('#buscar_reporte').keyup(function(){
                        table1.search($(this).val()).draw() ;
                    });

                    $loading.waitMe('hide');
                },
                error: function(response)
                {
                    console.log("response", response);
                    $loading.waitMe('hide');
                },
                complete: function(response)
                {
                    console.log("response", response);
                    $loading.waitMe('hide');
                }
        });
    },


    datatable_uso_de_sistema: function (v_dt_fechas) {

        let element_by_id= 'preloader-control-a-ceros';
        let message=  'Cargando...' ;
        let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

        $.ajax({
            url:"get_uso_de_sistema_by_datatable",
            data: {rango_fecha: v_dt_fechas},
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {
                    try {
                        var data = JSON.parse(data);
                    } catch (e) {
                        $loading.waitMe('hide');
                        return;
                    }

                    $("#div-table-uso-sistema").html('<table id="tb-datatable-uso-de-sistema" class="table stripe row-border order-column" style="width:100%"></table>');

                    columns = [];

                    var rowData = data[0];

                    Object.keys( rowData ).forEach( function (key, index) {
                        columns.push( {data: key, title: key} ); 
                    });

                    var table1 = $('#tb-datatable-uso-de-sistema').DataTable({
                        scrollX: true,
                        serverSide: false,
                        scrollY: "590px",
                        scrollCollapse: true,
                        bPaginate: true,
                        bLengthChange: false,
                        ////////////////////////////////////////////////////////////////////
                        data: data,
                        columns: columns,
                        // dom: 'Bfrtip',
                        dom: 'Brtip',
                        buttons: [
                            {
                                extend: 'excel',
                                title: 'Uso de sistema',
                                className: 'btn header-item noti-icon btn-personalizado-xlxs',
                                excelStyles: {
                                    template: 'blue_medium',
                                },
                            },
                        ],
                        fixedColumns:   {
                            left: 2,
                            right: 0
                        },
                        ////////////////////////////////////////////////////////////////////
                        "columnDefs": [
                            {
                                "targets": 2,
                                "visible": true,
                            },
                            {
                                "targets": 3,
                                "visible": true,
                            },
                            {
                                "targets": 4,
                                "visible": true,
                                "class": "text-center"
                            },
                            {
                                "targets": 6,
                                "visible": true,
                                "class": "text-center"
                            },
                            {
                                "targets": 9,
                                "class": "_fecha text-primary text-center"
                            }
                        ],
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
                            "sLoadingRecords": '<div class="text-center text-primary avatar-sm" role="status"></div>',
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
                    });

                    $('#btn-personalizados').html('');
                    table1.buttons().container().appendTo( '#btn-personalizados' );
                    $('.btn-personalizado-xlxs').html('<i class="mdi mdi-microsoft-excel text-success"></i>');
                    $('.btn-personalizado-xlxs').removeClass('btn-secondary header-item');
                    $('.btn-personalizado-xlxs').addClass('header-item noti-icon');

                    $('#buscar_reporte').keyup(function(){
                        table1.search($(this).val()).draw() ;
                        console.log("$(this).val()", $(this).val());
                    });

                    $loading.waitMe('hide');
                },
                error: function(response)
                {
                    $loading.waitMe('hide');
                }
        });
    },
};

Control_a_ceros.init();