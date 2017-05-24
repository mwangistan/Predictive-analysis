# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerProfiles',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('first_name', models.CharField(blank=True, null=True, max_length=100)),
                ('middle_name', models.CharField(blank=True, null=True, max_length=100)),
                ('last_name', models.CharField(blank=True, null=True, max_length=100)),
                ('date_of_birth', models.CharField(blank=True, null=True, max_length=5)),
                ('email', models.EmailField(blank=True, null=True, max_length=254)),
                ('gender', models.CharField(blank=True, null=True, max_length=7)),
                ('nationality', models.CharField(blank=True, null=True, max_length=20)),
                ('id_number', models.IntegerField(blank=True, null=True)),
                ('marital_status', models.CharField(blank=True, null=True, max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Segments',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(max_length=250, unique=True)),
                ('files_added', models.TextField()),
                ('es_index', models.CharField(max_length=300)),
                ('segmentSearch', models.TextField(blank=True, null=True)),
                ('tweetTerm', models.CharField(blank=True, null=True, max_length=300)),
                ('positiveSentiment', models.CharField(blank=True, null=True, max_length=10)),
                ('negativeSentiment', models.CharField(blank=True, null=True, max_length=10)),
                ('neutralSentiment', models.CharField(blank=True, null=True, max_length=10)),
                ('customers', models.ManyToManyField(to='analysis.CustomerProfiles')),
            ],
        ),
    ]
