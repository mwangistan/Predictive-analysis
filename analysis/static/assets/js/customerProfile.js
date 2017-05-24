$(document).ready(function(){

            /*Get customer profile summary*/
            $.ajax({
                method: 'GET',
                url: '/customerSummary/',
            }).done(function(data){
                if(data.gender){

                Chartist.Pie('#GenderSummary', {
                        labels: Object.keys(data.gender),
                        series: Object.values(data.gender)
                    }); 
                }

                if(data.marital_status){
                Chartist.Pie('#MaritalSummary', {
                        labels: Object.keys(data.marital_status),
                        series: Object.values(data.marital_status)
                    }); 
                } 

                if(data.nationality){

        var options = {
            seriesBarDistance: 12,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

                Chartist.Bar('#nationalitySummary', {
          labels: Object.keys(data.nationality),
          series: [
            Object.values(data.nationality)
          ]
                    }, options, responsiveOptions); 
                }


                if(data.age){

        var options = {
            seriesBarDistance: 12,
            axisX: {
                showGrid: false
            },
            height: "245px"
        };

        var responsiveOptions = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];

                Chartist.Bar('#ageSummary', {
          labels: Object.keys(data.age),
          series: [
            Object.values(data.age)
          ]
                    }, options, responsiveOptions); 
                }

            })

})