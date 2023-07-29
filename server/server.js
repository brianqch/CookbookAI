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

// Schema for Users
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

// Schema for Favorites
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
    currentDate: {
        type: String,
        required: true,
    }
});

// Schema for PantryItems
const PantryItemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    pantryItem: {
        type: String,
        required: true,
    }
})

const User = mongoose.model('Users', UserSchema);
User.createIndexes();

const Favorite = mongoose.model('Favorites', FavoriteSchema);
Favorite.createIndexes();

const PantryItem = mongoose.model('PantryItem', PantryItemSchema);
PantryItem.createIndexes();

// USER SECTION ---------------------------------------------------->

// Loads the user's information or creates a new user with userId.
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

// FAVORITES SECTION ----------------------------------------------->

// Stores a new favorite in the database with the given information.
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

// Retrieves all favorites from database with given userid.
app.get("/getFavorites", async (req, res) => {
    try {
        const favorites = await Favorite.find({"userId": req.query.userId});
        res.send(favorites);
    } catch(e) {
        console.error(e);
    }
});

// Deletes the specified favorite with given Id.
app.delete("/deleteFavorite", async (req, res) => {
    console.log(req.body);
    try {
        const favorites = await Favorite.deleteOne({"_id": req.body});
        res.send(favorites);
    } catch (e) {
        res.send("Unable to delete favorite.");
        console.log(e);
    }
});

// Retrieves favorites from database with given userId and ingredients.
app.get("/getFavoritesByIngredient", async (req, res) => {
    try {
        const favorites = await Favorite.find(
            {"$and": [
                {"userId": req.query.userId}, 
                {"recipeText": {$regex: req.query.ingredient, $options: "i"}}
            ]}
        )
        res.send(favorites);
    } catch (e) {
        console.error(e);
    }
});

// Saves any changes of specified favorite with given Id.
app.put("/saveEdits", async (req, res) => {
    console.log(req.body);
    try {
        const result = await Favorite.updateOne(
            {
                "_id": req.body.userId
            },
            {
                $set:{
                    recipeTitle: req.body.recipeTitle,
                    recipeText: req.body.recipeText
                }
            }
         )
    } catch (e) {
        res.send("Unable to save changes.");
        console.log(e);
    }
})

// PANTRY SECTION -------------------------------------------------->

// Retrieves all the pantry items from database.
app.get("/getPantryItems", async (req, res) => {
    try {
        const user = await PantryItem.find({"userId": req.query.userId});
        res.send(user);
    } catch(e) {
        console.error(e);
    }
});

// Stores a new pantry item with the given information.
app.post("/createPantryItem", async (req, res) => {
    try {
        const newPantryItem = new PantryItem(req.body);
        let result = await newPantryItem.save();
        result = result.toObject();
        if (result) {
            res.send(req.body);
            console.log("New pantry item added");
        }
    } catch (e) {
        res.send("Unable to add new pantry item.");
        console.log(e);
    }
})

// Deletes the specified pantry item with Id.
app.delete("/deletePantryItem", async (req, res) => {
    console.log(req.body);
    try {
        const result = await PantryItem.deleteOne({"_id": req.body});
        res.send(result);
    } catch (e) {
        res.send("Unable to delete pantryItem.");
        console.log(e);
    }
});


// PANTRY SECTION -------------------------------------------------->

const openaiapikey = process.env.OPENAIAPIKEY;

const config = new Configuration({
    apiKey: openaiapikey,
})

const openai = new OpenAIApi(config);

// Takes in the prompt with user's main ingredients, preferences, and pantry items and returns a completed recipe.
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
