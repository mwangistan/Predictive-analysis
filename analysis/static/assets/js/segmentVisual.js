$(document).ready(function(){

	$.ajax({
        method: 'GET', dataType:'json',
        url: "/segmentVisual/"+$('#SegmentVisual').val(),
	}).done(function(data){

    var dl = JSON.parse(data.searchRes)[0];
    cols = Object.keys(dl._source);
    vals = Object.values(dl._source);

    /* create select */

    for(var i=0; i<cols.length; i++){
      if(typeof(vals[i]) == 'number'){
        $('#OwnAnalysis').append('<option value='+cols[i]+'>'+cols[i]+'</option>');
      }

      if(typeof(vals[i]) == 'string'){
        $('#OwnAnalysis2').append('<option value='+cols[i]+'>'+cols[i]+'</option>')
      }
      
    }


    $('#CreateOwnVis').click(function(e){
      e.preventDefault();
      label2 = $('#OwnAnalysis2').val();
      label1 =  $('#OwnAnalysis').val();
      var nd = JSON.parse(data.searchRes); 
      /*
      var newLabels = [];
      var uniqueNames = [];
      
      for(var i=0; i<nd.length; i++){
        newLabels.push(nd[i]._source[label2]);
      }

      /* check duplicates
      $.each(newLabels, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el); 
      });


      /* Get values of unique labels */
      var newData = [], key, value, ch = {};
      for(var i=0; i<nd.length; i++){
          var Obj = {};
          Obj[nd[i]._source[label2]] = nd[i]._source[label1];
          newData.push(Obj);

          value = parseFloat(nd[i]._source[label1]);
          value = isNaN(value) ? 0: value;
          key = nd[i]._source[label2];

          if ( key in ch ) ch[key] += value;
          else ch[key] = value;
      }


        var options = {
            seriesBarDistance: 10,
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

                Chartist.Bar('#OwnsegmentAnalysis', {
          labels: Object.keys(ch),
          series: [
            Object.values(ch)
          ]
                    }, options, responsiveOptions); 


       
    });

        Chartist.Pie('#Gender', {
                labels: Object.keys(data.gender),
                series: Object.values(data.gender)
            }); 

        Chartist.Pie('#Marital', {
                labels: Object.keys(data.marital_status),
                series: Object.values(data.marital_status)
            }); 

        Chartist.Pie('#Sentiments', {
                labels: ['positive', 'negative', 'neutral'],
                series: [data.positivesentiments, data.negativesentiments, data.neutralsentiments]
            }); 

        var options = {
            seriesBarDistance: 10,
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

                Chartist.Bar('#nationality', {
          labels: Object.keys(data.nationality),
          series: [
            Object.values(data.nationality)
          ]
                    }, options, responsiveOptions); 



        var options = {
            seriesBarDistance: 10,
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

                Chartist.Bar('#age', {
          labels: Object.keys(data.age),
          series: [
            Object.values(data.age)
          ]
                    }, options, responsiveOptions); 


        })
	});