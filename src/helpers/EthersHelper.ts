import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import TokenHelper from './TokenHelper';

class EthersHelper {
    public static isAddress(value: string) {
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
  public static getTokenContract(address: string, ABI: any, library: any, account: any) {
    if (!TokenHelper.isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI, TokenHelper.getSigner(library, account));
  }
}

export default EthersHelper