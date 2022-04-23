import { IStorage } from "./types";

const defaulStorage: IStorage = {
    provider: {},
    library: {},
    account: '',
    fetching: false,
    connected: false,
    chainId: 1,
    claims: [],
    wrappedTokens: []
 }

class LocalStorage{
    public storage: IStorage= defaulStorage
    
    constructor() {
        const strStorage= localStorage.getItem("storage")
        if (strStorage) {
        this.storage=JSON.parse(strStorage);
        }
        else {
            this.storage = defaulStorage
        }
    }
    public saveStore () {
        localStorage.setItem("storage", JSON.stringify(this.storage));
    }
     
    public resetStore () {
        this.storage = defaulStorage
    }
    public updateProvider ( value: any) {
        this.storage.provider = value
    }
    public updateLibrary (value: any) {
        this.storage.library = value
    }
    public updateAccount ( value: any) {
        this.storage.account = value
    }
    public updateConnected ( value: any) {
    this.storage.connected = value
    }
    public  updateChainId ( value: any) {
        this.storage.chainId = value
    }
    public addClaim ( value: any) {
        this.storage.claims.push(value)
    }
    public RemoveClaim ( index: any) {
        this.storage.claims.splice(index,1)
    }
    public  setWrappedTokens ( value: any) {
        this.storage.wrappedTokens = value
    }
}
export default LocalStorage
