$(document).ready(function(){
if($('#AnalyseSegmentName').val()){
	$.ajax({
        method: 'POST',
        url: "/segment/analyse/"+$('#AnalyseSegmentName').val(),

    }).done(function(data){
    	data = JSON.parse(data);
    	dataSet = []
    	for(var i=0; i<data.length; i++){
    		dataSet.push(Object.values(data[i].fields));
    	}

		var columns = [];
		var tmpcols = Object.keys(data[0].fields);


		for(var i=0; i<tmpcols.length; i++){
			columns.push({'title': tmpcols[i]})
		}

    	$('#segment_table').DataTable({
			data: dataSet,
			columns: columns
		});
    }); 

}

	$('#delete_segment').click(function(e){
		e.preventDefault();
		swal({
            title: "",
            text: "Are you sure you want to delete this record",
            type: "warning",
            closeOnConfirm: false,

         	},
            function(isConfirm){
				$.ajax({
            		method: 'POST',
            		url: "/deleteSegment/",
            		data: segment,

       			}).done(function(data){
        			console.log(data)
        		});     
       		});

	});

	$('#addQuery').click(function(e){	
		$('#orQuery').show();
		$('#andQuery').show();
		e.preventDefault();
		sessionStorage.removeItem('query');			 
		$('#queryFull').html('Find all records where '+$('#queryColumn').val()+' '+$('#queryCondition').val()+' '+$('#QueryVal').val());
		var data = {'exact_query':[], 'message':''};
		data.exact_query.push({'column':$('#queryColumn').val(), 'condition':$('#queryCondition').val(), 'value':$('#QueryVal').val(), 'operation':''});
		data.message = 'Find all records where '+$('#queryColumn').val()+''+$('#queryCondition').val()+''+$('#QueryVal').val();

		sessionStorage.setItem('query', JSON.stringify(data));
		});

	$('#andQuery').click(function(e){
		e.preventDefault();
		var data = JSON.parse(sessionStorage.getItem('query'));
		var oldMsg = data.message;
		var newMsg = oldMsg +" AND "+$('#queryColumn').val()+' '+$('#queryCondition').val()+' '+$('#QueryVal').val();
		$('#queryFull').html(newMsg);

		data.exact_query.push({'column':$('#queryColumn').val(), 'condition':$('#queryCondition').val(), 'value':$('#QueryVal').val(), 'operation':'and'});
		data.message = newMsg;
		sessionStorage.removeItem('query');
		sessionStorage.setItem('query', JSON.stringify(data));

	});

	$('#orQuery').click(function(e){
		e.preventDefault();
		var data = JSON.parse(sessionStorage.getItem('query'));
		var oldMsg = data.message;
		var newMsg = oldMsg +" OR "+$('#queryColumn').val()+' '+$('#queryCondition').val()+' '+$('#QueryVal').val();
		$('#queryFull').html(newMsg);

		data.exact_query.push({'column':$('#queryColumn').val(), 'condition':$('#queryCondition').val(), 'value':$('#QueryVal').val(), 'operation':'or'})

		data.message = newMsg;
		sessionStorage.removeItem('query');
		sessionStorage.setItem('query', JSON.stringify(data));

	});

	$('#runQuery').click(function(e){
		e.preventDefault();
		var data = sessionStorage.getItem('query');
		sessionStorage.setItem('index', $('#IndexName').val());

		$.ajax({
            method: 'POST',
            url: "/querySegment/",
            data: {'query': data, 'index':$('#IndexName').val()},

       	}).done(function(data){
       		sessionStorage.setItem('results', JSON.stringify(data.results));
       		sessionStorage.setItem('messageServer', JSON.stringify(data.message));

       		window.location.href = '/segment/analyse/analyse-results/'
        }).error(function(data){
        	 swal({
                 title: "Error",
                 text: "Your search value is incorrect.",
                  type: "error",
              })
        }); 

	})

});