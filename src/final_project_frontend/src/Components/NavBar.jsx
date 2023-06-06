import React from 'react'
import logo from "../../assets/logo.jpg"
const NavBar = () => {
    // Styles
    const container = "z-40 backdrop-blur-2xl p-4 grid place-items-center grid-flow-col shadow-2xl sticky top-0"
    const navBarText = "text-white font-bold font-roboto text-[32px] flex items-center gap-4"
    const logoSection = "grid grid-flow-col auto-cols-max gap-4"
    return (
        <div className={container}>
            <div className={logoSection}>
                <div className={navBarText}>
                    <img className="w-10 h-10 bg-blend-normal" src={logo} alt="logo Img" />
                    <div className={navBarText}>ChainCortex</div>
                </div>
            </div>
            <h1 className={navBarText}>Welcome!</h1>
        </div>
    )
}

export default NavBar
