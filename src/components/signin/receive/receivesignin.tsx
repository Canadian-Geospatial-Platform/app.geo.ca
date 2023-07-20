import './receivesignin.scss'
import React, { useEffect } from "react";
import { signIn } from '../utils/authorization';
export default function ReceiveSignIn(): JSX.Element {
    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop: string) => searchParams.get(prop),
        }) as URLSearchParams & {state: string | null, code: string | null} ;
        let stateOrNull = params.state;
        let state = stateOrNull?stateOrNull:'/';
        let code = params.code;
        const executeSignIn = async (code: string | null, state: string) => {
         if(code == null) 
        {
            console.error("code is null in receivesignin.")
            return;
        }
           await signIn(code, 'http://localhost:8080/receivesignin', state);
        }
        executeSignIn(code, state)

    }, []);

    return <h1 className="receivesignin">Signing in... Please wait while you are being redirected.</h1>;
}
