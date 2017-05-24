from django.core.urlresolvers import resolve

def get_current_url(request):
	current_url = resolve(request.path_info).url_name
	return {'current_url': current_url}