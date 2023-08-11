import smtplib
import hashlib
import uuid
from dotenv import load_dotenv
import os
from email.message import EmailMessage
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    validation_info = models.CharField(blank=True, max_length=300)
    # The related names for the upvoters and downvoters M2M fields (defined in Post model) are upvoted_posts and downvoted_posts, respectively
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=[]

    # Generate a validation key by hashing a UUID. The hash of this key will populate the validation info field
    # Then send an email with this validation key so users can use it for email activation
    def send_validation_email(self):
        # Make a validation key by hashing a UUID
        validation_key = User.hash(uuid.uuid4())
        # Store the hash of the validation key in the validation_info field
        self.validation_info = User.hash(validation_key)

        msg = EmailMessage()
        msg.set_content(f'link: /api/v1/users/validation/{validation_key}/')

        # me == the sender's email address
        # you == the recipient's email address
        msg['Subject'] = f'Peer Review Email Activation'
        msg['From'] = 'creynders22@gmail.com'
        msg['To'] = 'chase.reynders@gmail.com'

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
            return "Email sent successfully!"
            # Only save database upon successful email send
            self.save()
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
