import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Landing from "./Landing";
import Main from "./Main";
import Pantry from "./Pantry";
import { AnimatePresence } from "framer-motion/dist/framer-motion";


function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={isAuthenticated && <Main />} />
        <Route path="/pantry" element={isAuthenticated && <Pantry/>} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;