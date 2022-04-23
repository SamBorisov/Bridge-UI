export class TransactionChecker {
    protected web3: any = null
    constructor( _web3: any = null) {
        this.web3 =_web3;
    }

    public async getTransaction(_address: string) {
        const address: string = _address.toLowerCase();

        const block = await this.web3.eth.getBlock('latest');

    // let number = block.number;
    // let transactions = block.transactions;
        // console.log('Search Block: ' + transactions);
        const myTransactions : any = [];

        if (block != null && block.transactions != null) {
            for (const txHash of block.transactions) {
                const tx = await this.web3.eth.getTransaction(txHash);
                if (address === tx.to.toLowerCase()) {
                    myTransactions.push(tx);
    //                console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
                }
            }
        }
        return myTransactions;
    }
}