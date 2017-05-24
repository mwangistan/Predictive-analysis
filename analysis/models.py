import os
from django.db import models
from django.conf import settings


class CustomerProfiles(models.Model):
	first_name = models.CharField(max_length=100, null=True, blank=True)
	middle_name = models.CharField(max_length=100, null=True, blank=True)
	last_name = models.CharField(max_length=100, null=True, blank=True)
	date_of_birth = models.CharField(max_length=5, null=True, blank=True)
	email = models.EmailField(null=True, blank=True)
	gender = models.CharField(max_length=7, null=True, blank=True)
	nationality = models.CharField(max_length=20, null=True, blank=True)
	id_number = models.IntegerField(null=True, blank=True)
	marital_status = models.CharField(max_length=20, null=True, blank=True)



class Segments(models.Model):
	name = models.CharField(max_length=250, unique=True)
	files_added = models.TextField()
	es_index = models.CharField(max_length=300, unique=True)
	customers = models.ManyToManyField(CustomerProfiles)
	segmentSearch = models.TextField(null=True, blank=True)
	tweetTerm = models.CharField(max_length=300, null=True, blank=True)
	positiveSentiment = models.CharField(max_length=10, null=True, blank=True)
	negativeSentiment = models.CharField(max_length=10, null=True, blank=True)
	neutralSentiment = models.CharField(max_length=10, null=True, blank=True)
	searchResults = models.TextField(null=True, blank=True)
	mapping_profiles = models.CharField(max_length=300, null=True, blank=True)
