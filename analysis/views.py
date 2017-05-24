import json, pandas, os, ast, requests, operator
from collections import Counter
from datetime import datetime
import django_excel as excel
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext
from .models import CustomerProfiles, Segments
from django.core import serializers
from django.conf import settings
from pyelasticsearch import ElasticSearch
from django.conf import settings
from functools import reduce

keys = []
fileHolder = []

def main(request):
	return render(request, 'customerProfile.html')

def Tutorial(request):
	return render(request, 'Tutorial.html')

def customerProfile(request): 
	return render(request, 'customerProfile.html')

def customerSummary(request):
	if request.method == 'GET':
		customers = CustomerProfiles.objects.all()
		gender = []
		nationality = []
		marital_status = []
		ageLabel = []
		for customer in customers:
			gender.append(customer.gender)
			nationality.append(customer.nationality)
			marital_status.append(customer.marital_status)
			
			b_date = datetime.strptime(customer.date_of_birth, '%m-%d-%Y')
			birthDate = int((datetime.today() - b_date).days/365)

			if birthDate>=12 and birthDate<=17:
				ageLabel.append("12-17")
			elif birthDate>=18 and birthDate<=24:
				ageLabel.append("18-24")
			elif birthDate>=25 and birthDate<=34:
				ageLabel.append("25-34")
			elif birthDate>=35 and birthDate<=44:
				ageLabel.append("35-44")
			elif birthDate>=45 and birthDate<=54:
				ageLabel.append("45-54")
			elif birthDate>=55 and birthDate<=64:
				ageLabel.append("55-64")
			elif birthDate>=65:
				ageLabel.append("65+")
			else:
				ageLabel.append("unknown")

		gender = Counter(gender)
		nationality = Counter(nationality)
		marital_status = Counter(marital_status)
		age = Counter(ageLabel)

		return HttpResponse(json.dumps({'gender':gender, 'nationality':nationality, 'marital_status':marital_status,
			'age':age}), content_type="application/json")


def customerUpload(request):
	if request.method == 'POST':
		for file in request.FILES.getlist('key'):
			    file.save_to_database(model=CustomerProfiles, mapdict={'First name':'first_name', 'Middle name': 'middle_name',
				    'Last name':'last_name', 'Date Of Birth':'date_of_birth', 'Email':'email', 'ID number':'id_number',
				    'Gender':'gender', 'Nationality':'nationality', 'Marital status':'marital_status'})
		return HttpResponse(json.dumps({'success':"Added successfully"}), content_type="application/json")


def segmentCreation(request):
	###### Remember to check if a segment already exists
	if request.method == 'POST':
		del fileHolder[:]
		try:
			Segments.objects.get(es_index=request.POST['segment_name'].lower())
		except:
			if len(request.FILES.getlist('key')) > 1:
				df = []
				for file in request.FILES.getlist('key'):
					file = pandas.read_csv(file)
					df.append(file)

				final = reduce(lambda left,right: pandas.merge(left,right,on=request.POST['columns_to_merge'], how='outer'), df)
				file_rs = final[:1].to_json(orient='index')

				fileHolder.append({'rawfiles':request.FILES.getlist('key'), 'segment_name':request.POST['segment_name'].lower(),
				'dataFrames':final})

				return HttpResponse(json.dumps({'success':"Added successfully", 'rs':file_rs}), content_type="application/json")		
			else:
				for file in request.FILES.getlist('key'):
					dataFrames = pandas.read_csv(file)
					file_rs = dataFrames[:1].to_json(orient='index')

				fileHolder.append({'rawfiles':request.FILES.getlist('key'), 'segment_name':request.POST['segment_name'],
				'dataFrames':dataFrames})

				return HttpResponse(json.dumps({'success':"Added successfully", 'rs':file_rs}), content_type="application/json")

		return HttpResponse(json.dumps({'fail':"Segment already exists"}), content_type="application/json")

def IndexData(request):
	es = ElasticSearch(settings.ELASTIC_SEARCH)
	for file in fileHolder:
		index = file['segment_name'].lower()
		rawfiles = file['rawfiles']
		data_for_es = file['dataFrames']
		try :
			es.delete_index(index.replace(" ", ""))
		except :
			pass
	es.create_index(index.replace(" ", ""))

	## Loop dataframe and to elasticsearch index
	docs= json.loads(data_for_es.to_json(orient='records'))
	es.bulk((es.index_op(doc) for doc in docs),index=index.replace(" ", ""), doc_type=index)

	##Create segment template
	file_names = []
	for file in rawfiles:
		file_names.append(file.name)

	segment = Segments(name=index, files_added=",".join(file_names), es_index=index.replace(" ", ""))
	segment.save()

	segment = Segments.objects.get(name=index)

	return render(request, 'analyse.html', {'segment':segment})

#All segments
def segment(request):
	segment = Segments.objects.all()
	return render(request, 'segment.html', {'segment':segment})


def analyse(request, name):
	del keys[:]
	es = ElasticSearch(settings.ELASTIC_SEARCH)
	segment = Segments.objects.get(es_index=name)
	mapping = es.get_mapping(index=segment.es_index, doc_type=segment.name)
	new_mapping = {}
	for i in mapping:
		new_mapping['map'] = mapping[i]['mappings'][segment.name]['properties']

	for key in new_mapping['map']:
		keys.append(key)

	return render(request, 'analyse_segment.html', {'segment':segment, 'columns':keys})

def analyse_summary(request, name):
	segment = Segments.objects.get(es_index=name)
	return render(request, 'analyse.html', {'segment':segment})

def segment_summary(request, name):
		segment = Segments.objects.get(es_index=name)
		return HttpResponse(serializers.serialize("json", segment.customers.all()))

def query(request):
	es = ElasticSearch(settings.ELASTIC_SEARCH)
	query = {
	    "query": {
            "bool" : {

        }
      }
    }

    #Building the query
	dict_value = dict(request.POST)
	for key in dict_value['query']:
		key = key

	value = ast.literal_eval(key)
	AndQueries = []
	OrQueries = []

	for index, key in enumerate(value['exact_query']):
		if key['condition'] == 'is equal to':
			query_values = { "term" : { key['column'] : key['value'] } }
		if key['condition'] == 'is less than':
			query_values = {"range" : {key['column'] : { "lt" : key['value']}}}
		if key['condition'] == 'is greater than':
			query_values = {"range" : {key['column'] : { "gt" : key['value']}}}
		if key['condition'] == 'is less than or equal to':
			query_values = {"range" : {key['column'] : { "lte" : key['value']}}}
		if key['condition'] == 'is greater than or equal to':
			query_values = {"range" : {key['column'] : { "gte" : key['value']}}}
		if key['condition'] == 'is not equal to':
			query_values = {"must_not" : { "term": { key['column'] : key['value'] } }}

		if key['operation'] == 'and':
			AndQueries.append(query_values)
		if key['operation'] == 'or':
			OrQueries.append(query_values)
		if key['operation'] == '':
			if index < (len(value['exact_query']) - 1):
				next_value = value['exact_query'][index + 1]
				if next_value['operation'] == 'and':
					AndQueries.append(query_values)
				if next_value['operation'] == 'or':
					OrQueries.append(query_values)
			else:
				query['query']['bool']['must'] = query_values

	if len(AndQueries) != 0:
		query['query']['bool']['must'] = AndQueries
	if len(OrQueries) != 0:
		query['query']['bool']['should'] = OrQueries

	results = es.search(query, index=dict_value['index'][0], size=10000)
	return HttpResponse(json.dumps({'success':"Added successfully", 'results':results}), content_type="application/json")

def SegmentCustomers(request):
	if request.method == 'POST':
		customerSgmt = []
		results = json.loads(request.POST['results'])['hits']['hits']
		customers = CustomerProfiles.objects.all()
		segment = Segments.objects.get(es_index=request.POST['segment'])
		segment.segmentSearch = request.POST['message']
		segment.searchResults = json.dumps(results)
		segment.save()

		## Remove any customers contained in the segment
		if len(segment.customers.all()) != 0:
			segment.customers.clear()
		if len(customers) != 0:
			for customer in customers:
				for rs in results:
					if customer.id_number == rs['_source'][request.POST['behavior']]:
						segment.customers.add(customer)
						segment.mapping_profiles = request.POST['behavior']
						segment.save()
					elif customer.email == rs['_source'][request.POST['behavior']]:
						segment.customers.add(customer)
						segment.mapping_profiles = request.POST['behavior']
						segment.save()
					elif customer.first_name == rs['_source'][request.POST['behavior']]:
						segment.customers.add(customer)
						segment.mapping_profiles = request.POST['behavior']
						segment.save()
					elif customer.middle_name == rs['_source'][request.POST['behavior']]:
						segment.customers.add(customer)
						segment.mapping_profiles = request.POST['behavior']
						segment.save()
					elif customer.last_name == rs['_source'][request.POST['behavior']]:
						segment.customers.add(customer)
						segment.mapping_profiles = request.POST['behavior']
						segment.save()
					else:
						pass

			if len(segment.customers.all()) == 0:
				return HttpResponse(json.dumps({'failMatch':"Matching fail"}), content_type="application/json")
			else:
				return HttpResponse(json.dumps({'success':"Added successfully"}), content_type="application/json")

		else:
			return HttpResponse(json.dumps({'fail':"Customers profile don't exist"}), content_type="application/json")
		
	return render(request, 'segmentCustomers.html', {'columns':keys})

def analyseResults(request):
	return render(request, 'analyseResults.html')

def createSegment(request):
	return render(request, 'createSegment.html')

def twitterAnalytics(request, name):
	return render(request, 'TwitterAnalytics.html', {'segment':name})

def twitterquery(request):
	result = requests.get(settings.TWITTER_URL+request.POST['data'])

	return HttpResponse(json.dumps(result.text), content_type="application/json")


def submitSentiments(request):
	tweets = json.loads(request.POST['tweets'])['tweets']
	positiveTweets = []
	negativeTweets = []
	neutralTweets = []
	for tweet in tweets:
		if 'content' in tweet['cde']:
			if tweet['cde']['content']['sentiment']['polarity'] == 'POSITIVE':
				positiveTweets.append('match')
			if tweet['cde']['content']['sentiment']['polarity'] == 'NEGATIVE':
				negativeTweets.append('match')
			if tweet['cde']['content']['sentiment']['polarity'] == 'NEUTRAL':
				neutralTweets.append('match')

		else:
			pass

	segment = Segments.objects.get(es_index=request.POST['segment'])
	segment.tweetTerm = request.POST['searchTerm']
	segment.positiveSentiment = len(positiveTweets)
	segment.negativeSentiment = len(negativeTweets)
	segment.neutralSentiment = len(neutralTweets)
	segment.save()

	return HttpResponse(json.dumps({'success':"Added successfully"}), content_type="application/json")

def segmentVisual(request, name):
	segment = Segments.objects.get(es_index=name)
	customerLen = len(segment.customers.all())
	return render(request, 'segmentVisual.html', {'segment':name, 'title': segment.name,'tweet':segment.tweetTerm, 'customers':customerLen})

def segmentVisualAnalysis(request, name):
	segment = Segments.objects.get(es_index=name)
	customers = segment.customers.all()
	genderLabel = []
	nationalityLabel = []
	marital_statusLabel = []
	ageLabel = []
	for customer in customers:
		b_date = datetime.strptime(customer.date_of_birth, '%m-%d-%Y')
		birthDate = int((datetime.today() - b_date).days/365)

		if birthDate>=12 and birthDate<=17:
			ageLabel.append("12-17")
		elif birthDate>=18 and birthDate<=24:
			ageLabel.append("18-24")
		elif birthDate>=25 and birthDate<=34:
			ageLabel.append("25-34")
		elif birthDate>=35 and birthDate<=44:
			ageLabel.append("35-44")
		elif birthDate>=45 and birthDate<=54:
			ageLabel.append("45-54")

		elif birthDate>=55 and birthDate<=64:
			ageLabel.append("55-64")
		elif birthDate>=65:
			ageLabel.append("65+")
		else:
			ageLabel.append("unknown")

		genderLabel.append(customer.gender)
		nationalityLabel.append(customer.nationality)
		marital_statusLabel.append(customer.marital_status)

	nationality = Counter(nationalityLabel)
	gender = Counter(genderLabel)
	marital_status = Counter(marital_statusLabel)
	age = Counter(ageLabel)

	return HttpResponse(json.dumps({'positivesentiments':segment.positiveSentiment, 'negativesentiments':segment.negativeSentiment, 'neutralsentiments':segment.neutralSentiment, 'gender':gender, 'marital_status':marital_status, 'nationality':nationality, 'age':age, 'searchRes':segment.searchResults}), content_type="application/json")



