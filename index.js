
const express=require("express")
const path=require("path")
const {connectToMongoDB}= require("./connect")
const urlRoute=require('./routes/url')
const URL=require('./models/url')
const app=express()
const Port=8001
connectToMongoDB("mongodb://localhost:27017/urlshortner12")
.then(()=> console.log("mongodb connected"))

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.json())
app.get("/test",async (req,res)=>{
    const allurl=await URL.find({})
    return res.render('home')
})
app.use('/url',urlRoute)
app.get('/:shortId', async(req,res)=>{
    const shortId=req.params.shortId
    const entry=await URL.findOneAndUpdate({
        shortId

    }, {$push:{
        visitHistory:{
            timestamp: Date.now(),
        },
    },})
    res.redirect(entry.redirectURL)
    

})
app.listen(Port,()=>{
    console.log(`server start at ${Port}`)
})