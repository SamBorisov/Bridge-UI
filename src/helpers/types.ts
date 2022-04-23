export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string;
  contractAddress: string;
  balance?: string;
}

export interface IChainData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  chain_id: number;
  network_id: number;
  rpc_url: string;
  native_currency: IAssetData;
  explorer?: string;
}

export interface IContactsData {
  bridge: string;
  chain_id: number;
  token: string;
  balance: string;
}


export interface IAppState {
  fetching: boolean;
  address: string;
  account:string;
  library: any;
  connected: boolean;
  chainId: number;
  pendingRequest: boolean;
  result: any | null;
  electionContract: any | null;
  info: any | null;
  showBalanceModal: boolean;
  showTransactionModal: boolean;
  showTokenTransListModal: boolean;
  showTokenTransDetailModal: boolean;
  claims: any[];
  wrappedTokens: any[],
  detailHash: string;
}

export interface IStorage  {
  provider:any;
  library: any;
  account: string;
  fetching:boolean;
  connected: boolean;
  chainId: number;
  claims: any[];
  wrappedTokens: any[]
  
}