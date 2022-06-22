import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import {  Button, } from 'react-bootstrap'
import { AiOutlineClose } from 'react-icons/ai'
// import { TOKEN_ADDRESS_Kovan } from 'src/helpers/contracts';
import {  ellipseAddress, } from 'src/helpers/utilities';
// import TokenHelper from 'src/helpers/TokenHelper';
import styled from 'styled-components'
// import TokenTransDetailModal from './TokenTransDetailModal';
// import Web3 from 'web3';
// import {TransactionChecker} from '../helpers/TransactionChecker';

const TokenTransListModalModal  = styled.div`
        min-width: 1150px;
        position: absolute; 
        border: 3px solid #871A85;
        borderRadius: 4px;
        top: 100px;
        width: 90%;
        left 5%;
        alignItems: center; 
        justifyContent: center; 
        `;
const TokenTransListModalHeader = styled.div`
        marginTop: 100px; 
        marginLeft: 100px; 
        alignItems: center; 
        justifyContent: center; 
        `;

interface ITokenTransListModalProp {
    provider: any,
    address: any,
    handleCloseModal: any,
    handleShowDetails:any,
    show?:boolean
}

const TokenTransListModal = (props: ITokenTransListModalProp ) => {
    
    function getTransaction(props: ITokenTransListModalProp) {
        const [tranlist, setTrans] = useState([]);
      
        useEffect(() => {

          const  getTrans =  async (props: ITokenTransListModalProp) =>  {
            const library = new Web3Provider(props.provider);    
            const provider = new ethers.providers.EtherscanProvider((await library.getNetwork()).chainId,'DJMYXYS6RAGUU4NKIU2N6WUMXH436FDY4H')
            const history = await provider.getHistory('0x1af041540B4E9d586DA7F6EC45Bb6ceFa8e6A5AF')
            let structuredTransactions : any = [];
            structuredTransactions = history.map((transaction:ethers.providers.TransactionResponse ) => ({
                hash:transaction.hash,
                addressTo: transaction.to,
                addressFrom: transaction.from,
            }));
            setTrans(structuredTransactions);
        };
        //  if (!tranlist) {
              getTrans(props);
      //    }
        }, []);
       return tranlist;
    }
    
    async function ShowDetails(hash: any) {
        props.handleShowDetails(hash);
        // if (hash=== detailHash) 
        // {
        //     setdetailHash("");
        //     setShowDetails(false);
        // }
        // else {
        //     setdetailHash(detailHash);
        //     setShowDetails(true);
        // }
     
    }

    if (props.show && props.provider) {
        // const web3 = initWeb3(props.provider);
        const result:any[] = getTransaction(props);

            // console.log(result);
            return <TokenTransListModalModal className="custom-modal">
                <div className="close-modal-icon" onClick={props.handleCloseModal} style={{ position: 'absolute', right: 15, top: 5 }}>
                    <AiOutlineClose size={25} style={{ color: 'blue', cursor: 'pointer' }} />
                </div>
                <TokenTransListModalHeader>
                    <table>
                        <thead>
                            <tr>
                                <th>hash</th>
                                <th>From</th>
                                <th>To</th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((trans: any) => (
                                <tr key={trans.hash}>
                                    <td>{trans.hash}</td>
                                    <td title={trans.addressFrom}>{ellipseAddress(trans.addressFrom)}</td>
                                    <td title={trans.addressTo}>{ellipseAddress(trans.addressTo)}</td>
                                    <td>
                                        <Button onClick={() => ShowDetails(trans.hash)} size="sm" style={{ width: '100px' }}>show</Button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </TokenTransListModalHeader>
                <div className="row" style={{ marginTop: '20px', marginLeft: '20px' }}>
                    <div>address: {props.address}</div>
                </div>
            </TokenTransListModalModal>
    } else {
        return null;
    }
}

export default TokenTransListModal