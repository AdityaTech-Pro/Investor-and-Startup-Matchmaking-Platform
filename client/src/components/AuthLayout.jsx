import React from 'react'
import assets from '../assets/assets'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-cover bg-center blur-sm brightness-75"
      ></div>

      {/* Foreground Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col px-4 py-10">
        {/* Left Side – Logo */}
        <img src={assets.logo} alt="Logo" className="w-[min(30vw,250px)]" />

        {/* Right Side – Auth Form */}
        <div className="border-2 bg-white/10 backdrop-blur-2xl text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout