export const APP_INFURA_API_KEY = process.env.INFURA_API_KEY;
export const EtherscanProvider_API_KEY= process.env.ETHERSCAN_API_KEY;
export const networks = [
  { label: 'Ethereum Kovan', value: '42' },
  { label: 'Ethereum Rinkeb', value: '4' }
];

export const txType = Object.freeze({
  MINT: 'mint',
  UNLOCK: 'unlock'
})
