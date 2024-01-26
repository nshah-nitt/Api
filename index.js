import express from "express";
import bodyParser from "body-parser";
import { jokes} from "./new.js";
const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random joke
app.get("/random",(req,res)=>{
  res.json(jokes[Math.floor(Math.random()*jokes.length)])
})

//2. GET a specific joke

app.get("/jokes/:id",(req,res)=>{
  let found_joke = jokes.find((joke) => joke.id === parseInt(req.params.id));
  res.json(found_joke);
})

//3. GET a jokes by filtering on the joke type

app.get("/filter",(req,res)=>{
  const type = req.query.type;
  const values = jokes.filter((joke) => joke.jokeType === type);
  res.json(values);

})

//4. POST a new joke
app.post("/jokes",(req,res)=> {
  const newJoke = {
    id: jokes.length+1,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };
  jokes.push(newJoke);
  res.json(newJoke);
})

//5. PUT a joke
app.put("/jokes/:id",(req,res)=>{
  let found_index = jokes.findIndex((joke) => joke.id === parseInt(req.params.id));
  const newJoke = {
    id:parseInt(req.params.id),
    jokeText:req.body.text,
    jokeType:req.body.type
  }
  jokes[found_index] = newJoke;
  res.json(newJoke);
})

//6. PATCH a joke

app.patch("/jokes/:id",(req,res)=>{
  const found_index = jokes.findIndex((joke) => joke.id === parseInt(req.params.id));
  const newJoke = {
    jokeText:req.body.text,
    jokeType:req.body.type
  }
  Object.keys(newJoke).forEach(key=>{
    if(newJoke[key] !== ""){
      jokes[found_index][key] = newJoke[key];
    }
  })

  res.json(jokes[found_index]);
})

//7. DELETE Specific joke
app.delete("/jokes/:id",(req,res)=>{
  const found_index = jokes.findIndex((joke) => joke.id === parseInt(req.params.id));

  if(found_index > -1){
    jokes.splice(found_index,1);
    res.sendStatus(200)
  }else{
    res.status(404).json({error:`The id ${req.params.id} doesn't exist. No jokes were deleted.`});
  }
})

//8. DELETE All jokes
app.delete("/all",(req,res)=>{
  let api_key = req.headers['key'] || req.query.key;
  if(api_key === masterKey){
    jokes.length = 0;
    res.sendStatus(200);
  }else{
    res.status(401).json({"error":"You are not authorized to perform this action. Please contact your administrator."})
  }
})

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});


