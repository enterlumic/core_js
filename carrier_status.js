var Carrier_status = {

    init: function () {
        Carrier_status.datatable_Carrier_status(v_dt_fechas='');
    },

    datatable_Carrier_status: function (v_dt_fechas='') {

        let element_by_id= 'div-table-reporte';
        let message=  'Cargando...' ;
        let $loading= LibreriaGeneral.f_cargando(element_by_id, message);

        $.ajax({
            url:"get_carrier_status_by_datatable",
            data: {rango_fecha: v_dt_fechas},
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
                success: function(data)
                {
                    console.log("data", data);
                    try {
                        var data = JSON.parse(data);
                    } catch (e) {
                        $loading.waitMe('hide');
                        return;
                    }

                    columns = [];

                    var rowData = data[0];

                    Object.keys( rowData ).forEach( function (key, index) {
                        columns.push( {data: key, title: key} ); 
                    });

                    var table1 = $('#tb-datatable-carrier_status').DataTable({
                        scrollX: true,
                        serverSide: false,
                        scrollY: "500px",
                        data: data,
                        columns: columns,
                        dom: 'Brtip',
                        pageLength : 100,
                        buttons: [
                            {
                                extend: 'excel',
                                title: 'Reporte carrier status',
                                className: 'btn header-item noti-icon btn-personalizado-xlxs',
                                excelStyles: {
                                    template: 'blue_medium',
                                },
                            },
                        ],

                        "drawCallback": function(settings) {
                            var api = this.api();
                            var rows = api.rows({
                                page: 'current'
                            }).nodes();
                            var last = null;
                            api.column(0, {
                                page: 'current'
                            }).data().each(function(group, i) {
                                if (last !== group) {
                                    $(rows).eq(i).before('<tr class="group"><td colspan="12">' + group + '</td></tr>');
                                    last = group;
                                }
                            });
                        },

                        fixedColumns:   {
                            left: 0,
                            right: 0
                        },
                        "columnDefs": [
                            {
                                "targets": 0,
                                "visible": false,
                            },
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

                    $('#tb-datatable-carrier_status tbody').on('click', 'tr', function () {
                        if ($(this).hasClass('table-success')) {
                            $(this).removeClass('table-success');
                        } else {
                            table1.$('tr.table-success').removeClass('table-success');
                            $(this).addClass('table-success');
                        }
                    });

                    $('#btn-personalizados').html('');
                    table1.buttons().container().appendTo( '#btn-personalizados' );
                    $('.btn-personalizado-xlxs').html('<i class="mdi mdi-microsoft-excel text-success"></i>');
                    $('.btn-personalizado-xlxs').removeClass('btn-secondary header-item');
                    $('.btn-personalizado-xlxs').addClass('header-item noti-icon');

                    $('#buscar_reporte').keyup(function(){
                        table1.search($(this).val()).draw() ;
                    });

                    $loading.waitMe('hide');
                },
                error: function(response)
                {
                    $loading.waitMe('hide');
                },
                complete: function(response)
                {
                    $loading.waitMe('hide');
                }
        });

    }

};

Carrier_status.init();