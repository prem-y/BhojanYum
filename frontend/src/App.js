import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import GoogleSignUp from './GoogleSignUp';
import Home from './Home';
import Profilepage from './Profilepage';
import Cart from './Cart';
function App() {
    return (
        <>
            <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/signin' element={<GoogleSignUp/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/profile' element={<Profilepage/>}/>
            </Routes>
            </BrowserRouter>
        </>
    )
}
export default App;