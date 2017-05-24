$(document).ready(function(){
	var results = JSON.parse(sessionStorage.getItem('results'));
	var message = JSON.parse(sessionStorage.getItem('query'));

	if ((results.hits.hits).length != 0){
		$('#title_results').html(message['message']);
		if(results['hits'].length == 0){
			$('#content_results').append("<h3>No results found</h3>")
		}
		else{
			var columns = [];
			var tmpcols = Object.keys(results.hits.hits[0]._source)

			for(var i=0; i<tmpcols.length; i++){
				columns.push({'title': tmpcols[i]})
			}

			var dataSet = [];
			var data = results.hits.hits;
			for(var i=0; i<data.length; i++){
				dataSet.push(Object.values(data[i]._source))
			}

			$('#results_table2').DataTable({
				data: dataSet,
				columns: columns
			});

		}

	}

	else{
		$('#content_results').append('<h3>No results found</h3>');
		$('#createCustomerSegment').hide();
	}

	$('#refineQuery').click(function(){
		window.location.href= '/segment/analyse/analyse-data/Step 2/'+sessionStorage.getItem('index');
	});

	$('#createCustomerSegment').click(function(){
		window.location.href = '/segment/analyse/createSegment/';
	});

});