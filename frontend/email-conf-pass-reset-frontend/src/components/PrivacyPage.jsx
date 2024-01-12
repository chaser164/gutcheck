import { Link } from "react-router-dom";

export default function PrivacyPage() {

    return (
      <>
        <h2>Privacy Policy</h2>
        <br />
        <div className="body-text">
            <i>Last updated January 12, 2024</i>
            <br />
            <h3>Introduction</h3>
            <p>
                This privacy statement explains how the sole creator and proprietor
                of GutCheck ("I") collects and manages the data belonging to the user ("you"). There are 2 products related to GutCheck: 
                the GutCheck Google Chrome browser extension ("the extension"), and the GutCheck
                website hosted at https://gutcheck-extension.netlify.app/ ("the website"). 
                <br /> 
                <br />
                Although the extension may contain links to other websites in the contents of users' posts, please 
                note that I do not own or operate these websites, and you are responsible for familiarizing
                yourself with their respective privacy policies.
            </p>
            <br />
            <h3>The data I collect and why</h3>
            <i>Personal Information</i>
            <p>
                I collect users' email, username, and password. Usernames are used both for the login process and 
                as a public identifier, and email and password are used purely to aid the login process.
                I require your username as a public identifier. I require an email to verify
                your account with a confirmation email to limit users with bad intentions creating spam accounts. 
                Your email is also used in password recovery scenarios. Outside of these scenarios you will not 
                receive emails from the GutCheck extension. I require your password to verify login attempts.
                An encryption of your password is stored in the database.
            </p>
            <i>Post Contents</i>
            <p>
                I necessarily collect the URL, body text, footnote links, footnote explanations, and latest timestamp of each
                user post you make in order to display user posts. Only the websites you make a post on are saved in the database. In this sense, you choose
                when your browser activity is documented by the extension.
            </p>
            <i>Flags</i>
            <p>
                I collect any flags a user creates. This entails the reason for flagging (Inaccurate, Vulgarity, Hate Speech, Bullying, Malicious Footnote URL) 
                and auxiliary explanations. Flags will be reviewed against the <Link to={'/community'} >community guidelines</Link> in a timely manner
                and then deleted, and the posts of issue will be handled accordingly. I collect flags in order to uphold <Link to={'/community'} >community guidelines</Link>.
            </p>
            <i>Other Account Information</i>
            <p>
                I collect the posts users have upvoted/downvoted in order to keep track of post vote totals and display totals to the public.
                <br />
                <br />
                I collect your notification settings, as in your preference for whether or not you would like to receive alerts
                whenever a website has associated posts.
                <br />
                <br />
                I collect server logs of users accessing the extension's server. You may think of this as your extension use history.
                Server logs do not divulge any data about posts, flags, or user information, only an overview of the nature of a user's actions.
                I collect this information for debugging and security purposes.
            </p>
            <br />
            <h3>How I disclose your data</h3>
            <p>There are 2 sorts of data to discuss: data intended for public engagement, and private data. The data intended for
                public engagement is your username and all post contents (URL, body text, footnote links, footnote explanations, and latest timestamp). 
                All other data (email, password, all flag content, upvote/downvote history, account settings, server logs) is private data.
                <br />
                <br />
                Only the data intended for public engagement will be voluntarily disclosed to the public. Specifically, your 
                username and all post contents will be shared with all GutCheck users as they encounter
                your posts.
                <br />
                <br />
                All private data will not be voluntarily shared with anyone, including GutCheck users and any third parties.
            </p>
            <br />
            <h3>How is your data stored?</h3>
            <p>
                I care about protecting your privacy. Your data is transferred securely, and I am dedicated to storing 
                and protecting your data from any harm. I take such measures as limiting access and encryption.

                Despite my best efforts, I unfortunately cannot guarantee the protection of your data from hackers,
                and so I must inform you that you provide the extension with your data at your own risk. 

            </p>
            <h3>How long is your data stored?</h3>
            <p>
                Except for the server logs which I will never voluntarily disclose to anyone,
                you have control over your data's longevity. Users may choose to delete posts or their account as a whole. 
                Deleting posts removes all information associated with the post (body text, footnotes/footnote explanations, and flags).
                Deleting an account removes all information associated with the account (username, email, password, all posts and post contents,
                all flags made by the user).
                <br />
                <br />
                server logs will be stored indefinitely in the database.
            </p>
            <br />
            <br />
            <br />
            <p>
                The use of your data will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
            </p>
        </div>
      </>
    );
  }
  