import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
const clientId = "775372399424-vujb76qg26ttmh6i0u4l00fhdojen2e6.apps.googleusercontent.com";
const Login = () => {
    const onSuccess = (res) =>{
        console.log("Login Successful! Current user: ",res.profileObj);
      }
      const onFailure = (res) =>{
        console.log("Login Failed! res: ",res);
      }
      return (
        <>
          <div id='signInButton'>
            <GoogleLogin 
              clientId = {clientId}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure = {onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
          </div>
        </>
      );
}

export default Login