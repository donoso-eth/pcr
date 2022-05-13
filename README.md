# Perpetual Conditional Reward

PCR: Perpetual Conditional Reward
The PCR projects started when a UMA/Superfluid bounty has been communicated. Although the bounty was reserved we continued the project already started to have a working interface/backend

## Major problems it solves

One of the most common problems of DAO's is achieving to have steady involvement of members.
PCR helps to solve this problem proposing a reward to be ditributed upon certain conditions periodically.

An Example:
If

Depoyed dapp on kovan [https://perpetual-conditional-reward.web.app
](https://perpetual-conditional-reward.web.app
)

 
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

The major building blocks in the PCR Angualr Dapp are: Pages/Services and Shared Components

#### Pages:
The frontend has been built with Angular and has 5 main pages.

- Landing Page.

- Home Page. Once the wallet is connected, here we will see the list of PCR Created and PCR Memberships (if any)

- Create PRC Page. Settings for the PCR creation

- Details PCR(only visible for the PCR creator): Details of the PCR (major properties/charts/balances) and available actions (fund/propose/execute, etc.) 

- Details PCR Membership(only visible for members). Details of the awarded membership (major properties/charts/balances) and available actions (claim/approve/propose/execute, etc.) 

#### Services

- Dapp Injector Service. Service providing the blockchain wiring, spinning rpc provider, conencting with wallet (metamask or local), instantiate the pcrhost contract and keep track of the clone implementations of PCrToken and PcrOptiisticOracle [code](https://github.com/donoso-eth/pcr/blob/master/src/app/dapp-injector/dapp-injector.service.ts)

- GraphqlService: Provides "The Graph" data through the subgraph deployed on Kovan. [code](https://github.com/donoso-eth/pcr/blob/master/src/app/dapp-injector/services/graph-ql/graph-ql.service.ts) and main queries [code](https://github.com/donoso-eth/pcr/blob/master/src/app/dapp-injector/services/graph-ql/queryDefinitions.ts)

- SuperFluid Service: Providing an instante of the Framework Object through the sdk-core for querying/approve or claim subscriptions [code](https://github.com/donoso-eth/pcr/blob/master/src/app/dapp-injector/services/super-fluid/super-fluid-service.service.ts)

 
#### Shared Component (main ones) 

- Proposal Detail Component: Proposal flow component, [code](https://github.com/donoso-eth/pcr/tree/master/src/app/shared/components/proposal-detail)

- Charts

## Tech Stack
- Smartcontracts in Solidity
- Development environent and fork with Hardhat
- The graph for queryng data (subgraph created)
- Frontend in Angular Framework



# TestNet Development (KOVAN)
The contracts are deployed on kovan: 
 &nbsp; 

Pcrhost.sol at 0xC9aA24Bb16a018Cb10323821f7cF06d9CDF121E4 [(see on kovan)](https://kovan.etherscan.io/address/0xc9aa24bb16a018cb10323821f7cf06d9cdf121e4) 
  &nbsp; 

 PcrOptimisticOracle.sol (implementation) at 0x6B64E524FEDB8C2B5B4104738E4F2205bB7fcc14 [(see on kovan)](https://kovan.etherscan.io/address/0x6B64E524FEDB8C2B5B4104738E4F2205bB7fcc14) 
  
PcrToken.sol (implementation) at 0xE918889eFB033D2fa197237F5eE27dACEec3ebb8 [(see on kovan)](https://kovan.etherscan.io/address/0xE918889eFB033D2fa197237F5eE27dACEec3ebb8) 
 &nbsp;

Subgraph deployed on [kovan](https://thegraph.com/hosted-service/subgraph/donoso-eth/perpetual-conditional-reward)

For Frontend development and interaction with the deployed contracts on kovan the required config has to be .



# 🏄‍♂️ Local Development

## Kovan Fork

Create a copy of /hardhat/.sample.env and input the deployer key and the kovan_url, the deployer key will only required for deployments on kovan, not to the fork.

Open the first terminal
```javascript
npm run fork
// spin blockchain fork of kovan
```
Open the Second Terminal
```javascript
npm run deploy
// launch, compile, and deploy in watch mode. To deploy on Polygon Testnet, run

```

```javascript
npm run run-graph-node
// spin with docker compose a graph local node
```
Once the graph node is running.
Open the Third Terminal

```javascript
npm run create-graph-local
// create the subgraph locally
```

```javascript
npm run build-graph
// buld the subgraph 
```
```javascript
npm run deploy-graph-local
// ensure in the subgraph.yml file the address of the contract os the one you just deployed and the network in datasource contract and templates is "localhost" not kovan
```

```javascript
ng serve -o
// build the angular dapp and serve on localhost:4200., 

```

