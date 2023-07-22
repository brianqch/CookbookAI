import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from "framer-motion/dist/framer-motion";
import "./Landing.css";

// Landing component that contains the landing page for the app. Sets up user authentication.
function Landing() {
    const { loginWithRedirect } = useAuth0();
    return (
        <motion.div
        className="container text-center  bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}>

            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200vh" viewBox="0 0 100% 200vh" fill="none" className="background-svg" preserveAspectRatio="none">
                <path d="M0 0L2250 0L2250 1861.01C2250 1861.01 1905.5 1632.02 1125 1861.01C344.5 2090 1.3448e-05 1861.01 1.3448e-05 1861.01L0 0Z" fill="url(#paint0_linear_65_399)"/>
                <defs>
                <linearGradient id="paint0_linear_65_399" x1="100vh" y1="0" x2="100vw" y2="100vw" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF3D3"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                </defs>
            </svg>
            <header className="header-container">
                <h2 className="header-title">Cookbook.ai</h2> 
            </header>
            <section className="landing-hero-section">
                <h1>The ultimate AI cooking assistant.</h1>
                <h6>Delicious recipes in a matter of minutes.</h6>
                <button className="landing-hero-button" onClick={loginWithRedirect}> Get cooking</button>
                <div className="landing-food-container">
                    {/* Add images later */}
                </div>
                <span className="landing-food-container-outline"></span>
            </section>
            <section className="landing-how-section">
                <div className="landing-how-image-text">
                    <img className="landing-how-image" src="/assets/its_simple_img.png" alt="main input image"></img>
                    <div className="how-right-heading-caption-container">
                        <h2 className="landing-how-heading">It's simple.</h2>
                        <p className="landing-how-caption">Just put in your ingredients and time you have to cook.</p>
                    </div>
                </div>
                <div className="landing-how-text-image">
                    <div className="how-left-heading-caption-container">
                        <h2 className="landing-how-heading">It's fast.</h2>
                        <p className="landing-how-caption">Have recipes ready in less than one minute with the power of AI.</p>
                    </div>
                    <img className="landing-how-image" src="/assets/its_fast_img.png" alt="Image here"></img>
                </div>
                <div className="landing-how-image-text">
                    <img className="landing-how-image" src="/assets/its_personal_img.png" alt="Image here"></img>
                    <div className="how-right-heading-caption-container">
                        <h2 className="landing-how-heading">It's personal.</h2>
                        <p className="landing-how-caption">Keep track of past recipes and access your favorites easily.</p>
                    </div>
                </div>
            </section>

        </motion.div>
    )
}

export default Landing;