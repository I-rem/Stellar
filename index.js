const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const sender = StellarSdk.Keypair.fromSecret('SENDER_SECRET_KEY');
const receiver = StellarSdk.Keypair.fromPublicKey('RECEIVER_PUBLIC_KEY');

// Basics
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

// Additional

function schedulePayment(amount, message, interval) {
    setInterval(() => {
        sendPayment(amount, message);
    }, interval); // interval in milliseconds
}

// Sending 10XML per minute
schedulePayment('10', 'Scheduled Payment', 60000);

async function sendMultiPayment(payments) {
    const account = await server.loadAccount(sender.publicKey());
    const fee = await server.fetchBaseFee();

    let transactionBuilder = new StellarSdk.TransactionBuilder(account, {
        fee: fee,
        networkPassphrase: StellarSdk.Networks.TESTNET
    });

    payments.forEach(payment => {
        transactionBuilder = transactionBuilder.addOperation(StellarSdk.Operation.payment({
            destination: payment.receiver,
            asset: StellarSdk.Asset.native(),
            amount: payment.amount
        }));
    });

    const transaction = transactionBuilder.setTimeout(30).build();
    transaction.sign(sender);

    try {
        const result = await server.submitTransaction(transaction);
        console.log('Multi-transaction successful:', result);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Sending multiple payment example
sendMultiPayment([
    { receiver: 'RECEIVER_PUBLIC_KEY_1', amount: '10' },
    { receiver: 'RECEIVER_PUBLIC_KEY_2', amount: '20' }
]);

async function viewTransactionHistory(publicKey) {
    const transactions = await server.transactions().forAccount(publicKey).call();
    transactions.records.forEach(transaction => {
        console.log(`ID: ${transaction.id}, Memo: ${transaction.memo}, Time: ${transaction.created_at}`);
    });
}

viewTransactionHistory(sender.publicKey());

