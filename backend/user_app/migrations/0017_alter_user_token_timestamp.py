# Generated by Django 4.2.3 on 2023-09-04 19:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0016_alter_user_token_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='token_timestamp',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 30, 19, 36, 27, 713971, tzinfo=datetime.timezone.utc)),
        ),
    ]
