What happens at each endpoint:

api/v1/users/
- GET will return a list of all users and their info 
    - page is only accessible to ADMIN users, so REQUIRES TOKEN AUTHORIZATION PLUS VALIDATION.

api/v1/users/<int:userid>/
- GET will return the specified user and their info 
    - page is only accessible to ADMIN users (unless viewing your own profile), so REQUIRES TOKEN AUTHORIZATION PLUS VALIDATION.
- DELETE will delete the specified user 
    - page is only accessible to ADMIN users, so REQUIRES TOKEN AUTHORIZATION PLUS VALIDATION.
    - prevents self-deletion.
    - CONSIDER (NOT IMPLEMENTED YET): allow any user to delete themself (and thus log themself out)? Probably should do this...

api/v1/users/me/
- GET will return a user's own info (including posts).
    - REQUIRES TOKEN AUTHORIZATION PLUS VALIDATION. 

api/v1/users/status/
- GET will return a user's email and validated status.
    - REQUIRES TOKEN AUTHORIZATION.

api/v1/users/validation/<str:validation_key>/
- PUT will validate and activate the account associated with the given validation key.

api/v1/users/resend/
- POST will attempt to send a validation email to the user, automatically updating the account validation key of the user
    - REQUIRES TOKEN AUTHORIZATION.

api/v1/users/signup/
- POST will sign up a user and send a validation email. 
    - Request body must contain a username and password field. 
    - Response will be username and a message to check email.

api/v1/users/login/
- POST will log in a user. 
    - Request body must contain a username and password field. 
    - Response will be username and token.

api/v1/users/logout/
- POST will log out a user. 
    - REQUIRES TOKEN AUTHORIZATION. 
    - Deletes auth token.

api/v1/users/admin-signup/
- POST will sign up an admin user and send a validation email. 
    - Request body must contain a username and password field. 
    - Response will be username and token.
    - UNPROTECTED ENDPOINT AT THE MOMENT FOR DEV PURPOSES; THIS MUST CHANGE IN THE FUTURE!!!

api/v1/users/reset-email/
- POST will send password reset email
    - Request body must contain a registered email address
    - No email sent if email is not registered

api/v1/users/reset-password/<reset_token>/
- PUT will reset password
    - password must be in body of request

-----------------------------------------------------------------------

api/v1/posts/
- GET will return all posts.
    - REQUIRES TOKEN AUTHORIZATION.
- POST will add a post.
    - REQUIRES TOKEN AUTHORIZATION.
    - This post automatically belongs to the user who posted it.
    - Request body must contain text and website URL.

api/v1/posts/<int:postid>/
- GET will return the specified post and its information.
    - REQUIRES TOKEN AUTHORIZATION.
- DELETE will delete the specified post.
    - Users can only delete their own posts.
    - Admins can delete any post.
    - REQUIRES TOKEN AUTHORIZATION.

api/v1/posts/<int:postid>/<str:vote>/
- PUT will update the list of upvoters and downvoters for a given post.
    - The only accepted strings are 'upvote', 'downvote', and 'abstain'.
    - REQUIRES TOKEN AUTHORIZATION.

api/v1/posts/bywebsite/
- POST will list out all the websites matching the URL provided in the body
    - A little awkward to use post here. Doing this because the parameter (a URL) is too complex to include in a get request endpoint
    - REQUIRES TOKEN AUTHORIZATION.
- DELETE removes all post associted with the website
    - ADMIN access only, so REQUIRES TOKEN AUTHORIZATION.

api/v1/posts/byvote/<str:up_or_down>/
- GET will return a list of posts that the user has either upvoted or downvoted (parameter chooses which list)
- REQUIRES TOKEN AUTHORIZATION PLUS EMAIL VALIDATION.


Good to know...
Pythonanywhere has a persistent environment, so db.sqlite3 won't get blown out
(from https://www.pythonanywhere.com/forums/topic/1847/)


------------------------------------------------------------------------------

How the frontend login/signup works:
- On a new page/refresh, if a user's token is currently stored in an HTTPOnlyCookie, log this user in automatically
- Sign up 
    - Logs in a user to a deactivated account and displays a message to check email
    - Sends sign up email
    - After validation, upon page refresh OR inputting details into Log In page, user will be signed in
    - Refresh unvalidated email message page to see login message about unvalidated email
    - Clicking back will log out of unvalidated account
    - possible errors:
        - Email already in use for another account
        - Username already in use
        - Improper email format (for those that edit HTML)
        - Network error
        - There is a catchall system to display rarer errors
- Log in
    - Logging in an activated user takes them to their account's homepage / with refreshing stays logged in
    - Logging in a deactivated user takes them to deactivated email message / refreshing takes them back to this message
    - Clicking back will log out of unvalidated account
    - possible errors:
        - No matching user credentials
        - Network error
        - There is a catchall system to display rarer errors 
- Back button sets user to null and clears errors and logs user out if possible

- Whenever the loginError has to do with email validation, display a button that will resend the validation email
    - Disable the send email button until a response from the backend comes
    - when this button is clicked, display a few messages depending on the backend response
        - email sent successfully
        - error sending email
        - network error (if cannot connect to backend at all)
        - there is a catchall system in place to display any other rarer errors
- Email activation links expire after 100 seconds


THINGS TO CONSIDER:
- cleaning up console.logs
- consider differences between webpage network vs chrome extension network
- separate password reset token/expiration? is this needed?

-----------------------------------------------------------------------------------

MORE THINGS TO CONSIDER:
- Add a way to disallow posting on pages where chrome cannot find a URL (only show AddPostPage when URL is set?)
- Make sure to set the cookies to 'Strict' to limit CSRF attack vulnerability when using as chrome extension
- Add shorthand displays to indicate especially large upvote/downvote numbers
- capitalization in username
- Add a title field to posts?
- ensure no weirdness happens upon signup when network isn't working well


