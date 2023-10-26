import { useState,useEffect,createContext } from "react";
import Web3 from "web3"
import PropTypes from "prop-types"
import ABI from "../../ABI/ABI.json"

const WalletContext = createContext();

const Wallet= ({children})=>{
    const [state,setState] =useState({
        web3:null,
        contract:null
    });
    
    const init=async()=>{
        // const web3 = new Web3("HTTP://127.0.0.1:7545");
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({
                method:"eth_requestAccounts"
            })
            const contractAddress = "0x3Eec0B2a83a40d4D5605e1647d9abAA2C34fB633";
        const contract = new web3.eth.Contract(ABI,contractAddress);
        setState({web3:web3,contract:contract});
        }   
    };
    
    return(<>
     <WalletContext.Provider value={state} >{children}</WalletContext.Provider>
     <button  onClick={init}>Connect MetaMask</button>
     </>
    );
};
Wallet.propTypes={
    children: PropTypes.node.isRequired,
}
export {WalletContext};
export default Wallet;