import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import GoogleSignUp from './GoogleSignUp';
import Home from './Home';
function App() {
    return (
        <>
            <BrowserRouter>
            <Routes>
                <Route path='/' element={<GoogleSignUp/>}/>
                <Route path='/home' element={<Home/>}/>
            </Routes>
            </BrowserRouter>
        </>
    )
}
export default App;