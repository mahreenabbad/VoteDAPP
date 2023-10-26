import { useContext, useEffect, useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import PropTypes from "prop-types";
import { WalletContext } from "../../components/wallet/Wallet";
import "./ElectionCommision.css";
import { toast } from "react-hot-toast";
import { accessListify } from "ethers/lib/utils";


const ElectionCommision =({account})=>{
  const {contract} = useContext(WalletContext);
  const [winner,setWinner] = useState("winner is not define")
  
  const dateTimeUnix = (dateTimeString)=>{
    const date = new Date(dateTimeString);
    return Math.floor(date.getTime()/1000);
  }

  const startVoting=async(e)=>{
    e.preventDefault();
    const start = document.querySelector("#start").value;
    const startInSeconds = dateTimeUnix(start);
    
    const end = document.querySelector("#end").value;
    const endInseconds = dateTimeUnix(end);
    // console.log(startInSeconds,endInseconds)
    const time={
      startInSeconds,
      endInseconds
    }
    try{
      const res = await fetch("http://localhost:3000/api/time-bound",{
  method:"POST",
  headers:{
     "content-type":"application/json"
  },
  body: JSON.stringify(time)
 });
 const data = await res.json()
 if(data.message === "Voting Timer Started"){
  await contract.methods.voteTime(startInSeconds,endInseconds).send({from:account,gas:480000});
  toast.success("Voting start")
  }else{
     toast.error("Voting Time Must Be Less Than 24 hours")
 }
 }catch(error){
     toast.error(error)
 }
}
   
    useEffect(()=>{
      const winnerInfo =async()=>{
      const winer = await contract.methods.winner().call();
      if(winer === "0x0000000000000000000000000000000000000000"){
        setWinner("No Winner")
      }else{setWinner(winer)}
      
    }
    contract && winnerInfo()
    },[contract])
    const resultDeclare=async()=>{
      await contract.methods.result().send({from:account,gas:480000});
      alert("result declared")
    }
    const emergencyDeclare=async()=>{
      await contract.methods.emergency().send({from:account,gas:480000});
      alert("Emergency declared")
    }
    

return(<>
<div>
    <Navigation account={account}/>
    <div className="election-wrapper">
    <h2> Winner is:{winner} <br />
          </h2>
          <form className="election-form" onSubmit={startVoting}>

            <label  htmlFor="start"> Start Time</label>
            <input type="datetime-local" id="start" required />

            <label htmlFor="end">End Time</label>
            <input type="datetime-local" id="end"/>
            <button className="regBtn" type="submit">Voting Start</button>

          </form>
    </div>
    <div className="admin-actions">
          <button className="emerBtn" onClick={emergencyDeclare} >
            Emergency
          </button>
          <button className="resultBtn" onClick={resultDeclare}>
            Result
          </button>
        </div>
</div>
</>)
}
export default ElectionCommision;