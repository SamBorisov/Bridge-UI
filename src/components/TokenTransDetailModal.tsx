import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import styled from 'styled-components'
// import Web3 from 'web3';
// import Wrapper  from './Wrapper'

const TokenTransDetaileModal  = styled.div`
        position: absolute; 
        border: 3px solid #871A85;
        borderRadius: 4px;
        width: 80%;
        left: 10%;
        backgroundColor: black;
        alignItems: center; 
        justifyContent: center; 
        `;

const TokenTransDetailHeader = styled.div`
        marginTop: 100px; 
        left: 10%;
        alignItems: center; 
        justifyContent: center; 
        `;

interface ITokenTransDetailProp {
    provider: any,
    transactionHash: string,
    handleCloseModal: any,
    show?:boolean
}

const TokenTransDetailResult =  {
    from: '',
    to: '',
    blockNumber: '',
    status:'',
}

const TokenTransDetailModal = (props: ITokenTransDetailProp ) => {
 
    
    function getTransaction(props: ITokenTransDetailProp) {
        const [s, setTran] = useState(TokenTransDetailResult);
        
        // function initWeb3(provider: any) {
        //     const web3: any = new Web3(provider);
          
        //     web3.eth.extend({
        //       methods: [
        //         {
        //           name: "chainId",
        //           call: "eth_chainId",
        //           outputFormatter: web3.utils.hexToNumber
        //         }
        //       ]
        //     });
          
        //     return web3;
        // }

        useEffect(() => {
            const getTran = async (props: ITokenTransDetailProp) => {
                  //  const web3 = initWeb3(props.provider);
                // const accounts = await web3.eth.getAccounts();
                    const transactionHash = props.transactionHash.toString();
                    const library = new Web3Provider(props.provider);    
                    const provider = new ethers.providers.EtherscanProvider((await library.getNetwork()).chainId,'DJMYXYS6RAGUU4NKIU2N6WUMXH436FDY4H')
                    const transaction = await provider.getTransactionReceipt(transactionHash)
                    
                    s.from = transaction.from
                    s.to = transaction.to
                    s.blockNumber = ""+transaction.blockNumber
                    s.status = ""+transaction.status||''
                    // const transaction = await web3.eth.getTransactionReceipt(transactionHash);

                    // const logs = await transaction.logs;

                    // const log = await logs.find((i: { transactionHash: any; }) => i.transactionHash === transactionHash);
                    // if (log) {
                    //     const topics = await log.topics;
                    //     if (topics) {
                    //         // const test = await web3.eth.abi.decodeParameter('bytes32', topics[0]);

                    //         s.trans_from = await (web3.eth.abi.decodeParameter('address', topics[1]) as unknown as string);

                    //         s.trans_to = await (web3.eth.abi.decodeParameter('address', topics[2]) as unknown as string);

                    //         s.trans_value = await (web3.eth.abi.decodeParameter('uint256', log.data) as unknown as string);

                    //         s.trans_amount = '123' // await web3.utils.fromWei(trans_value);
                    //     }
                    // }
                setTran(s);
                };
                //  if (!tranlist) {
                getTran(props);
                //    }
                }, []);

                return s;
                }

    if (props.show  && props.transactionHash !== '') {
        const tran =getTransaction(props);
        
        return <TokenTransDetaileModal className="custom-modal" >
            <div className="close-modal-icon" onClick={props.handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}>
                <AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} />
            </div>
            <TokenTransDetailHeader>
            <div className="row" style={{marginTop: '20px'}}>
                    <div className="col-md-3">From: {tran.from}</div>
                    <div className="col-md-3">to: {tran.to}</div>
                    <div className="col-md-3">blockNumber: {tran.blockNumber}</div>
                    <div className="col-md-3">status: {tran.status}</div>
            </div>
            </TokenTransDetailHeader>
            <div className="row" style={{marginTop: '20px', marginLeft: '20px'}}>
                <div>transactionHash: {  props.transactionHash }</div>
          
            </div>
            </TokenTransDetaileModal>
        
    } else {
        return null;
    }
}

export default TokenTransDetailModal