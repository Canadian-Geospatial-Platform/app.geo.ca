import './dispatch/dispatchsignin.scss'
import React, { useEffect } from "react";
import { requireLogin } from './utils/authorization';

export default function TestPage(): JSX.Element {
  useEffect(() => {
    const fetchData = async () => {
      await requireLogin(window.location.origin + '/receivesignin', window.location.href);
    }
    fetchData()
  }, [requireLogin]);


  return <h1 className="sign-in">Wlecome to the test page. Please wait while you are being redirected to the sign-in page.</h1>;
}
