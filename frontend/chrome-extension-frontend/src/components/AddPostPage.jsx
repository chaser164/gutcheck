import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function AddPostPage({ setShowAddPostPage, url }) {
    const { setErrorScreen } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [postErrorMessage, setPostErrorMessage] = useState('')
    const [footnoteDisplayCount, setFootnoteDisplayCount] = useState(0)
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

    // Increase count of viewable footnote fields (max 2)
    function incrFootnoteDisplay() {
        if (0 <= footnoteDisplayCount && footnoteDisplayCount < 2)
            setFootnoteDisplayCount((prev) => prev + 1)
    }

    return (
        <>
            <header onClick={() => setShowAddPostPage(false)} className="title-holder">
                <button className="back menu">←</button>
            </header>
            <div className="center-container">
                <form onSubmit={(e) => postClicked(e)} className="form-container">
                    <h2>Make a Post</h2>
                    <div className="textarea-container">
                        <textarea 
                            rows="6" 
                            cols="36" 
                            disabled={submitLoading}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Your report's body text goes here..." 
                        />
                        <p className={text.length <= 150 ? "char-counter" : "char-counter-error"}>{text.length}/150 characters</p>
                    </div>
                    <button type="button" disabled={footnoteDisplayCount >= 2} className="menu footnote-button" onClick={incrFootnoteDisplay}>Footnote +</button>
                    {/* <input
                    type="text"
                    value={text}
                    /> */}
                    <input type="submit" className="submit-button" disabled={submitLoading} value="Post" />
                </form> 
                <p>{ postErrorMessage }</p>
            </div>
        </>
    )
}
