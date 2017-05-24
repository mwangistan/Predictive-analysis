$(document).ready(function(){
	$('#Discoverbtn').click(function(e){
		e.preventDefault();
		if($('#discovertxt').val()){
			$that = $(this);
			$that.closest('.col-md-12').append('<div class="loading"></div>');
			$.ajax({
        		method: 'POST',
        		url: "/twitterquery/",
        		data: {'data':$('#discovertxt').val()}
			}).done(function(data){
				sessionStorage.setItem('Tweets', data);
				$that.closest('.col-md-12').find('.loading').remove();

				window.location.href = '/customer/discover/discover-tweets';
				
			});
		}
	})
});