const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const sender = StellarSdk.Keypair.fromSecret('SENDER_SECRET_KEY');
const receiver = StellarSdk.Keypair.fromPublicKey('RECEIVER_PUBLIC_KEY');

async function sendPayment(amount, message) {
    const account = await server.loadAccount(sender.publicKey());
    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: fee,
        networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.payment({
        destination: receiver.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: amount,
    }))
    .addMemo(StellarSdk.Memo.text(message))
    .setTimeout(30)
    .build();

    transaction.sign(sender);
    try {
        const result = await server.submitTransaction(transaction);
        console.log('Transaction successful:', result);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

sendPayment('10', 'This is a test payment');

async function checkBalance(publicKey) {
    const account = await server.loadAccount(publicKey);
    account.balances.forEach((balance) => {
        console.log(`Type: ${balance.asset_type}, Balance: ${balance.balance}`);
    });
}

checkBalance(sender.publicKey());

checkBalance(receiver.publicKey());
