import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers'
import ERC20Token from '../Contracts/abis/ERC20Token.json'

class TokenHelper {
   public static  async getTokenBalance (address: any, library: any, account: any) {
    const contract = TokenHelper.getContract(address, ERC20Token.abi,library, account)
    const balance = await contract.balanceOf(account)

    return ethers.utils.formatUnits(balance)
  }

  public static async getTokenSymbol (address: any, library: any, account: any) {
    const contract = TokenHelper.getContract(address, ERC20Token.abi, library, account)
    return contract.symbol()
  }

  public  static async getTokenName (address: any, library: any, account: any) {
    const contract = TokenHelper.getContract(address, ERC20Token.abi, library,account)
    return contract.name()
  }
  public  static async getERC20Contract (address: any, library: any, account: any) {
    const contract = TokenHelper.getContract(address, ERC20Token.abi, library,account)
    return contract
  }
  // public  static async getTTContract ( library: any, account: any) {
  //   const contract = TokenHelper.getContract('0xFd8F63516965a5096c5772155230e5CEAD7AA974', ERC20Token.abi, library,account)
  //   return contract
  // }
  public static async  isAddress(value: string) {
    try {
      return getAddress(value);
    } catch {
      return false;
    }
  }
  
  public static getSigner(library: any, account: any) {
    return library.getSigner(account).connectUnchecked();
  }
  
  public static getProviderOrSigner(library: any, account: any) {
    return account ? TokenHelper.getSigner(library, account) : library;
  }
  
  public static getContract(address: string, ABI: any, library: any, account: any) {
    if (!TokenHelper.isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`);
    }
  
    return new Contract(address, ABI, TokenHelper.getProviderOrSigner(library, account));
  }
}

export default TokenHelper
