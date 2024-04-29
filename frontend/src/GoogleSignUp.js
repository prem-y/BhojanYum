import React from 'react'
import { useState } from "react";
import {useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
const GoogleSignUp = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    const login = useGoogleLogin({
        onSuccess: (codeResponse) =>{
            setUser(codeResponse);
        },
        onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
                
                
            }
        },
        [ user ]
    );
    
    return (
        <>
            <div className='flex flex-col items-center'>
            <div className='h-auto w-80 bg-blue-300 mt-60 p-10 flex flex-col items-center rounded'>
            <h2>Welcome to BhojanYum!</h2>
            <br />
            <br />
            {profile.name? (
                navigate('/', {state: profile}),
                <div className='text-center'>You have already Logged in as {profile.name}</div>
                
            ) : (
                <button onClick={login} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm'>Sign in with Google 🚀 </button>
            )}
        </div>
            </div>
          
        </>
    )
}

export default GoogleSignUp