# Generated by Django 4.2.3 on 2023-07-29 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0002_remove_user_ip_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='validation_info',
            field=models.CharField(default='', max_length=250),
        ),
    ]
