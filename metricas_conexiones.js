var Metricas_conexiones = {

    init: function () {
        // Funciones principales
        Metricas_conexiones.datatable_Metricas_conexiones(rango_fecha='');
        Metricas_conexiones.get_reporte_metricas_conexiones();
    },

    datatable_Metricas_conexiones: function (rango_fecha) {
        var table = $('#tb-datatable-metricas_conexiones').DataTable({
            "stateSave": false,
            "scrollX": true,
            "destroy": true,
            "responsive": false,
            "serverSide": false,
            "pageLength": 50,
            "scrollCollapse": true,
            "lengthMenu": [10, 25, 50, 75, 100],
            "ajax": {
                "url": "get_metricas_conexiones_by_datatable",
                "type": "GET",
                "data": {
                    "rango_fecha": rango_fecha
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
            "dom": 'Brtip',
            buttons: [
                {
                    extend: 'excel',
                    title: 'Reporte a cero',
                    className: 'btn header-item noti-icon btn-personalizado-xlxs',
                    excelStyles: {
                        template: 'blue_medium',
                    },
                },
            ],
            "buttons": [
                {
                    "extend": 'excel',
                    "title": 'Reporte a cero',
                    "className": 'btn header-item noti-icon btn-personalizado-xlxs',
                    "excelStyles": {
                        "template": 'blue_medium',
                    },
                },
            ],

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
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-success fs-20 update-metricas_conexiones"><i class="ri-edit-2-line"></i></a>\
                                <a href="javascript:void(0);" id="' + row[0] + '" class="link-danger fs-20 delete-metricas_conexiones" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Delete">\
                                    <i class="ri-delete-bin-line"></i>\
                                </a>\
                            </div>';
                    },
                    "class": "text-center"
                }
            ]
        });

        $('#btn-personalizados').html('');
        table.buttons().container().appendTo( '#btn-personalizados' );
        $('.btn-personalizado-xlxs').html('<i class="mdi mdi-microsoft-excel text-success"></i>');
        $('.btn-personalizado-xlxs').removeClass('btn-secondary header-item');
        $('.btn-personalizado-xlxs').addClass('header-item noti-icon');

    },

    get_reporte_metricas_conexiones: function () {

        $.ajax({
            url:"get_reporte_metricas_y_conexiones",
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

                    var hsr_cumplimiento_proactivas;
                    var aprovechamiento_de_hrs;
                    var diferencias;
                    var class_css;

                    $("#objetivo1").html(json['objetivo_minimo']['objetivo_minimo_hrs']);
                    $("#objetivo2").html(json['objetivo_minimo']['objetivo_minimo_mensual']);

                    $("#real1").html(json['objetivo_minimo']['real_minimo_hrs']);
                    $("#real2").html(json['objetivo_minimo']['real_minimo_facturacion']);

                    $("#diff1").html(json['objetivo_minimo']['diff_minimo_hrs']);
                    $("#diff2").html(json['objetivo_minimo']['diff_minimo_mensual']);

                    $("#porcentaje").html(json['objetivo_minimo']['porcentaje']);

                    $("#_objetivo1").html(json['objetivo_ideal']['objetivo_ideal_hrs']);
                    $("#_objetivo2").html(json['objetivo_ideal']['objetivo_ideal_mensual']);

                    $("#_real1").html(json['objetivo_ideal']['real_minimo_hrs']);
                    $("#_real2").html(json['objetivo_ideal']['real_minimo_facturacion']);

                    $("#_diff1").html(json['objetivo_ideal']['diff_minimo_hrs']);
                    $("#_diff2").html(json['objetivo_ideal']['diff_minimo_mensual']);

                    $("#_porcentaje").html(json['objetivo_ideal']['porcentaje']);

                    for( var k in json['table']){


                        if (json['table'][k]['id'] == 0){
                            class_css= "table-success";
                        }else{
                            class_css= "";
                        }

                        hsr_cumplimiento_proactivas+= 
                        '<tr class="'+class_css+'"> \
                            <th scope="col">'+json['table'][k]['fecha']+'</th>\
                            <td scope="col" class="text-center">'+json['table'][k]['horas_r']+'</td>\
                            <td scope="col" class="text-center">'+json['table'][k]['promedio_billiable_x_agente']+'</td>\
                            <td scope="col" class="text-center">'+json['table'][k]['faltas']+'</td>\
                        </tr>';

                        aprovechamiento_de_hrs+= 
                        '<tr class="'+class_css+'">\
                            <th scope="col" class="text-center">'+json['table'][k]['tope_de_hrs_x_dia']+'</th>\
                            <td scope="col" class="text-center">'+json['table'][k]['hrs_fact']+'</td>\
                            <td scope="col" class="text-center">'+json['table'][k]['dif_hrs_top']+'</td>\
                            <td scope="col" class="text-center">'+json['table'][k]['fac_hrs_tope']+'</td>\
                        </tr>';

                        diferencias+= 
                        '<tr class="'+class_css+'">\
                            <td scope="col" class="text-center">'+json['table'][k]['DIFERENCIA_HRS_HC']+'</td>\
                            <td scope="col" class="text-center">'+json['table'][k]['FACT_HRS_TOPE__HRS_FACT_REALES']+'</td>\
                        </tr>';

                    }

                    $("#hsr_cumplimiento_proactivas").after(hsr_cumplimiento_proactivas);
                    $("#aprovechamiento_de_hrs").after(aprovechamiento_de_hrs);
                    $("#diferencias").after(diferencias);

                },
                error: function(response)
                {
                    console.log("response", response);
                }
        });
    },

};

Metricas_conexiones.init();

