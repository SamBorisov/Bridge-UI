import * as React from 'react';
import styled from 'styled-components';

import Web3Modal from 'web3modal';

// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import Column from './components/Column';
import Wrapper from './components/Wrapper';
import Header from './components/Header';
import Loader from './components/Loader';
import ConnectButton from './components/ConnectButton';

import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from './helpers/utilities';

import BalanceModal from './components/BalanceModal';
import TransactionModal from './components/TransactionModal';
import TokenTransListModal from './components/TokenTransListModal';
import TokenHelper from './helpers/TokenHelper';
import TokenTransDetailModal from './components/TokenTransDetailModal';
import { IAppState } from './helpers/types';
import BridgeWatchService from './helpers/BridgeWatchService';
import { getChainContracts } from './helpers/contracts';
import LocalStorage from './helpers/storage';


const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

let TTBalance = '0';

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  account:'',
  library: null,
  connected: false,
  chainId: 1,
  pendingRequest: false,
  result: null,
  electionContract: null,
  info: null,
  showBalanceModal:false,
  showTransactionModal:false,
  showTokenTransListModal:false,
  showTokenTransDetailModal:false,
  claims: [],
  wrappedTokens: [],
  detailHash: '',
};

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public store : LocalStorage;
  public provider: any;
  public watcher : BridgeWatchService;


  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
    this.store = new LocalStorage();
    this.state.claims = this.store.storage.claims;
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });

    
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }
  
  public handleOpenTokenTransListModal= () => {
    this.setState({showBalanceModal: false})
    this.setState({showTransactionModal: false})
    this.setState({showTokenTransListModal: true})
   }

  public handleCloseBalanceModal = () => {
   this.setState({showBalanceModal: false})
  }

  public handleCloseTokenTransListModal = () => {
    this.setState({showTokenTransListModal: false})
   }
 
   public handleCloseTokenTransDetailModal = () => {
    this.setState({showTokenTransDetailModal: false})
   }
  public handleShowTokenTransDetailModal = (hash: any) => {
    this.setState({showTokenTransDetailModal: true})
    this.setState({detailHash: hash})
  }
 
  public RemoveClaim = async (key: any) =>{
      this.store.RemoveClaim(key)
      this.store.saveStore()
      this.setState({claims: this.store.storage.claims})
  }
  public AddClaim = async (claim: any) =>{
      this.store.addClaim(claim)
      this.store.saveStore()
      this.setState({claims: this.store.storage.claims})
  }

  public handleGetBalance = async () => {
  //  debugger;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
  
    // const balance  = await window.ethereum.request({ method: 'eth_getBalance' , params: [ account, 'latest' ]})
    const contractAddress=getChainContracts(this.state.chainId).balance;
    const library = new Web3Provider(this.provider);
    TTBalance = await TokenHelper.getTokenBalance(contractAddress,library,account);
    // // // Returns a hex value of Wei
    // const wei = parseInt(balance, 16)
    // const gwei = (wei / Math.pow(10, 9)) // parse to Gwei
    // const eth = (wei / Math.pow(10, 18))// parse to ETH
  
    // ethBalance = { wei, gwei, eth }
    // this.setShowBalanceModal(true) 
    this.setState({showTransactionModal: false})
    this.setState({showTokenTransListModal: false})
    this.setState({showTokenTransDetailModal: false})
    this.setState({showBalanceModal: true})
   
  }

  public handleOpenTransactionModal = () => {
    this.setState({showBalanceModal: false})
    this.setState({showTokenTransListModal: false})
    this.setState({showTransactionModal: true})
  }
 
  public handleCloseTransactionModal = () => {
    this.setState({showTransactionModal: false})
  }
 
  public handleSendTransaction = async (sender:string , receiver:string, amount:any) => {
    const gasPrice = '0x5208' // 21000 Gas Price
    const amountHex = (amount * Math.pow(10,18)).toString(16)
    
    const tx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    }

    await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})

    this.handleCloseTransactionModal()
  }

  public onConnect = async () => {
  //  [this.showBalanceModal, this.setShowBalanceModal] = React.useState(false);
    this.provider = await this.web3Modal.connect();

    const library = new Web3Provider(this.provider);

    const network = await library.getNetwork();

    const address = this.provider.selectedAddress ? this.provider.selectedAddress : this.provider.accounts[0];

    // const account = this.provider.accounts[0];

    await this.setState({
      library,
      chainId: network.chainId,
      address,
      connected: true
    });

    await this.subscribeToProviderEvents(this.provider);
    this.watcher = new BridgeWatchService(this.state,this.AddClaim);
    this.watcher.start();
  };

  public subscribeToProviderEvents = async (provider:any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", this.changedAccount);
    provider.on("networkChanged", this.networkChanged);
    provider.on("close", this.close);

    await this.web3Modal.off('accountsChanged');
  };

  public async unSubscribe(provider:any) {
    // Workaround for metamask widget > 9.0.3 (provider.off is undefined);
    window.location.reload();
    if (!provider.off) {
      return;
    }

    provider.off("accountsChanged", this.changedAccount);
    provider.off("networkChanged", this.networkChanged);
    provider.off("close", this.close);
  }

  public changedAccount = async (accounts: string[]) => {
    if(!accounts.length) {
      // Metamask Lock fire an empty accounts array 
      await this.resetApp();
    } else {
      await this.setState({ address: accounts[0] });
    }
  }

  public networkChanged = async (networkId: number) => {
    const library = new Web3Provider(this.provider);
    const network = await library.getNetwork();
    const chainId = network.chainId;
    await this.setState({ chainId, library });
  }
  
  public close = async () => {
    this.resetApp();
  }

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  public resetApp = async () => {
    await this.web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");
    this.store.resetStore();
    await this.unSubscribe(this.provider);

    this.setState({ ...INITIAL_STATE });

  };

  public render = () => {
    const {
      address,
      connected,
      chainId,
      fetching,
      showBalanceModal,
      showTransactionModal,
      showTokenTransListModal,
      showTokenTransDetailModal,
      detailHash
    } = this.state;
    return (
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            showBalanceModal={showBalanceModal}
            showTransactionModal = {showTransactionModal}
            showTransactionList = {showTokenTransListModal}
            killSession={this.resetApp}
            GetBalance={this.handleGetBalance}
            ShowNewTran={this.handleOpenTransactionModal}
            ShowTranList={this.handleOpenTokenTransListModal}
          />
          <SContent>
            {fetching ? (
              <Column center>
                <SContainer>
                  <Loader />
                </SContainer>
              </Column>
            ) : (
                <SLanding center>
                  {!this.state.connected && <ConnectButton onClick={this.onConnect} />}
                </SLanding>
              )}
          </SContent>
        </Column>
        <BalanceModal handleCloseModal={this.handleCloseBalanceModal} balance={TTBalance} show={showBalanceModal} appState={this.state} />
        <TransactionModal handleRemoveClaim={this.RemoveClaim} handleCloseModal={this.handleCloseTransactionModal}  handleSendTransaction={this.handleSendTransaction} showTransactionModal={showTransactionModal} AppState={this.state} />
        <TokenTransListModal handleCloseModal={this.handleCloseTokenTransListModal} handleShowDetails={this.handleShowTokenTransDetailModal} show={showTokenTransListModal}  provider={this.provider} address={address}  /> 
        <TokenTransDetailModal handleCloseModal={this.handleCloseTokenTransDetailModal} provider={this.provider} transactionHash={detailHash}  show={showTokenTransDetailModal}/>
      
     </SLayout>
    );
  };
}

export default App;
