const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config()
app.use(cors())
app.use(express.json())
const {Web3} = require("web3");
const ABI = require("./ABI.json")

const API_KEY =process.env.API_KEY
const PORT = process.env.PORT || 3000;


const web3 = new Web3(`https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`)
const contractAddress = "0x3Eec0B2a83a40d4D5605e1647d9abAA2C34fB633";
const contract = new web3.eth.Contract(ABI,contractAddress);

const genderVerification = (gender)=>{
   const genderData = gender.toLowerCase();
   if(genderData==="male" || genderData==="female" || genderData==="others"){
     return true;
   }else{
     return false;
   }
}

const partyClashStatus=async(party)=>{
   const candidateInfo = await contract.methods.candidateList().call();
   //The some() method checks if any array elements pass a test (provided as a callback function).
   const exists = candidateInfo.some((candidate)=>candidate.party===party);
   return exists;
}

app.post("/api/voter-verfication",(req,res)=>{
    const {gender} = req.body;
    const status = genderVerification(gender)
    if(status){
       res.status(200).json({message:"Gender verified"})
    }else{
        res.status(403).json({message:"Gender Invalid"})
    } 
})

app.post("/api/time-bound",(req,res)=>{
    const {startInSeconds,endInseconds}=req.body;
    if(endInseconds-startInSeconds<86400){
        res.status(200).json({message:"Voting Timer Started"})
    }else{
        res.status(403).json({message:"Voting Time Must Be Less Than 24 hours"})
    }
})

app.post("/api/candidate-verification",async(req,res)=>{
    const {gender,party}=req.body;
    // console.log(gender,party);
    const partyStatus = await partyClashStatus(party);
    const genderStatus = genderVerification(gender);

    if(genderStatus===true && partyStatus!==true){
        res.status(200).json({message:"Gender and Party are Valid"})
    }else{
        res.status(403).json({message:"Either Party Name or Gender is not valid"})
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})