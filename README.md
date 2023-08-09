What happens at each endpoint:

api/v1/users/
- GET will return a list of all users and their info 
    - page is only accessible to ADMIN users, so REQUIRES TOKEN AUTHORIZATION.

api/v1/users/<int:userid>/
- GET will return the specified user and their info 
    - page is only accessible to ADMIN users (unless viewing your own profile), so REQUIRES TOKEN AUTHORIZATION.
- DELETE will delete the specified user 
    - page is only accessible to ADMIN users, so REQUIRES TOKEN AUTHORIZATION.
    - prevents self-deletion.
    - CONSIDER (NOT IMPLEMENTED YET): allow any user to delete themself (and thus log themself out)? Probably should do this...

api/v1/users/me/
- GET will return a user's own info.
    - REQUIRES TOKEN AUTHORIZATION. 

api/v1/users/validation/<str:validation_key>/
- PUT will validate and activate the account associated with the given validation key.

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



Good to know...
Pythonanywhere has a persistent environment, so db.sqlite3 won't get blown out
(from https://www.pythonanywhere.com/forums/topic/1847/)


------------------------------------------------------------------------------

How the frontend login/signup works:
- On a new page/refresh, if an activated user's token is currently stored in an HTTPOnlyCookie, log this user in automatically
- Sign up 
    - Logs in a user to a deactivated account and displays a message to check email
    - Sends sign up email
    - After validation, upon page refresh OR inputting details into Log In page, user will be signed in
    - User cannot log out until cookie expiration as a deactivated user
    - possible errors:
        - Email already in use for another account
        - Improper email format (for those that edit HTML)
        - Network error
        - There is a catchall system to display rarer errors
- Log in
    - Logging in an activated user takes them to their account's homepage
    - possible errors:
        - No matching user credentials
        - Network error
        - There is a catchall system to display rarer errors 
- Back button sets user to null and clears errors and tries logging out any user


THINGS TO CONSIDER:
- should the back button be able to logout unvalidated users? 
- when deactivated users refresh, should the page open with check email message?
- Consider logging out without a network connection...

