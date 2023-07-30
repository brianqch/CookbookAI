# CookbookAI

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<br/>

<!-- ABOUT THE PROJECT -->
## About The Project

I built this project with one goal in mind—to finally make use of those random ingredients I have in the refrigerator! As college students, my friends and I found it a bit difficult to cook at home with our busy schedules. Using some languages and frameworks I learned over the summer, I decided to create this AI powered recipe generator for quick and easy meal ideas!

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* MongoDB
* Express.js
* React.js
* Node.js
* Auth0

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

1. Get domain, client_id, and secret Auth0 keys at [https://auth0.com/](https://auth0.com/), a MongoDB connection string at [https://mongodb.com](https://mongodb.com), and an OpenAI API key at [https://openai.com/blog/openai-api](https://openai.com/blog/openai-api).
2. Clone the repo
   ```sh
   git clone https://github.com/brianqch/CookbookAI.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in the `.env` files in both the client and server folders.

* client
   ```
   REACT_APP_AUTH0_DOMAIN=YOUR_DOMAIN_HERE
   REACT_APP_AUTH0_CLIENT_ID=YOUR_CLIENT_ID_HERE
   REACT_APP_AUTH0_SECRET=YOUR_SECRET_HERE
   ```
* server
   ```
   MONGO_CONNECTION_STRING=YOUR_STRING_HERE
   OPENAIAPIKEY=YOUR_KEY_HERE
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Here are some examples of the app!


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Features -->
## Features

- Generate a recipe given main ingredients, any preferences, and pantry items.
- Keep track of your favorite recipes in the Favorites section.
- Edit and search for your favorite recipes.
- Add any pantry items you have that can potentially be used in your recipe.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Brian Quach - brianquach@berkeley.edu

Project Link: [https://github.com/brianqch/CookbookAI](https://github.com/brianqch/CookbookAI)

<p align="right">(<a href="#readme-top">back to top</a>)</p>