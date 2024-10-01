![robot_mascot2](https://github.com/user-attachments/assets/de6b09dc-b012-45ff-adc2-fd9db565b343)

# Stellar Payment and Messaging System
This project is a blockchain-based payment and messaging system built on the Stellar network. It allows users to send payments in XLM with messages, schedule recurring payments, perform multi-recipient transfers, and view transaction history.

# Features
- Send payments with custom messages (text memos)
- Schedule recurring payments
- Transfer funds to multiple recipients in one transaction
- View account balances and transaction history

# Prerequisites
Before you start, ensure you have the following installed:

- Node.js (v12 or higher)
- npm (Node Package Manager)
- Stellar SDK (stellar-sdk)

## 1. Clone the repository
`git clone https://github.com/yourusername/stellar-payment-system.git`

`cd stellar-payment-system`

## 2. Install dependencies
`npm install`

## 3. Configure Stellar Keys
Replace `SENDER_SECRET_KEY` and  `RECEIVER_PUBLIC_KEY` in the `ìndex.js` file with your own Stellar testnet credentials.

## 4. Run the project
To send a payment or use any feature, run the following command

`node index.js`

# Deployment
For deployment on the Stellar mainnet, change the network configuration in index.js from `StellarSdk.Networks.TESTNET` to `StellarSdk.Networks.PUBLIC.`
