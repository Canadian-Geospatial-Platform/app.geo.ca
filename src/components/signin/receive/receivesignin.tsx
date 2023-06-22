import './receivesignin.scss'
import React, { useEffect } from "react";
import { getToken, signIn } from '../utils/authorization';
export default function ReceiveSignIn(): JSX.Element {
       useEffect(() => {
    
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let state = params.state; 
    let code = params.code;
    const executeSignIn = async () => {
        console.log("token is:\n", getToken())
    if (!getToken()) await signIn(code, 'http://localhost:8080/receivesignin', state);
    }
    executeSignIn()
 
  }, []);
  
    return <h1 className="receivesignin">Receiving sign in.</h1>;
}
