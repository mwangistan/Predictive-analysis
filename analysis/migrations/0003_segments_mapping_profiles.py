# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0002_segments_searchresults'),
    ]

    operations = [
        migrations.AddField(
            model_name='segments',
            name='mapping_profiles',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
