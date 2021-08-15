const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin-mohit:Test123@cluster0.4pepp.mongodb.net/participantDB',{useNewUrlParser:true,  useUnifiedTopology: true,useFindAndModify:false});

const participantSchema = new mongoose.Schema({
  name:String,
  age: Number,
  mobile_no:Number,
  email_Id:String
});

const eventSchema= mongoose.Schema({
  event_name:String,
  participants:[participantSchema]
});

 const Event = mongoose.model("Event",eventSchema);

// Root/Home route
app.get("/",function(req,res){
  res.render("Homepage");
});

app.get("/events",function(req,res){
  res.render("Events");
});

app.get("/events/:eventName",function(req,res){
  const requestedEvent= req.params.eventName;

 const EventName = _.upperCase(requestedEvent);
if(requestedEvent=="fit-India"){
  let EventTheme="Due to time constraint notable to add text."
 res.render("EventTemplate",{organizerImg:"NCC.jpg",eventTitle:EventName,eventImg:"RunforAwareness.jpg",eventTheme:EventTheme});
}
if(requestedEvent=="street-play"){
let   EventTheme="Due to time constraint notable to add text."
 res.render("EventTemplate",{organizerImg:"DramaticSection.jpg",eventTitle:EventName,eventImg:"Street.jpg",eventTheme:EventTheme});
}
else if(requestedEvent=="dance-competition"){
let   EventTheme="Due to time constraint notable to add text."
res.render("EventTemplate",{organizerImg:"choreoSection.png",eventTitle:EventName,eventImg:"Dance.jpg",eventTheme:EventTheme});
}
else if(requestedEvent=="song-competition"){
let   EventTheme="Due to time constraint notable to add text."
res.render("EventTemplate",{organizerImg:"ChoreoSection.png",eventTitle:EventName,eventImg:"Song.jpg",eventTheme:EventTheme});
}
else if(requestedEvent=="poster-design"){
let   EventTheme="Due to time constraint notable to add text."
res.render("EventTemplate",{organizerImg:"NSS.jpg",eventTitle:EventName,eventImg:"Poster.jpg",eventTheme:EventTheme});
}
else if(requestedEvent=="essay-writing"){
let   EventTheme="Due to time constraint notable to add text. eassay"
res.render("EventTemplate",{organizerImg:"SanskritClub.jpg",eventTitle:EventName,eventImg:"Essay.png",eventTheme:EventTheme});
}
else if(requestedEvent=="indian-history-quiz"){
let  EventTheme="to time constraint notable to add text. Indian History"
res.render("EventTemplate",{organizerImg:"WatchOut.jpg",eventTitle:EventName,eventImg:"Quiz.png",eventTheme:EventTheme});
}
else{
    res.render("Shownotif.ejs",{message:`Sorry There is no such event Happening`});
}

});

app.post("/",function(req,res){
  const clicked_event= req.body.event_name;
  const participant_detail= {
    name:req.body.name,
    age:req.body.age,
    mobile_no:req.body.mobile_no,
    email_Id:req.body.email_Id
  };
  Event.findOne({event_name:clicked_event},function(err,foundEvent){
    if(!err){
      if(!foundEvent){
         const newEvent= new Event({
          event_name:clicked_event,
          participants:[participant_detail]
        });
        newEvent.save();
      res.render("Shownotif.ejs",{message:` Thanks! , You have successfully registered for ${clicked_event} Event`})
      }
      else{
         foundEvent.participants.forEach((p,i)=>{
           if(p.name==req.body.name && p.mobile_no==req.body.mobile_no)
           {
             res.render("Shownotif.ejs",{message:`Sorry, A user with same name and Mobile no has already registered for ${clicked_event} Event`})
           }
         });
         // res.status(200).redirect("/");
         foundEvent.participants.push(participant_detail);
         foundEvent.save();
        res.render("Shownotif.ejs",{message:` Thanks! , You are successfully registered for ${clicked_event} Event`})
      }
    }
});

});

app.get("/showDB",function(req,res){
  Event.find({},function(err,foundEvents){
    if(!err)
    res.send(foundEvents);
    else {
      console.log(err);
    }
  })

});




//setting up server
const port = process.env.PORT;
if(port==null||port==""){
  port =3000;
}
app.listen(port,()=>{
  console.log(`Server started at 'PORT':${port}`);
})
