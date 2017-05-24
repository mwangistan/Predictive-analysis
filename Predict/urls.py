"""Predict URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from analysis import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.main, name='dashboard'),
    url(r'customerProfile/$', views.customerProfile, name='customerProfile'),
    url(r'segment/$', views.segment, name='segment'),
    url(r'segment/create/$', views.createSegment, name='create_segment'),
    url(r'segment/analyse/$', views.IndexData, name='analyse'),
    url(r'segment/analyse/analyse-data/Step 1/(?P<name>[\w]+)$', views.analyse_summary, name='analyse-data'),
    url(r'segment/analyse/analyse-data/Step 2/(?P<name>[\w]+)$', views.analyse, name='analyse-data2'),
    url(r'segment/analyse/analyse-results/$', views.analyseResults, name='analyse-results'),
    url(r'segment/analyse/createSegment/$', views.SegmentCustomers, name='segment-customers'),
    url(r'segment/twitterAnalytics/(?P<name>[\w]+)$', views.twitterAnalytics, name='twitter_analytics'),
    url(r'segment/VisualSummary/(?P<name>[\w]+)$', views.segmentVisual, name='segment_visual'),
    url(r'segment/Predict/$', views.predictPage, name='predict_page'),
    url(r'segment/Predict/(?P<name>[\w]+)$', views.predictData, name='predict-data'),
    url(r'customer/discovery', views.discover, name='discovery'),
    url(r'customer/discover/discover-tweets/$', views.discoverTweets, name="discovery-tweets"),

    url(r'tutorial/$', views.Tutorial, name="tutorial"),


    #Ajax request Urls
    
    url(r'fileUpload/$', views.segmentCreation),
    url(r'CustomerUpload/$', views.customerUpload),
    url(r'customerSummary/$', views.customerSummary),
    url(r'querySegment/$', views.query),
    url(r'segment/analyse/(?P<name>[\w]+)$', views.segment_summary),
    url(r'twitterquery/$', views.twitterquery),
    url(r'submitSentiments/$', views.submitSentiments),
    url(r'segmentVisual/(?P<name>[\w]+)$', views.segmentVisualAnalysis),
    url(r'segment/prediction/(?P<name>[\w]+)$', views.predictDataAnalysis),
    url(r'segment/prediction/Drivers/(?P<name>[\w]+)$', views.predictDrivers),
]
