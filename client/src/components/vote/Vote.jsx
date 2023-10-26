import { useContext } from "react";
import { toast } from "react-hot-toast";
import { WalletContext } from "../wallet/Wallet";
import PropTypes from "prop-types"
import "./Vote.css"

const Vote =({account})=>{
  const {contract} =useContext(WalletContext)

  const Voting =async(e)=>{
      e.preventDefault();
      const voterId= document.querySelector("#voterId").value;
      const candidateId = document.querySelector("#candidateId").value;
      
      await contract.methods.vote(voterId,candidateId).send({from:account,gas:480000});
      alert("Vote succesful")
  }
    return(<>
    <div>
      <form className="vote-form" onSubmit={Voting}>
        <h1>Vote Here</h1>
        <label htmlFor="start">Voter Id:</label>
        <input type="text" id="voterId"></input>

        <label htmlFor="end">Candidate Id:</label>
        <input type="text" id="candidateId"></input>

        <button className="regBtn" type="submit">
          Vote
        </button>
      </form>
    </div>
    </>)
}
Vote.propTypes = {
    account: PropTypes.node.isRequired,
  };
export default Vote;