$(document).ready(function(){
    $('#TwitterSegmentSubmit').click(function(e){
        e.preventDefault();
        var $segment = $('#TwitterSegmentTerm'), $that = $(this);
        
        if ( $segment.val() ) {
        	$that.closest('.col-md-8').append('<div class="loading"></div>');
            $.ajax({
                method: 'POST',
                url: "/twitterquery/",
                data: {'data':$segment.val()},
            }).done(function(data){
            	sessionStorage.setItem('Tweets', data)

            	tweets = JSON.parse(data).tweets;
            	dataSet = []
            	row = []
                for(var i=0; i<tweets.length; i++){
      				row.push(tweets[i].message.actor.displayName);
      				row.push(tweets[i].message.actor.preferredUsername);
      				row.push(tweets[i].message.body);
      				if(tweets[i].cde.content){
      					row.push(
                  tweets[i].cde.content.sentiment.polarity);
      				}
      				else{
      					row.push("")
      				}
      				row.push(tweets[i].message.actor.followersCount);
                	row.push(tweets[i].message.actor.friendsCount);
                	dataSet.push(row);
                	row = [];
                	continue;
                }

             
				 $('#twitter_table').DataTable({
				 	destroy: true,
					data: dataSet,
					columns: [{'title': 'displayName'}, {'title': 'preferredUsername'}, {'title':'Tweet'}, {'title': 'Sentiment'}, {'title': 'followersCount'}, {'title':'friendCount'}]
				});

				$('#actionsTweets').show();

            }).complete(function(){
            	$that.closest('.col-md-8').find('.loading').remove();
            });
        }

        else{
            console.log("has no val")
        }
    })


    $('#AddSentiment').click(function(e){
    	e.preventDefault();
		$.ajax({
        	method: 'POST',
        	url: "/submitSentiments/",
        	data: {'searchTerm': $('#TwitterSegmentTerm').val(), 'tweets':sessionStorage.getItem('Tweets'),
        			'segment':$('#SegmentNameTweets').val()}

    	}).done(function(data){

    		if (data.success){
				swal({
            		title: "Success",
            		text: "Sentiment data added successfully",
            		type: "success",
            		closeOnConfirm: false,

         		},
            	function(isConfirm){
					window.location.href = '/segment/analyse/analyse-data/Step 1/'+$('#SegmentNameTweets').val();    
       		});

		}
    })
    	
    })
});