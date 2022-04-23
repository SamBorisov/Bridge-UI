import { ethers } from 'ethers'
import { getChainContracts, TOKEN_ADDRESS_Kovan } from './contracts'
import { getChain } from './chains'
import  { toast } from 'react-hot-toast';

import Bridge from '../Contracts/abis/Bridge.json'
import TokenHelper from './TokenHelper'
import { IAppState } from './types'
import { txType } from 'src/Contracts';


class BridgeWatchService {
  private kovId = 42 // kovan
  private rinId = 4 // rinkeby
  private appState:IAppState 
  private kovBridge:any
  private rinBridge:any
  private handleAddClaim :any

  constructor (appState:IAppState,_handleAddClaim:any) {
      this.appState = appState
      this.handleAddClaim = _handleAddClaim
  }

  public getBridgeContract (chainId: number) {
    const bridgeAddress = getChainContracts(chainId).bridge
    const provider = new ethers.providers.JsonRpcProvider(getChain(chainId).rpc_url)
    const bridge = new ethers.Contract(bridgeAddress, Bridge.abi, provider)

    return bridge
  }

  public async prepareMintTx (targetChain: any, sourceChain: number, token: any, amountWei: ethers.BigNumberish, receiver: any) {
    const tokenName = await TokenHelper.getTokenName(token,this.appState.library,this.appState.account)
    const tokenSymbol = await TokenHelper.getTokenSymbol(token,this.appState.library,this.appState.account)
    const wrappedTokenName = "sb" + tokenName
    const wrappedTokenSymbol = "sb" +tokenSymbol

    const txHash = ethers.utils.solidityKeccak256(
      ['uint16', 'address', 'uint256', 'address', 'string', 'string'],
      [sourceChain, token, amountWei, receiver, wrappedTokenName, wrappedTokenSymbol]
    )

    return {
      targetChain,
      sourceChain,
      token,
      amountWei,
      amount: ethers.utils.formatEther(amountWei),
      receiver,
      wrappedTokenName,
      wrappedTokenSymbol,
      txHash,
      type: txType.MINT
    }
  }

  public async prepareReleaseTx (sourceChain: number, wrappedToken: any, amountWei: ethers.BigNumberish, receiver: any) {
    const wTokens = this.appState.wrappedTokens
    let wToken
    for (let i = 0; i < wTokens.length; i++) {
      if (wrappedToken === wTokens[i].wrappedToken) {
        wToken = wTokens[i]
      }
    }

    const txHash = ethers.utils.solidityKeccak256(
      ['uint16', 'address', 'uint256', 'address'],
      [sourceChain, wToken.token, amountWei, receiver]
    )


    return {
      targetChain: wToken.sourceChain,
      sourceChain,
      token: wToken.token,
      amountWei,
      amount: ethers.utils.formatEther(amountWei),
      receiver,
      txHash,
      type: txType.RELEASE
    }
  }

  public async start () {
    // Rinkeby
    this.rinBridge = this.getBridgeContract(this.rinId)

    this.rinBridge.on("Lock",  async (targetChain:any, token:any,  amountWei:any,receiver:any) => {
      const mintTx = await this.prepareMintTx(targetChain, this.rinId, token, amountWei, receiver)
      this.handleAddClaim(mintTx)
      toast.success(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.rinBridge.on("Mint",(sourceChain:any, amountWei:any, receiver:any) => {
      toast.success(`Claimed ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.rinBridge.on("Burn",async (sourceChain:any, amountWei:any, receiver:any) => {
      const wrappedToken = TOKEN_ADDRESS_Kovan;
      const releaseTx = await this.prepareReleaseTx(sourceChain, wrappedToken, amountWei, receiver)
      this.handleAddClaim(releaseTx)
      toast.success(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.rinBridge.on("Unlock", (sourceChain:any, token:any, amountWei:any, receiver:any) => {
      toast.success(`Claimed ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.kovBridge = this.getBridgeContract(this.kovId)

    this.kovBridge.on("Lock",  async (targetChain:any, token:any,  amountWei:any,receiver:any) => {
      const mintTx = await this.prepareMintTx(targetChain, this.kovId, token, amountWei, receiver)
      this.handleAddClaim(mintTx)
      toast.success(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.kovBridge.on("Mint", (sourceChain:any, amountWei:any, receiver:any) => {
      toast.success(`Claimed ${ethers.utils.formatEther(amountWei)}`)
    })

    this.kovBridge.on("Burn", async (sourceChain:any, amountWei:any, receiver:any) => {
      const wrappedToken = TOKEN_ADDRESS_Kovan;
      const releaseTx = await this.prepareReleaseTx(sourceChain, wrappedToken, amountWei, receiver)
      this.handleAddClaim(releaseTx)
      toast.success(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    this.kovBridge.on("Unlock",(sourceChain:any, token:any, amountWei:any, receiver:any) => {
      toast.success(`Claimed ${ethers.utils.formatEther(amountWei)} tokens`)
    })

  }
}

export default BridgeWatchService
