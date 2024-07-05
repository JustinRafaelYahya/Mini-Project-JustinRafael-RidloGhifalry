import React from 'react'
import { useState } from 'react';
import MainButton from './MainButton';

const LoginMainPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
    <div className="py-[4rem] mx-auto px-12 bg-white max-w-[1400px] h-screen">
    <h2 className="flex justify-center text-3xl font-bold md:px-8 mt-16 mb-8">
          Login Page
        </h2>
        <div className='flex justify-center my-6'>
        <input
        type="text"
        className='w-2/6 p-4 border border-slate-100 rounded-xl'
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
        </div>
        <div className='flex justify-center my-6'>
        <input
        type="password"
        className='w-2/6 p-4 border border-slate-100 rounded-xl'
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
        </div>
        <div className='flex justify-center'>
      <MainButton className="w-1/5">Log In</MainButton></div>
    </div>
  )
}

export default LoginMainPage