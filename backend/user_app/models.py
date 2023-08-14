import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import uuid
import hashlib
from dotenv import load_dotenv
import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    validation_or_reset_tokens = models.CharField(blank=True, max_length=200)
    validated = models.BooleanField(default=False)
    # Set datetime at moment of creation as default
    token_timestamp = models.DateTimeField(default=timezone.now() - timedelta(days=5))
    # The related names for the upvoters and downvoters M2M fields (defined in Post model) are upvoted_posts and downvoted_posts, respectively
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=[]

    def is_expired(self):
        # Check if the token_timestamp is not None
        if self.token_timestamp is not None:
            # Calculate the time difference
            time_difference = timezone.now() - self.token_timestamp
            # Users have a minute to use the token
            if time_difference.total_seconds() <= 100:
                return False
            else:
                return True
        else:
            return True
    
    # Generate a validation key by hashing a UUID. The hash of this key will populate the validation info field
    # Then send an email with this validation key so users can use it for email activation
    def send_validation_email(self):
        # Make a validation key by hashing a UUID
        validation_key = User.hash(uuid.uuid4())
        # Store the hash of the validation key in the validation_or_reset_tokens field
        self.validation_or_reset_tokens = User.hash(validation_key)
        # Update timestamp of when the token was created
        self.token_timestamp = timezone.now()
        
        msg = MIMEMultipart()
        msg['Subject'] = 'GutCheck Email Activation'
        msg['From'] = 'creynders22@gmail.com'
        msg['To'] = 'chase.reynders@gmail.com'

        # HTML content for the email body
        html_body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Web Page</title>
            <style>
                .big-blue-button {{
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #a8dcff;
                    color: white;
                    text-decoration: none;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: bold;
                }}

                .big-blue-button:hover {{
                    background-color: #7dc2f3;
                }}
            </style>
        </head>
        <body>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center">
                        <h1>Welcome to GutCheck!</h1>
                        <h2>Please click the button to confirm your email:</h2>
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <a href="http://localhost:5174/validation/{validation_key}/" class="big-blue-button">
                            Confirm Email
                        </a>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        # Attach the HTML content to the email message
        html_part = MIMEText(html_body, "html")
        msg.attach(html_part)

        # Send the message via our own SMTP server.
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587

        username = 'creynders22@gmail.com'
        # app-specific password, per google's requirements (stored in .env file)
        load_dotenv()
        password = os.getenv('APP_PASSWORD')

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(msg)
            self.save()
            return "Email sent successfully!"
            # Only save database upon successful email send
        except Exception as e:
            return "Error sending email"
        

    def send_reset_email(self):
            print('here!!!!')
            # Make a reset key by hashing a UUID
            reset_key = User.hash(uuid.uuid4())
            # Store the hash of the validation key in the validation_or_reset_tokens field
            self.validation_or_reset_tokens = User.hash(reset_key)
            # Update timestamp of when the token was created
            self.token_timestamp = timezone.now()

            msg = MIMEMultipart()
            msg['Subject'] = 'GutCheck Password Reset'
            msg['From'] = 'creynders22@gmail.com'
            msg['To'] = 'chase.reynders@gmail.com'

            # HTML content for the email body
            html_body = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My Web Page</title>
                <style>
                    .big-blue-button {{
                        display: inline-block;
                        padding: 15px 30px;
                        background-color: #a8dcff;
                        color: white;
                        text-decoration: none;
                        border: none;
                        border-radius: 8px;
                        font-size: 18px;
                        font-weight: bold;
                    }}

                    .big-blue-button:hover {{
                        background-color: #7dc2f3;
                    }}
                </style>
            </head>
            <body>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <h1>Hello from GutCheck!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a href="http://localhost:5174/reset/{reset_key}/" class="big-blue-button">
                                Click to Reset Password
                            </a>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            # Attach the HTML content to the email message
            html_part = MIMEText(html_body, "html")
            msg.attach(html_part)

            # Send the message via our own SMTP server.
            smtp_server = 'smtp.gmail.com'
            smtp_port = 587

            username = 'creynders22@gmail.com'
            # app-specific password, per google's requirements (stored in .env file)
            load_dotenv()
            password = os.getenv('APP_PASSWORD')

            try:
                with smtplib.SMTP(smtp_server, smtp_port) as server:
                    server.starttls()
                    server.login(username, password)
                    server.send_message(msg)
                self.save()
                return "Email sent successfully!"
                # Only save database upon successful email send
            except Exception as e:
                return "Error sending email"
            

    @staticmethod
    def hash(input):
        m = hashlib.sha1()
        #stringify
        input = str(input)
        #encode
        encoded_input = input.encode('utf-8')
        #hash
        m.update(encoded_input)
        hash_output = m.hexdigest()
        return hash_output
