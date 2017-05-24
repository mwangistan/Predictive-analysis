# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0003_segments_mapping_profiles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='segments',
            name='es_index',
            field=models.CharField(unique=True, max_length=300),
        ),
    ]
