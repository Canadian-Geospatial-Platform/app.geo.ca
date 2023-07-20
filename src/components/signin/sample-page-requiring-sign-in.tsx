import './dispatch/dispatchsignin.scss'
import React, { useEffect, useState } from "react";
import { getAccessToken, requireLogin } from './utils/authorization';

export default function SamplePageRequiringSignIn(): JSX.Element {
    const [token, set_token] = useState<null|string>(null);
    const onClickFunction = () => {
        let x = getAccessToken()
        console.log("on click function callled!", getAccessToken())
        if (x) {set_token(x)}
    }
    useEffect(() => {
        const fetchData = async () => {
            await requireLogin(window.location.origin + '/receivesignin', window.location.href);
        }
        fetchData()
    }, [requireLogin]);

    let TokenHtml = <button onClick={onClickFunction}>Click here to display the authorization token.</button>
    
    if (token) {TokenHtml = <p>The athorization token is: {token}</p>}

    return <div>
        <h1 className="sign-in">Welcome to the test page. This page should require login on load. and redirect the user to the sign-in page.</h1>
        {TokenHtml}
    </div>
}
