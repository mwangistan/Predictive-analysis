$(document).ready(function(){
		
		$.ajax({
        	method: 'GET',
        	url: "/segment/prediction/"+$('#segmentPrediction').val(),

   		}).done(function(data){

   		/* Prediction columns */
        cols = Object.keys(data.results[0]._source)
        vals = data.results[0]._source
        for(var i=0; i<cols.length; i++){
        	if(typeof(vals[cols[i]]) == 'number' && cols[i] != data.omit_col){
        		$('#PredictionColumns').append('<option value='+i+'>'+cols[i]+'</option>')
        	}
	
        }

   			data = data.sorted;
   			labels = []
   			series = []
   			for(var i=0; i<data.length; i++){
   				labels.push(data[i][0])
   				series.push(data[i][1])
   			}
        Chartist.Pie('#Predict', {
                labels: labels,
                series: series
            });


   		});


   		$('#PredictionColumns').change(function(){
   			if($('#PredictionColumns').val()){
   				$that = $(this);
   				$that.closest('.col-md-6').append('<div class="loading"></div>');

				$.ajax({
        			method: 'POST',
        			url: "/segment/prediction/Drivers/"+$('#segmentPrediction').val(),
        			data: {'cols':$('#PredictionColumns').val()}

   				}).done(function(data){
   					$that.closest('.col-md-6').find('.loading').remove();
   					if(data.prediction){
   						labels = Object.keys(data.prediction);
   						series = Object.values(data.prediction)
   						Chartist.Pie('#PredictBehavior', {
                			labels: labels,
                			series: series
            			});
   					}

            if(data.noprediction){
              $('#PredictBehavior').html('<p class="segmentDescrition">No prediction available. This is usually due to the fact that Iris uses numeric data to calculate correlations. Your data seem to have only one numeric column excluding the customer id. However, other key drivers of this segment can be seen on the left section</p>')
            }
   				})
   			}
   		})
});