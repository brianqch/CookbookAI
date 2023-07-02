const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const app = express();
const uri = process.env.MONGO_CONNECTION_STRING;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");
    } catch(error) {
        console.error(error);
    }
}

connect();

app.listen(8000, () => {
    console.log("Server started on port 8000.");
})
app.use(express.json());
app.use(cors());

// Schema for users of app
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const FavoriteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    recipeTitle: {
        type: String,
        required: true,
    },
    recipeText: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('Users', UserSchema);
User.createIndexes();

const Favorite = mongoose.model('Favorites', FavoriteSchema);
Favorite.createIndexes();

app.post("/loadOrCreateUser", async (req, res) => {
    try {
        const user = await User.find({"userId": req.body.userId});
        if (user.length > 0) {
            res.send(user);
            console.log("User exists in database");
        } else {
            console.log(req.body);
            const newUser = new User(req.body);
            let result = await newUser.save();
            result = result.toObject();
            if (result) {
                delete result.password;
                res.send(req.body);
                console.log("New User created");
            }
        }
    } catch (e) {
        res.send("Something went wrong");
        console.log(e);
    }
});

app.post("/createFavorite", async (req, res) => {
    try {
        const newFavorite = new Favorite(req.body);
        let result = await newFavorite.save();
        result = result.toObject();
        if (result) {
            res.send(req.body);
            console.log("New favorite added");
        }
    } catch (e) {
        res.send("Unable to add new favorite.");
        console.log(e);
    }

});

app.get("/getFavorites", async (req, res) => {
    try {
        const user = await Favorite.find({"userId": req.query.userId});
        res.send(user);
    } catch(e) {
        console.error(e);
    }
});

app.delete("/deleteFavorite", async (req, res) => {
    console.log(req.body);
    try {
        const result = await Favorite.deleteOne({"_id": req.body});
        res.send(result);
    } catch (e) {
        res.send("Unable to delete favorite.");
        console.log(e);
    }
})


// Open AI API Section

const openaiapikey = process.env.OPENAIAPIKEY;

const config = new Configuration({
    apiKey: openaiapikey,
})

const openai = new OpenAIApi(config);

// Endpoint for Chat GPT
app.post("/chat", async (req, res) => {

    const { prompt } = req.body;

    console.log(req.body);

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 512,
        temperature: 0,
        prompt: prompt,
    });

    console.log(completion.data.choices[0].text);

    res.send(completion.data.choices[0].text);
})
