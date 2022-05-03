import { IContactsData } from './types';
export const BRIDGE_ADDRESS_Rinkeb = '0x5f3f5c2dad699e41302725deb00c4ce48b23dfa7'.toLowerCase();
export const TOKEN_ADDRESS_Rinkeb = '0xA9Ce104cDad832F98101E40542f26291858b19d3'.toLowerCase();
export const BRIDGE_ADDRESS_Kovan = '0x261545711e478456192BFbE6dfB6b0C983DF2395'.toLowerCase()
export const TOKEN_ADDRESS_Kovan = '0x1af041540B4E9d586DA7F6EC45Bb6ceFa8e6A5AF'.toLowerCase();

const contracts:IContactsData[] = [
  {
    chain_id: 42, // kovan
    bridge: BRIDGE_ADDRESS_Kovan,
    token: TOKEN_ADDRESS_Kovan,
    balance: TOKEN_ADDRESS_Kovan
  },
  {
    chain_id: 4, // Rinkeby
    bridge: BRIDGE_ADDRESS_Rinkeb,
    token:TOKEN_ADDRESS_Rinkeb,// TOKEN_ADDRESS_Kovan,
    balance: TOKEN_ADDRESS_Rinkeb
  }
  // ,
  // {
  //   chain_id: 31337, // Hardhat localhost
  //   bridge: '',
  //   token:'',
  //   balance: ''
  // }
];

export default contracts;

export function getChainContracts (chainId:any) {
  return contracts.filter(
    (chain) => chain.chain_id === chainId
  )[0]
}