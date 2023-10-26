import { useContext } from "react";
import PropTypes from "prop-types";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/wallet/Wallet";
import VoterDisplay from "../../components/voterDisplay/VoterDisplay";
import Vote from "../../components/vote/Vote";
import VotingStatus from "../../components/votingStatus/VotingStatus";
import "./VoterRegister.css";
import toast from "react-hot-toast";

const VoterRegister =({account})=>{
    const {contract} =useContext(WalletContext)

    const VoterRegistration =async(e)=>{
        e.preventDefault();
        const name= document.querySelector("#name").value;
        const age = document.querySelector("#age").value;
        const gender= document.querySelector("#gender").value;

        const voterData={
            gender
        }
        try{
             const res = await fetch("http://localhost:3000/api/voter-verfication",{
         method:"POST",
         headers:{
            "content-type":"application/json"
         },
         body: JSON.stringify(voterData)
        });
        const data = await res.json()
        if(data.message === "Gender verified"){
            await contract.methods.voterRegister(name,age,gender).send({from:account,gas:480000});
            toast.success("registration succesful")
        
        }else{
            toast.error("Registration Unsuccesfull")
        }
        }catch(error){
            console.error(error)
        }
       
       
    }
    return(<>
    <Navigation account={account}/>
    <div className="status-nav">
        <VotingStatus/>
    </div>
    <div className="voter-reg-wrapper">
        <form className="voter-form" onSubmit={VoterRegistration}>
            <h1>Register as Voter</h1>
            <label htmlFor="name">Name</label>
            <input type="text" id="name"></input>

            <label htmlFor="age">Age:</label>
            <input type="text" id="age"></input>

            <label htmlFor="gender">Gender:</label>
            <input type="text" id="gender"></input>

            <button className="regBtn" type="submit">Register</button>

        </form>
        <Vote account={account}/>
    </div>
    <VoterDisplay/>
    </>)
}
VoterRegister.propTypes = {
    account: PropTypes.node.isRequired,
  };
export default VoterRegister;