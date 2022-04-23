// import { Web3Provider } from '@ethersproject/providers';
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
// import { getChainContracts } from 'src/helpers/contracts';
import { IAppState } from 'src/helpers/types';
// import { FaEthereum } from 'react-icons/fa'
// import TokenHelper from 'src/helpers/TokenHelper';
import styled from 'styled-components'
// import ERC20Icon from './ERC20Icon';

const BalanceModalDiv  = styled.div`
        position: absolute; 
        width: 600px;
        height: 350px;
        border: 3px solid #871A85;
        borderRadius: 4px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        backgroundColor: black;
        alignItems: center; 
        justifyContent: center; 
        `;

const BalanceModalHeader = styled.div`
        marginTop: 100px; 
        marginLeft: 100px; 
        width: 600px; 
        alignItems: center; 
        justifyContent: center; 
        `;

interface IBalanceModalProps {
    balance: any,
    handleCloseModal?: any,
    appState:IAppState,
    show?:boolean
}


const BalanceModal = (props: IBalanceModalProps ) => {
    // const GetBalance = async (provider: any) => {
    //     //  debugger;
    //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       const account = accounts[0];
        
    //       // const balance  = await window.ethereum.request({ method: 'eth_getBalance' , params: [ account, 'latest' ]})
    //       const contractAddress='0xFd8F63516965a5096c5772155230e5CEAD7AA974';
    //       const library = new Web3Provider(provider);
    //       const balance = await TokenHelper.getTokenBalance(contractAddress,library,account);
    //       return balance;
         
    //     }

    if (props.show) {
      //  const contractAddress=getChainContracts(props.appState.chainId).balance;

        // const balance:any = GetBalance(props.provider);
        return <BalanceModalDiv className="custom-modal" >
            <div className="close-modal-icon" onClick={props.handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}>
                <AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} />
            </div>
            <BalanceModalHeader>
            <div className="row" style={{marginTop: '20px'}}>
                <div className="eth-text" style={{fontSize: '56px', color: '#925BB3'}}>{ props.balance} TT </div> 
            </div>
            </BalanceModalHeader>
           </BalanceModalDiv>
    } else {
        return null;
    }
}

export default BalanceModal