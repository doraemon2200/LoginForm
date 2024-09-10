var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var dotenv = require("dotenv")

const app = express()
dotenv.config();

const port = process.env.PORT || 5002;


const username = process.env.mongo_user
const password = process.env.mongo_pass
mongoose.connect(`mongodb+srv://${username}:${password}@atlascluster.vw94t.mongodb.net/RegFormdb`)

//Registration schema
const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    password: String
})

//Mode of Schema
const Registration = mongoose.model("Registration", registrationSchema)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
    //res.send("Connection successful")
})


app.post("/register", async (req, res) => {
    try{
        const{name, email, password} = req.body;
        const existuser = await Registration.findOne({email:email});
        if (!existuser) {
            // New user
            const regdata = new Registration({
                name,
                email,
                password
            });
            await regdata.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exists");
            res.redirect("/error")

        }
        
    }
    catch (error){
        console.log(error);
        res.redirect("error")
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html")
})

app.listen(port, () => {
    console.log(`Server is connected at ${port}`)
})

