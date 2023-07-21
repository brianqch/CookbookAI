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
    currentDate: {
        type: String,
        required: true,
    }
});

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

// Favorites Section
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
});

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

// Pantry Item Section
app.get("/getPantryItems", async (req, res) => {
    try {
        const user = await PantryItem.find({"userId": req.query.userId});
        res.send(user);
    } catch(e) {
        console.error(e);
    }
});

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


// Open AI API Section

const openaiapikey = process.env.OPENAIAPIKEY;

const config = new Configuration({
    apiKey: openaiapikey,
})

const openai = new OpenAIApi(config);

const loremIpmsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n Etiam pellentesque eu lacus in bibendum. In tellus enim, ultrices sit amet nisi ac, finibus ullamcorper ex. Fusce facilisis nisi felis, vel pretium libero varius finibus. Mauris ut luctus ante. Cras interdum ipsum felis. Sed accumsan, metus a gravida bibendum, dolor orci ultrices enim, nec pretium nulla massa et velit. Vestibulum hendrerit dui id libero tincidunt vulputate. Nulla facilisi. Maecenas suscipit fermentum lorem, eget porta elit accumsan sed. Sed laoreet massa lorem, in tempus lacus tincidunt in. Praesent elit massa, consequat at mi sit amet, rutrum fermentum nisi. Donec sagittis lectus feugiat elit finibus, ultricies sodales mauris fringilla. Suspendisse viverra dolor ut tortor consectetur, sed tempus sem dictum. Donec rhoncus ex eget erat pulvinar, sit amet blandit enim posuere. \n Suspendisse fringilla nulla nisl, eleifend efficitur libero gravida vitae. Suspendisse potenti. Etiam at tincidunt ex. Donec sit amet quam eu velit tempus varius. Donec auctor eu eros vitae ornare. Cras a eleifend orci. Mauris a eros congue, cursus lorem quis, auctor sapien. Etiam non ex quis nisi consectetur pulvinar quis ac nulla. Sed varius sapien quam, in blandit urna lobortis bibendum. Nulla sit amet eros nec arcu tincidunt iaculis. Sed dictum imperdiet eros. \n Proin ultricies justo at enim iaculis fermentum pulvinar sit amet ex. Vivamus faucibus ultricies volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In nisi leo, iaculis nec sem eget, faucibus facilisis erat. Etiam cursus elit ut arcu tempus, nec posuere metus accumsan. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam imperdiet placerat massa, ut accumsan tellus consequat ut. Nulla posuere tristique justo et luctus. Suspendisse purus enim, tincidunt et tempus id, placerat sed erat. Integer efficitur mattis interdum. Cras in felis sed enim convallis pellentesque nec sed lorem. Nam quis vulputate arcu. Cras et dapibus tellus. Sed sed sodales arcu. Sed eget magna est. \n Pellentesque eu luctus odio, ut vestibulum arcu. Aliquam erat volutpat. In hac habitasse platea dictumst. Nullam a aliquam nulla, eu auctor ante. Sed ullamcorper euismod ex, nec convallis sem. Quisque ut placerat ligula. Vivamus viverra tincidunt neque sed posuere. Donec lobortis interdum nibh id ultrices. Maecenas nec purus velit. Vestibulum auctor enim arcu, nec bibendum sem luctus eu. Mauris dictum arcu at mi scelerisque ultricies. Nunc bibendum cursus pharetra. Mauris sodales tempus felis eu euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et malesuada lacus, vel tristique leo. Integer tristique sapien non ante consectetur varius. \n Nulla facilisi. Morbi suscipit ante ut euismod rutrum. Duis nisi velit, dictum ac ligula in, viverra pharetra risus. In volutpat purus quis lorem elementum molestie. Suspendisse in justo sit amet ante congue posuere. Nulla eget mauris egestas, volutpat ex vitae, lobortis orci. Suspendisse potenti. Mauris ut elementum elit."

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
    // res.send(loremIpmsum);
})
