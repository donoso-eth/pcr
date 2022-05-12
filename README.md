# Perpetual Conditional Reward

PCR: Perpetual Conditional Reward
The PCR projects started when a UMA/Superfluid bounty has been communicated. Although the bounty was reserved we continued the project already started to have a working interface/backend

## Major problems it solves

One of the most common problems of DAO's is achieving to have steady involvement of members.
PCR helps to solve this problem proposing a reward to be ditributed upon certain conditions periodically.

An Example:
If

 
 &nbsp;
# Architecure
### Contracts
The three solidity contracts the PCR uses:
- PcrHost.sol. Contrat to create the Perpetual Conditional Reward. When creating a new reward, PcrHost will clone the implementations of the PcrOptimisticOracle.sol and the PcrToken.Sol.

- PcrOptimisticOracle.sol. Implementation of the the UMA Optimistic Oracle.

- PcrToken.Sol. Implementation of the Superfluid Intant Distribuition agreement, implements de ERC777 receiver (PcrOptimisticOracle.sol send tokens) to launch the distribution.

### Subgraph
One subgraph is created with data source the "createRewardEvent" in the PCRHost.sol contract.
This subgrap uses the templates for listening to events of the cloned contracts PcrOptimisticOracle.sol and PcrToken.Sol.


### Fronted
The frontend has been built with Angular and has 4 main pages.

- Landing Page.

- Home Page. Once the wallet is connected, here we will see the list of PCR Created and PCR Memberships (if any)

- Create PPC Page. Settings for the PCR creation

- Details PCR(only visible for the PCR creator): Details of the PCR (major properties/cahrts/balances) and available actions (fund/propose/execute, etc.) 

- Details PCR Membership

## Tech Stack
- Smartcontracts in Solidity
- Development environent and fork with Hardhat
- The graph for queryng data (subgraph created)
- Frontend in Angular Framework


## TO DO
Additional features can be still implemented, two od:
- Bulk addition of members

## Next steps and hackathon decisions
 &nbsp;


# 🏄‍♂️ Local Development

## Kovan Fork

Create a copy of /hardhat/sample.env

```javascript
npm run chain
// spin blockchain node on localhost creating 10 accounts and private keys
```

```javascript
npm run watch-contract
// launch, compile, and deploy in watch mode. To deploy on Polygon Testnet, run
npm run watch-contract mumbai
// Mumbai deployment requires free Moralis account
```

```javascript
ng serve -o
// build app and serve on localhost:4200. Alternatively, run
ng serve -o -c mumbai
// to use your configured Mumbai testnet wallet
```

### other helpful commands

```javascript
npm run compile
// compile contracts
```

```javascript
npm run deploy
// deploy contract to localhost. Alternatively you can run
npm run deploy:mumbai
// to deploy on Polygon Testnet
```

## testnet/livenet

Either deploying to localhost node or testnet/cloud the conract has to be compiled

```javascript
npm run compile
// compile the demo app contract in hardhat/contracts/demoContract.sol
```

When compiling, the contract artifacts will be created in the angular project assets folder.

🔏 You can edit your smart contract `.sol` in `/hardhat/contracts` and recompile with same command

Now is time to deploy our contract

```javascript
npm run deploy
// deploy the smartcontract to the chosen network.
```

If you want to deploy to a testnet/mainnet the api and private key have to be configured within hardhat/hardhat.config.ts

💼 You can edit your deployment scripts in `/hardhat/deploy`  
 &nbsp;

Developping in the hardhat network it may be useful to use watch hooks for compiling and deploying, if this is required you can avoid the commands 'compile' and 'deploy' and run in watch mode

```javascript
npm run watch-contract
// launch compile and deploy in watch mode.
```

☠️☠️☠️ Don't do watch mode in mainnet  
⚠️⚠️⚠️ Take care watching in the testnet, test ether is free but you are required to have some  
 &nbsp;  
 **Testing Solidity Contracts**
The schematics also include the hardhat test configuration and infrastructure for solidity contract testing  
 &nbsp;

```javascript
npm run contracts:test
// run the contract tests
```

```javascript
npm run contracts:coverage
// Contracts solidity test coverage analysis
```

&nbsp;
