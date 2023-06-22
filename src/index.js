import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';

import App from "./routes/App";
import "./index.css";


const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const secret = process.env.REACT_APP_AUTH0_SECRET;

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      secret={secret}
      authorizationParams={{
        redirect_uri: 'http://localhost:3000/home'
    }}
    >

      <App/>
    </Auth0Provider>
  </React.StrictMode>
)