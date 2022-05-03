// import Web3 from 'web3'
import { getChainContracts } from './contracts'
import EthersHelper from './EthersHelper'
import Bridge from '../Contracts/abis/Bridge.json'
import ERC20Token from '../Contracts/abis/ERC20Token.json'
import { ethers } from 'ethers'
import { IAppState } from './types'
import TokenHelper from './TokenHelper'


// const serviceFeeWei = '1000000000000000' // 0.001eth
// const serviceFeeWei = '100000000' 

class BridgeService {
  // public static getImportedTokens (chainId: any) {
  //   const strtokens= localStorage.getItem("tokens")
  //   if (strtokens) {
  //     const tokens = JSON.parse(strtokens)

  //     if (tokens) {
  //       return tokens.filter((token: { chainId: any }) => token.chainId === chainId)
  //     }
  //   }
  //   return []
  // }

  public static async getWrappedTokens (appState:IAppState) {
    const bridgeAddress = getChainContracts(appState.chainId).bridge
    const contract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)

    return contract.wrappedTokens()
  }

  public static async wrapToken (appState:IAppState,name: any, symbol: any, sourceAddress: any, sourceChainId: any) {
    const bridgeAddress = getChainContracts(appState.chainId).bridge
    const contract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)
    const wrap = await contract.wrapToken(sourceChainId, sourceAddress, { name, symbol, decimals: 18 })
    await wrap.wait(1)
  }

  public static async lockToken (appState:IAppState,targetChain: any, token: string, amount: string) {
    const wei = ethers.utils.parseEther(amount)
    const bridgeAddress = getChainContracts(appState.chainId).bridge
    const bridgeContract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)
    const tokenContract = TokenHelper.getContract(token, ERC20Token.abi, appState.library, appState.account)

    const approve = await tokenContract.approve(bridgeAddress, wei)
    await approve.wait()

    const lock = await bridgeContract.lock(targetChain, token, wei).catch((err:any) => {
      console.log(err)}
    )
    await lock.wait(2)
  }

  public static async mintToken (appState:IAppState,claim: any) {
   
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)

    // const mint = await bridgeContract.mint({
    //   sourceChain: claim.sourceChain,
    //   token: claim.token,
    //   amount: claim.amountWei,
    //   receiver: claim.receiver,
    //   wrappedTokenName: claim.wrappedTokenName,
    //   wrappedTokenSymbol: claim.wrappedTokenSymbol,
    //   txHash: claim.txHash,
    //   txSigned: claim.txSigned
    // })
    const mint = await bridgeContract.mint(
      claim.sourceChain,
      claim.token,
      claim.amountWei,
      claim.receiver,
      claim.wrappedTokenName,
      claim.wrappedTokenSymbol
  )

    await mint.wait(1)
  }

  public static async burnToken (appState:IAppState,sourceChain: number, token: string, amount: string) {
    const wei = ethers.utils.parseEther(amount)
    const bridgeAddress = getChainContracts(appState.chainId).bridge
    const bridgeContract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)
    const tokenContract = TokenHelper.getContract(token, ERC20Token.abi, appState.library, appState.account)

    const approve = await tokenContract.increaseAllowance(bridgeAddress, wei)
    await approve.wait()

   // const cBN = convertStringToNumber(amount);
    const burn = await bridgeContract.burn(sourceChain, token, wei, appState.account).catch((err:any) => {
      console.log(err)}
    )

    await burn.wait(1)
  }

  public static async unlockToken (appState:IAppState,claim: { targetChain: any; sourceChain: any; token: any; amountWei: any; receiver: any }) {
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = EthersHelper.getContract(bridgeAddress, Bridge.abi, appState.library, appState.account)

    const release = await bridgeContract.unlock(
       claim.sourceChain,
       claim.token,
       claim.amountWei,
       claim.receiver
    )

    await release.wait(1)
  }
}

export default BridgeService


