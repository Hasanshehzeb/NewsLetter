//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");
const { dirname } = require("path");

const app = express();

//create a public folder for all external files such as css and images
app.use(express.static("public"));

//use bodyParser to receive form information via POST method
app.use(bodyParser.urlencoded({extended:true}));


//connect HTML file
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

//receive information from website and store it in const
app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const eMail = req.body.email;

//save data for chimpmail in their syntax
const data = {
    members:[
        {
            email_address: eMail,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName,


            }
            
        }
    ]
};

//api URL for mailchimp api with apikey, server number(14) and list number
const url = "https://us14.api.mailchimp.com/3.0/lists/4e7a7e9761";
const options = {
    method: "POST",
    auth: "hasan:03b9af3233b4433178a370ffda99faa0-us14"
}


const jsonData = JSON.stringify(data);
const request =  https.request(url, options, function(response){

    if(response.statusCode === 200){
        res.sendFile(__dirname +"/success.html");
    }else {
        res.sendFile(__dirname + "/failure.html");
    };

    response.on("data",function(data){
        console.log(JSON.parse(data));
    })

})

request.write(jsonData);
request.end();

    // console.log(firstName, lastName, eMail);

});

app.post("/failure.html",function(req,res){
    // res.sendFile(__dirname+"/signup.html")
    res.redirect("/")
})

app.listen(process.env.port || 3000,function(){
    console.log("Server is running on port 3000");
});

 //apiKey
 //03b9af3233b4433178a370ffda99faa0-us14
 //listID
 //4e7a7e9761
