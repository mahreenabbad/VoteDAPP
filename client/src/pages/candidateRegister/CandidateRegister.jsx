import { useContext } from "react";
import PropTypes from "prop-types";
import CandidateDisplay from "../../components/candidateDisplay/CandidateDisplay";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/wallet/Wallet";
import { toast } from "react-hot-toast";
import "./CandidateRegister.css";

const CandidateRegister=({account})=>{
    const {contract} = useContext(WalletContext)

    const CandidateRegistration =async(e)=>{
        e.preventDefault();
        const name =document.querySelector("#name").value;
        const party =document.querySelector("#party").value;
        const age =document.querySelector("#age").value;
        const gender =document.querySelector("#gender").value;

        const partyData={
            party,
            gender
        }
        try{
             const res = await fetch("http://localhost:3000/api/candidate-verification",{
         method:"POST",
         headers:{
            "content-type":"application/json"
         },
         body: JSON.stringify(partyData)
        });
        const data = await res.json()
        if(data.message === "Gender and Party are Valid"){
            await contract.methods.candidateRegister(name,party,age,gender).send({from:account,gas:480000});
             toast.success("registration Succesfull")
        }else{
            toast.error("Registration Unsuccesfull")
        }
        }catch(error){
            console.error(error)
        }
       

        
    }
    
    return(<>
    <Navigation account={account}/>
    <div className="reg-cand-wrapper">
        
        <div className="reg-img-wrapper">
            <h1>Welcome to candidate register</h1>
            
            <p>Make your votes count towards the voter you like</p>
            <img src="/register.png" width={400}></img>

        </div>
        <form className="can-reg-form" onSubmit={CandidateRegistration}>
            <h3>Register</h3>
            <label htmlFor="name">Name</label>
            <input type="text" id="name"></input>

            <label className="label1" htmlFor="party">Party</label>
            <input type="text" id="party"></input>

            <label  htmlFor="age">Age</label>
            <input type="text" id="age"></input>

            <label htmlFor="gender">Gender</label>
            <input type="text" id="gender"></input>

            <button className="regBtn" type="submit">Register</button>

        </form>

    </div>
    <CandidateDisplay/>

    </>)
}
CandidateRegister.propTypes = {
    account: PropTypes.node.isRequired,
  }
export default CandidateRegister;