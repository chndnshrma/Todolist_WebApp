require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//your database CRUD goes here
    const itemSchema ={
        name:String
    };
const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
    name:"Welcome to your Todolist!"
});
const item2 = new Item({
    name:"Hit the + button to add a new item."
});
const item3 = new Item({
    name:"<-- Hit this to delete an item."
});

async function main(){
    try{
        await mongoose.connect("mongodb+srv://chndnsharma:helloworld0000@todolist-test.peqhycw.mongodb.net/todolistDB");
        console.log("Connection Established!");

    }catch(err){
        console.log("Connection Error!",err.message);
    }
}
main();

const defaultItem = [item1, item2, item3];

const listSChema = {
    name:String,
    items:[itemSchema]
}

const List = mongoose.model("List", listSChema);

app.get("/", function(req, res){
    var foundItems=[];
    async function getAllITems(){
        try{
            foundItems = await Item.find({});

            if(foundItems.length == 0){
                await Item.insertMany(defaultItem);
                res.redirect("/");
            }else{
                res.render('list',{listTitle: "Today", newListItems:foundItems});
            }
        }catch(err){
            console.log("There was an error :",err);
        }
    }
    getAllITems();
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    async function checkExistence() {
        try {
            const foundList = await List.findOne({ name: customListName });
            
            if (!foundList) {
                const list = new List({
                    name:customListName,
                    items:defaultItem
                });
                await list.save();
                console.log("New list created!");

                res.redirect("/"+customListName);
            } else {
                res.render('list', {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            }
        } catch (err) {
            console.error("Error checking list:", err);
        }
    }
    checkExistence();
});

app.post("/",function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name:itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        async function checkList(){
            try{
                const foundList = await List.findOne({name: listName});
                foundList.items.push(item);
                await foundList.save();
                res.redirect("/"+ listName);
            }catch(err){
                console.log("There was some error!",err);
            }
        }
        checkList();
    }
});
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName === "Today"){
        async function deleteCheckedItem(){
            try{
                await Item.findByIdAndDelete(checkedItemId);
                console.log("Successfully deleted checked item.");
            }catch(err){
                console.log("Error deleting checked item.",err);
            }   
        }
        deleteCheckedItem();
        res.redirect("/");
    }else{
        async function deleteNewListItem(){
            try{
                const updateDoc = await List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkedItemId}}});
                res.redirect("/"+ listName);
            }catch(err){
                console.log("There was an error.",err);           
            }
        }
        deleteNewListItem();
    }
});


app.get("/work",function(req, res){
    res.render("list",{listTitle: "Work List", newListItems: workItems});
});

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about",function(req, res){
    res.render("about");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is live...");
});