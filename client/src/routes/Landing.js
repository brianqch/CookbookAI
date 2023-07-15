import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import "./Landing.css";


function Landing() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    return (
        !isAuthenticated && (
            <motion.div
                className="container text-center  bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="100vw" height="200vh" viewBox="0 0 100vw 200vh" fill="none" className="landing-background-svg" preserveAspectRatio="none">
                    <path d="M0 0L2250 0L2250 1861.01C2250 1861.01 1905.5 1632.02 1125 1861.01C344.5 2090 1.3448e-05 1861.01 1.3448e-05 1861.01L0 0Z" fill="url(#paint0_linear_65_399)"/>
                    <defs>
                    <linearGradient id="paint0_linear_65_399" x1="100vh" y1="0" x2="100vw" y2="100vw" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFF3D3"/>
                        <stop offset="1" stop-color="white" stop-opacity="0"/>
                    </linearGradient>
                    </defs>
                </svg>
                <header className="landing-header-container">
                    <h2 className="landing-header-title">Cookbook.ai</h2> 
                </header>
                <section className="landing-hero-section">
                    <h1>The ultimate AI cooking assistant.</h1>
                    <h6>Delicious recipes in a matter of minutes.</h6>
                    <button className="landing-hero-button">Get cooking</button>
                    <div className="landing-food-container">
                        {/* Add images later */}
                    </div>
                    <span className="landing-food-container-outline"></span>
                </section>
                <section className="landing-how-section">

                </section>
            </motion.div>
        )
    )
}

export default Landing;