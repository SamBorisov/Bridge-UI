import React, {   useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import {  Form,
  FormGroup,
  FormLabel,
  Button} from 'react-bootstrap'
import { IAppState } from 'src/helpers/types';
import {  ellipseAddress, getChainData } from 'src/helpers/utilities';
import BridgeService from 'src/helpers/BridgeService';
import  toast, { Toaster } from 'react-hot-toast';
import { networks,txType } from 'src/Contracts';
import { ethers } from 'ethers';
import { getChainContracts } from 'src/helpers/contracts';

// import { convertStringToHex } from 'src/helpers/bignumber';
import Web3 from 'web3';
  
export const inputStyle = {
    width: '50%', 
    backgroundColor: '#grey',  
    border: '1px solid', 
    color: '#001',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: '10px 0px'
}

export const inputGroupStyle = {
  width : '80%'
}
export const lableStyle = {
  width : '200px'
}

export const modalStyle = {
    position: 'absolute', 
    width: '50%', 
    // height: '350px', 
    border: '1px solid #4206F1', 
    borderRadius: '4px', 
    top: '100px', left: '25%', 
    backgroundColor: 'white', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column'
} as React.CSSProperties;

export const balanceModalStyle = {
    position: 'absolute', 
    width: '500px', 
    height: '350px', 
    border: '1px solid #4206F1', 
    borderRadius: '4px', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    backgroundColor: 'black'
} as React.CSSProperties;

const TransactionModal = (props:{ handleSendTransaction:any, handleCloseModal:any,showTransactionModal:boolean,AppState:IAppState , handleRemoveClaim:any,}) => {
    if (!props.AppState.connected )
    {
        return<div/>; 
    }
       

// const [ form, setForm ] = useState({ sender: props.selectedWallet, receiver: '', amount: '' })
    // const [ selectedWallet, setSelectedWallet ] = useState('')
    // debugger;
    const [ form, setForm ] = useState({ fromNet:'', toNet:'', token: '',amount: '1' })
    const [ sendError, setSendError ] = useState(false)
    const [ receiveError, setReceiveError ] = useState(false)
    // const netname = getChainData(props.AppState.chainId).name
    
    const tokens = [{ label: 'TestToken', value: getChainContracts(props.AppState.chainId).token }];

 
    const handleFormChange = (event: { target: { name: any; value: any } }) => {
        
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    function  sendTransaction () {
      const mypro=prTransaction();
      toast.promise(mypro
      ,  {
        loading: 'Loading',
        success: 'Got the data',
        error: 'Error when fetching',
      })
    }

   async function  prTransaction () {
        // // Check to see if the input addresses are valid ethereum addresses
        if (form.fromNet !== ""+props.AppState.chainId) {
            setSendError(true)
        } 
        else{
          setSendError(false)
        }
         setReceiveError(false)
        if (form.fromNet === form.toNet) {
            setReceiveError(true)
        }
        if (form.toNet === ""+props.AppState.chainId) {
            setReceiveError(true)
        }
        if (sendError || receiveError) {
            return "error";
        }
       
        if (form.token)
        {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            props.AppState.account = accounts[0];
            // const sToken=getChainContracts(props.AppState.chainId).balance;
            if (props.AppState.chainId === 42) { // this is native token
              await BridgeService.lockToken(props.AppState,+form.toNet, form.token, form.amount)
            } else { // this is wrapped token
              await BridgeService.burnToken(props.AppState,+form.toNet, form.token, form.amount)
            }
            return "OK";
        }
        else{
          return "error";
      }

        
    }
    
    async function mintOrUnlock(key: any) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        props.AppState.account = accounts[0];
        const claim = props.AppState.claims[key]
        if (claim.targetChain === props.AppState.chainId) {
          if (claim.type === txType.MINT) {
            await BridgeService.mintToken(props.AppState,claim)
            // props.store.RemoveClaim(key)
            // props.store.saveStore()
            props.handleRemoveClaim(key)

          } else { // type is Unlock
            await BridgeService.unlockToken(props.AppState,claim)
            // props.store.RemoveClaim(key)
            // props.store.saveStore()
            props.handleRemoveClaim(key)
          }
        } else { // prompt MM to switch network
          const targetChain = getChainData(claim.targetChain)
          const hexTargetChainId = ethers.utils.hexStripZeros(Web3.utils.toHex(targetChain.chain_id))
          // Check if MetaMask is installed
          // MetaMask injects the global API into window.ethereum
          if (window.ethereum) {
            try {
            // check if the chain to connect to is installed
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexTargetChainId }] // chainId must be in hexadecimal numbers
              })
            } catch (error) {
              console.log(error)

            }
          } else {
          // if no window.ethereum then MetaMask is not installed
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html')
          }
        }
    }

    if (props.showTransactionModal) {

    return (
            <div className="custom-modal" style={modalStyle}>
                <div className="close-modal-icon" onClick={props.handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}>
                    <AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} />
                </div>
                <div style={{marginTop: '10px',marginBottom: '10px', width: '50%', padding: '0px 20px'}}>
                  <h4>  New Transaction</h4>
                </div>
                <FormGroup style={inputGroupStyle}>
                    <FormLabel style={lableStyle}>From</FormLabel>
                    <Form.Control 
                        as="select"
                        isInvalid={sendError ? true : false} 
                        value={form.fromNet} 
                        name="fromNet" type="text" 
                        placeholder="From network" 
                        style={inputStyle}
                        onChange={e => {
                          console.log("e.target.value", e.target.value);
                          setForm({
                              ...form,
                              ["fromNet"]: e.target.value   // e.target.value
                          })
                        }}
                      >
                        <option value='0'>select</option>
                      {networks.map((network:any) => (
                          <option key={network.value} value={network.value}>{network.label}</option>
                      ))}
                  </Form.Control>
                </FormGroup>
                <FormGroup style={inputGroupStyle}>
                    <FormLabel style={lableStyle}>To</FormLabel>
                    <Form.Control
                    as="select"
                    isInvalid={receiveError ? true : false} 
                    value={form.toNet}
                    name="toNet" 
                    style={inputStyle}
                    placeholder="To network" 
                    onChange={e => {
                        console.log("e.target.value", e.target.value);
                        setForm({
                            ...form,
                            ["toNet"]: e.target.value   // e.target.value
                        })
                      }}
                    >
                      <option value='0'>select</option>
                    {networks.map((network:any) => (
                        <option key={network.value}  value={network.value}>{network.label}</option>
                    ))}
                </Form.Control>
                </FormGroup>
                <FormGroup style={inputGroupStyle}>
                    <FormLabel style={lableStyle}>Token</FormLabel>
                    <Form.Control 
                        as="select"
                        value={form.token}
                        onChange={handleFormChange} 
                        name="token" 
                        style={inputStyle}
                        placeholder="Token" 
                        >
                            <option value='0'>select</option>
                        {tokens.map((token:any) => (
                            <option key={token.value} value={token.value}>{token.label}</option>
                        ))}
                    </Form.Control>
                </FormGroup>
                <FormGroup style={inputGroupStyle}>
                    <FormLabel style={lableStyle}>Amount</FormLabel>
                  <Form.Control 
                      value={form.amount}
                      onChange={handleFormChange}
                      name="amount" type="text" 
                      placeholder="Amount"
                      style={inputStyle} 
                  />
                </FormGroup>
                <div style={{marginTop: '10px',marginBottom: '20px', width: '50%', padding: '0px 10px'}}>
                    <Button onClick={sendTransaction} size="sm" style={{width: '100px'}}>Send</Button>
                </div>
                <div  style={{marginTop: '10px',marginBottom: '40px', width: '90%'}}>
                <div style={{alignItems: 'center', justifyContent: 'center',width: '100%', padding: '0px 0px'}}>
                    <h4>Claims</h4>
                </div>
                <table  style={{width: '90%' }}>
                    <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Token</th>
                        <th>Amount</th>
                        <th>Receiver</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.AppState.claims.map((t:any,index:number) => (
                    <tr key={index}>
                        <td>{ t.sourceChain }</td>
                        <td>{ t.targetChain }</td>
                        <td>{ ellipseAddress(t.token) }</td>
                        <td>{  ethers.utils.formatUnits(t.amountWei) }</td>
                        <td/>
                        <td>
                          <Button onClick={() => mintOrUnlock(index)} size="sm" style={{width: '100px'}}>Swtich/Claim</Button>
                        </td>
                        <td>
                          <Button onClick={() => props.handleRemoveClaim(index)} size="sm" style={{width: '100px'}}>RemoveClaim</Button>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
                </div>
                <Toaster />
            </div>
        )
    } else {
        return null
    }
}

export default TransactionModal



