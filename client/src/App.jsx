import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Wallet from "./components/wallet/Wallet"
import AccountList from "./pages/accountList/AccountList"
import CandidateRegister from "./pages/candidateRegister/CandidateRegister"
import ElectionCommision from "./pages/electionCommision/ElectionCommision"
import VoterRegister from "./pages/voterRegister/VoterRegister"


function App() {
  const [account, setAccount] = useState("")

  const saveAccount=(address)=>{
  setAccount(address)
  }
  const router= createBrowserRouter([
    {path:"/",element:<AccountList saveAccount={saveAccount}/>},
    {path:"/candidate",element: <CandidateRegister account={account}/>},
    {path:"/voter",element:<VoterRegister account={account}/>},
    {path:"/election-commision",element:<ElectionCommision account={account}/>}
  ]);

  return (
    <>
      <Wallet>
        <RouterProvider router={router}></RouterProvider>
      </Wallet>
    </>
  )
};

export default App