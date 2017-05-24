$(document).ready(function(){
	$('#create_segmentFnl').click(function(e){
		e.preventDefault();
    var message = JSON.parse(sessionStorage.getItem('query'));
    message = message['message']
		$.ajax({
            method: 'POST',
            url: "/segment/analyse/createSegment/",
            data: {'profile': $('#customerProfileFnl').val(),
        			'behavior': $('#behaviorFnl').val(),
        			'results': sessionStorage.getItem('results'),
        			'segment': sessionStorage.getItem('index'),
              'message':message}

       	}).done(function(data){
       		if(data.success){
       			swal({
                    title: "Success",
                    text: "Customer Segment created successfully",
                    type: "success",
                    closeOnConfirm: false,
                },
                function(isConfirm){
                    if(isConfirm){
                        window.location.href = '/segment/analyse/analyse-data/Step 1/'+sessionStorage.getItem('index');
                      }
                    });
       		}

       		if(data.failMatch){
       			swal({
                    title: "Mapping Error",
                    text: "The mapping selected for customer behaviors doesn't match any customer profile field",
                    type: "error",
                });
       		}

       		if(data.fail){
       			swal({
                    title: "Error",
                    text: "Customer profiles do not exist. Click the customer profiles tab to upload customer profile data",
                    type: "error",
                });
       		}
        }); 
	})
});
