#user_app.urls
from django.urls import path
from .views import Sign_up, Log_in, Log_out, Admin_sign_up, All_users, A_user, Validation, User_status, Resend_email, Send_password_email, Password_reset

urlpatterns = [
    path('signup/', Sign_up.as_view(), name='signup'),
    path("login/", Log_in.as_view(), name="login"),
    path("logout/", Log_out.as_view(), name="logout"),
    path('admin-signup/', Admin_sign_up.as_view(), name='master'),
    path("", All_users.as_view(), name="all users"),
    path("status/", User_status.as_view(), name='status'),
    path("me/", A_user.as_view(), name="my info"),
    path("<int:userid>/", A_user.as_view(), name="a user"),
    path("validation/<str:validation_key>/", Validation.as_view(), name="validation"),
    path("resend/", Resend_email.as_view(), name='resend'),
    path("reset-email/", Send_password_email.as_view(), name='password reset email send'),
    path("reset-password/<reset_key>/", Password_reset.as_view(), name='password reset'),
]
