# Generated by Django 4.2.3 on 2023-09-04 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flag_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flag',
            old_name='harmful',
            new_name='explicit_content',
        ),
        migrations.AddField(
            model_name='flag',
            name='hate_speech',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
