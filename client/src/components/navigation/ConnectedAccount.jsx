import React from "react";
import PropTypes from "prop-types";

const ConnectedAccount =({account})=>{
    return(<>
        <p style={{ fontSize: 14, fontWeight: 400 }}>
        {account ? account : <span>Connect Account</span>}
      </p>
       
       </>
    )
}
ConnectedAccount.prototype={
    account: PropTypes.node,
}
export default ConnectedAccount;