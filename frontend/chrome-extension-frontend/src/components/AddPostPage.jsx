import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function AddPostPage({ setShowAddPostPage, url }) {
    const { setErrorScreen } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [postErrorMessage, setPostErrorMessage] = useState('')
    const [text, setText] = useState('')


    function postClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        async function postAPICall() {
            // Ensure populated fields
            if (!text) {
                setPostErrorMessage('Fields cannot be empty')
                setSubmitLoading(false)
                return
            }

            setPostErrorMessage('')
            try {
                const response = await api.post(`posts/`, {
                    "text": text,
                    "website": url
                });
                // Go back to posts page
                setShowAddPostPage(false)
            } 
            catch (err) {
                // console.log(err)
                if (err.message.includes('400')) {
                    // Validation error (text length, invalid url, can only post once)
                    setPostErrorMessage(err.response.data.message[0][1])
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                setSubmitLoading(false)
                return
            } 
        }
        postAPICall();
    }

    return (
        <>
        <form onSubmit={(e) => postClicked(e)}>
            <h5>Make a post</h5>
            <input
            type="text"
            value={text}
            disabled={submitLoading}
            onChange={(e) => setText(e.target.value)}
            />
            <input type="submit" disabled={submitLoading} value="post" />
        </form> 
        <p>{ postErrorMessage }</p>
        <button onClick={() => setShowAddPostPage(false)}>Back</button>
        </>
    )
}
