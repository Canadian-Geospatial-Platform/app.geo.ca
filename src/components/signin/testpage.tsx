import './dispatch/dispatchsignin.scss'
import React, { useEffect, useState } from "react";
import { getAccessToken, requireLogin } from './utils/authorization';

export default function TestPage(): JSX.Element {
    const [x, set_x] = useState("initial value");
    const onClickFunction = () => {
        let x =getAccessToken()
        console.log("on click function callled!", getAccessToken())
        if (x) {set_x(x)}
    }
    useEffect(() => {
        const fetchData = async () => {
            await requireLogin(window.location.origin + '/receivesignin', window.location.href);
        }
        fetchData()
    }, [requireLogin]);


    return <div>
        <h1 className="sign-in">Welcome to the test page. Please wait while you are being redirected to the sign-in page.</h1>
        <button onClick={onClickFunction}>a button</button>
        <p>The athorization token is: {x}</p>
    </div>
}
