var Agentes_por_hora = {

    init: function () {
        // Funciones principales
        Agentes_por_hora.datatable_Agentes_por_hora(rango_fecha='');
    },

    datatable_Agentes_por_hora: function (rango_fecha) {

        var table = $('#tb-datatable-agentes_por_hora').DataTable({
            "stateSave": false,
            "destroy": true,
            "scrollX": true,
            "info": false,
            "paging": false,
            "ordering": false,
            "pageLength": 50,
            "responsive": false,
            "ajax": {
                "url": "get_agentes_por_hora_by_datatable",
                "type": "GET",
                "data": {
                    "rango_fecha": rango_fecha, "datatable": true
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
            },
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
            },
            stateLoadCallback: function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
            },
            fnDrawCallback: function( oSettings ) {
            },
            complete: function(response)
            {

            },
            createdRow: function( row, data, dataIndex ) {
                let stsId = data;
                if (stsId[0]=="Total HO" || stsId[0]=="Total O"){
                    $(row).addClass('table-success');
                }
            },
            "dom": 'Brtip',
            "buttons": [
                {
                    "extend": 'excel',
                    "title": 'Reporte agentes por hora',
                    "className": 'btn header-item noti-icon btn-personalizado-xlxs',
                    "excelStyles": {
                        "template": 'blue_medium',
                    },
                },
            ]
        });

        $('#btn-personalizados').html('');
        table.buttons().container().appendTo( '#btn-personalizados' );
        $('.btn-personalizado-xlxs').html('<i class="mdi mdi-microsoft-excel text-success"></i>');
        $('.btn-personalizado-xlxs').removeClass('btn-secondary header-item');
        $('.btn-personalizado-xlxs').addClass('header-item noti-icon');

        Agentes_por_hora.grafica(rango_fecha);
        Agentes_por_hora.grafica_ho_o(rango_fecha);
    },

    getChartColorsArray: function (id) {
         if (null !== document.getElementById(id)) {
           var list = document.getElementById(id).getAttribute("data-colors");
           if (list) {
             return (list = JSON.parse(list)).map(function(t) {
               var b = t.replace(" ", "");
               if (-1 === b.indexOf(",")) {
                 var a = getComputedStyle(document.documentElement).getPropertyValue(b);
                 return a || b;
               }
               var vendors = t.split(",");
               return 2 != vendors.length ? b : "rgba(" + getComputedStyle(document.documentElement).getPropertyValue(vendors[0]) + "," + vendors[1] + ")";
             });
           }
           console.warn("data-colors Attribute not found on:", id);
         }
    },

    grafica: function (fecha) {

        $('#grafica-rango-fecha').html('<div id="grafica-agente-ventas"  data-colors=\'["--bs-danger","--bs-success", "--bs-primary"]\' dir="ltr"></div>');

        $.ajax({
            url:"get_graficar_agentes_por_hora",
            data: {fecha: fecha},
            cache: false,
            contentType: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
            dataType: 'json',
                success: function(result)
                {
                    var lineChartWidth;
                    var lineChart;
                    var lineChartColors = Agentes_por_hora.getChartColorsArray("grafica-agente-ventas");
                    lineChartColors && (lineChartWidth = $("#grafica-agente-ventas").width(), container = document.getElementById("grafica-agente-ventas"), options = {
                     chart : {
                       width : lineChartWidth,
                       height : 380,
                       title : ""
                     },
                     yAxis : {
                       title : "",
                       pointOnColumn : true
                     },
                     xAxis : {
                       title : ""
                     },
                     series : {
                       spline : true,
                       showDot : !(data = {
                         categories : ["1", "2", "3", "4", "5", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
                         series : result
                       })
                     },
                     tooltip : {
                       suffix : "\u00b0C"
                     }
                    }, theme = {
                     chart : {
                       background : {
                         color : "#fff",
                         opacity : 0
                       }
                     },
                     title : {
                       color : "#8791af"
                     },
                     xAxis : {
                       title : {
                         color : "#8791af"
                       },
                       label : {
                         color : "#8791af"
                       },
                       tickColor : "#8791af"
                     },
                     yAxis : {
                       title : {
                         color : "#8791af"
                       },
                       label : {
                         color : "#8791af"
                       },
                       tickColor : "#8791af"
                     },
                     plot : {
                       lineColor : "rgba(166, 176, 207, 0.1)"
                     },
                     legend : {
                       label : {
                         color : "#8791af"
                       }
                     },
                     series : {
                       colors : lineChartColors
                     }
                    }, tui.chart.registerTheme("myTheme", theme), options.theme = "myTheme", lineChart = tui.chart.lineChart(container, data, options)), $(window).resize(function() {
                     lineChartWidth = $("#line-charts").width();
                     lineChart.resize({
                       width : lineChartWidth,
                       height : 350
                     });
                    });

                },
                error: function(response)
                {
                    console.log("response", response);
                }
        });
    
    },

    grafica_ho_o: function (fecha) {

        $('#grafica-rango-fecha-ho-o').html('<div id="grafica-agente-ventas-ho-o"  data-colors=\'["--bs-danger","--bs-success", "--bs-primary"]\' dir="ltr"></div>');

        $.ajax({
            url:"get_graficar_agentes_por_hora_home_office_office",
            data: {fecha: fecha},
            cache: false,
            contentType: false,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            type: 'GET',
            dataType: 'json',
                success: function(result)
                {
                    var lineChartWidth;
                    var lineChart;
                    var lineChartColors = Agentes_por_hora.getChartColorsArray("grafica-agente-ventas-ho-o");
                    lineChartColors && (lineChartWidth = $("#grafica-agente-ventas-ho-o").width(), container = document.getElementById("grafica-agente-ventas-ho-o"), options = {
                     chart : {
                       width : lineChartWidth,
                       height : 380,
                       title : ""
                     },
                     yAxis : {
                       title : "",
                       pointOnColumn : true
                     },
                     xAxis : {
                       title : ""
                     },
                     series : {
                       spline : true,
                       showDot : !(data = {
                         categories : ["1", "2", "3", "4", "5", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
                         series : result
                       })
                     },
                     tooltip : {
                       suffix : "\u00b0C"
                     }
                    }, theme = {
                     chart : {
                       background : {
                         color : "#fff",
                         opacity : 0
                       }
                     },
                     title : {
                       color : "#8791af"
                     },
                     xAxis : {
                       title : {
                         color : "#8791af"
                       },
                       label : {
                         color : "#8791af"
                       },
                       tickColor : "#8791af"
                     },
                     yAxis : {
                       title : {
                         color : "#8791af"
                       },
                       label : {
                         color : "#8791af"
                       },
                       tickColor : "#8791af"
                     },
                     plot : {
                       lineColor : "rgba(166, 176, 207, 0.1)"
                     },
                     legend : {
                       label : {
                         color : "#8791af"
                       }
                     },
                     series : {
                       colors : lineChartColors
                     }
                    }, tui.chart.registerTheme("myTheme", theme), options.theme = "myTheme", lineChart = tui.chart.lineChart(container, data, options)), $(window).resize(function() {
                     lineChartWidth = $("#line-charts").width();
                     lineChart.resize({
                       width : lineChartWidth,
                       height : 350
                     });
                    });

                },
                error: function(response)
                {
                    // console.log("response", response);
                }
        });
    
    }
};

Agentes_por_hora.init();