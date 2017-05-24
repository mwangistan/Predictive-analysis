$(document).ready(function(){

		var data = JSON.parse(sessionStorage.getItem('Tweets')).tweets;
		datasetPositive = [];
		datasetNegative = [];
		datasetNeutral = [];
		for(var i=0; i<data.length; i++){
			rowsPositive = [];
			rowsNegative = [];
			rowsNeutral = [];
			if(data[i].cde.content){
				if(data[i].cde.content.sentiment.polarity == 'POSITIVE'){
					var gender = data[i].cde.author.gender;
					var location = data[i].cde.author.location.city +' '+ data[i].cde.author.location.country;
					var displayName = data[i].message.actor.displayName;
					var preferredUsername = data[i].message.actor.preferredUsername;
					var body = data[i].message.body;
					var postedTime = data[i].message.postedTime;
					var followersCount = data[i].message.actor.followersCount;
					var friendsCount = data[i].message.actor.friendsCount;

					rowsPositive.push(displayName, gender, location, postedTime, followersCount, friendsCount, body, preferredUsername);
					datasetPositive.push(rowsPositive)
					/* show all positive tweets */
							
				}

				if(data[i].cde.content.sentiment.polarity == 'NEGATIVE'){
					var gender = data[i].cde.author.gender;
					var location = data[i].cde.author.location.city +' '+ data[i].cde.author.location.country;
					var displayName = data[i].message.actor.displayName;
					var preferredUsername = data[i].message.actor.preferredUsername;
					var body = data[i].message.body;
					var postedTime = data[i].message.postedTime;
					var followersCount = data[i].message.actor.followersCount;
					var friendsCount = data[i].message.actor.friendsCount;

					rowsNegative.push(displayName, gender, location, postedTime, followersCount, friendsCount, body, preferredUsername);
					datasetNegative.push(rowsNegative)
					/* show all positive tweets */
							
				}

				if(data[i].cde.content.sentiment.polarity == 'NEUTRAL'){
					var gender = data[i].cde.author.gender;
					var location = data[i].cde.author.location.city +' '+ data[i].cde.author.location.country;
					var displayName = data[i].message.actor.displayName;
					var preferredUsername = data[i].message.actor.preferredUsername;
					var body = data[i].message.body;
					var postedTime = data[i].message.postedTime;
					var followersCount = data[i].message.actor.followersCount;
					var friendsCount = data[i].message.actor.friendsCount;

					rowsNeutral.push(displayName, gender, location, postedTime, followersCount, friendsCount, body, preferredUsername);
					datasetNeutral.push(rowsNeutral)
					/* show all positive tweets */
							
				}
			}
		}


		$('#discoverPositive').DataTable({
					data: datasetPositive,
					columns: [{'title': 'Name'}, {'title': 'Gender'}, {'title': 'Location'}, {'title':'PostedTime'}, {'title':'Followers'}, {'title': 'Friends'}, {'title': 'body'}, {'title': 'Preferred Username'}]
		});


		$('#discoverNegative').DataTable({
					data: datasetNegative,
					columns: [{'title': 'Name'}, {'title': 'Gender'}, {'title': 'Location'}, {'title':'PostedTime'}, {'title':'Followers'}, {'title': 'Friends'}, {'title': 'body'}, {'title': 'Preferred Username'}]
		});

		$('#discoverNeutral').DataTable({
					responsive: true,
					data: datasetNeutral,
					columns: [{'title': 'Name'}, {'title': 'Gender'}, {'title': 'Location'}, {'title':'PostedTime'}, {'title':'Followers'}, {'title': 'Friends'}, {'title': 'body'}, {'title': 'Preferred Username'}]
		});

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().responsive.recalc();
    });

});