# Generated by Django 4.2.3 on 2023-09-04 18:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('post_app', '0003_post_explanation1_post_explanation2_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Flag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inaccurate', models.BooleanField()),
                ('harmful', models.BooleanField()),
                ('maliciousURL', models.BooleanField()),
                ('reason', models.CharField(blank=True, max_length=150, null=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flags', to='post_app.post')),
            ],
        ),
    ]