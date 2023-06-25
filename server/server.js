const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();


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
    favorites: {
        type: Array,
        default: [],
    }
});

const User = mongoose.model('Users', UserSchema);
User.createIndexes();

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

app.get("/getFavorites", async (req, res) => {
    try {
        const user = await User.find({"userId": req.query.userId});
        res.send(user);
    } catch(e) {
        console.error(e);
    }
});
