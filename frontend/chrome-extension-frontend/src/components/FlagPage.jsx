import { useEffect, useState, useContext } from "react";
import { api } from "../utilities";
import UserContext from "../contexts/UserContext.jsx";

// In the future this page will be like the home page for logged in users. Keep in mind that setting the errorScreen to something non-empty 
export default function AddPostPage({ setFlaggedPostID, post_id }) {
    const { setErrorScreen } = useContext(UserContext)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [flagErrorMessage, setFlagErrorMessage] = useState('')
    const [reason, setReason] = useState('')
    const [inaccurate, setInaccurate] = useState(false)
    const [vulgarity, setVulgarity] = useState(false)
    const [hateSpeech, setHateSpeech] = useState(false)
    const [bullying, setBullying] = useState(false)
    const [maliciousURL, setMaliciousURL] = useState(false)
    


    function submitClicked(e) {
        setSubmitLoading(true)
        e.preventDefault();
        async function flagAPICall() {
            // Ensure populated fields and text input length

            if (reason.length > 150) {
                setFlagErrorMessage('Text length exceeded')
                setSubmitLoading(false)
                return
            }

            setFlagErrorMessage('')
            try {
                const body = {
                    "reason": reason,
                    "inaccurate": inaccurate,
                    "vulgarity": vulgarity,
                    "hate_speech": hateSpeech,
                    "bullying": bullying,
                    "maliciousURL": maliciousURL,
                    "post": post_id,
                }
                const response = await api.post(`flags/`, body);
                console.log(response)
                // Go back to posts page
                setFlaggedPostID(null)
            } 
            catch (err) {
                console.log(err)
                // console.log(err)
                if (err.message.includes('400')) {
                    // Validation error (text length, invalid url, can only post once)
                    setFlagErrorMessage(err.response.data.message)
                } else {
                    // Likely network error message
                    setErrorScreen(err.message)
                }
                setSubmitLoading(false)
                return
            } 
        }
        flagAPICall();
    }

    return (
        <>
            <header onClick={() => setFlaggedPostID(null)} className="title-holder">
                <button className="back menu">←</button>
            </header>
            <div className="center-container">
                <form onSubmit={(e) => submitClicked(e)} className="form-container">
                    <h2>Flag this GutCheck</h2>
                    <div className="checkboxes-container">
                        <div className="checkbox-display">
                            <input type="checkbox" onChange={(e) => setInaccurate(e.target.checked)} />
                            <p>Inaccurate</p>
                        </div>
                        <div className="checkbox-display">
                            <input type="checkbox" onChange={(e) => setVulgarity(e.target.checked)} />
                            <p>Vulgarity</p>
                        </div>
                        <div className="checkbox-display">
                            <input type="checkbox" onChange={(e) => setHateSpeech(e.target.checked)} />
                            <p>Hate Speech</p>
                        </div>
                        <div className="checkbox-display">
                            <input type="checkbox" onChange={(e) => setBullying(e.target.checked)} />
                            <p>Bullying</p>
                        </div>
                        <div className="checkbox-display">
                            <input type="checkbox" onChange={(e) => setMaliciousURL(e.target.checked)} />
                            <p>Malicious Footnote URL</p>
                        </div>
                    </div>
                    <div className="textarea-container">
                        <textarea 
                            rows="3" 
                            cols="43" 
                            disabled={submitLoading}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Anything else you would like to say?" 
                        />
                        <p className={reason.length <= 150 ? "char-counter" : "char-counter-error"}>{reason.length}/150 characters</p>
                    </div>
                    <p className="input-error-message"> { flagErrorMessage }</p>
                    <input type="submit" className="submit-button" disabled={submitLoading} value="Submit" />
                </form> 
            </div>
        </>
    )
}
