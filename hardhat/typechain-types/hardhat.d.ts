/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Upgradeable__factory>;
    getContractFactory(
      name: "IERC20MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC777",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC777__factory>;
    getContractFactory(
      name: "IERC777",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC777__factory>;
    getContractFactory(
      name: "IERC777Recipient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC777Recipient__factory>;
    getContractFactory(
      name: "IERC777Sender",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC777Sender__factory>;
    getContractFactory(
      name: "IERC1820Registry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1820Registry__factory>;
    getContractFactory(
      name: "SuperAppBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SuperAppBase__factory>;
    getContractFactory(
      name: "IInstantDistributionAgreementV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInstantDistributionAgreementV1__factory>;
    getContractFactory(
      name: "ISuperAgreement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperAgreement__factory>;
    getContractFactory(
      name: "ISuperApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperApp__factory>;
    getContractFactory(
      name: "ISuperfluid",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluid__factory>;
    getContractFactory(
      name: "ISuperfluidGovernance",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluidGovernance__factory>;
    getContractFactory(
      name: "ISuperfluidToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluidToken__factory>;
    getContractFactory(
      name: "ISuperToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperToken__factory>;
    getContractFactory(
      name: "ISuperTokenFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperTokenFactory__factory>;
    getContractFactory(
      name: "ERC20WithTokenInfo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20WithTokenInfo__factory>;
    getContractFactory(
      name: "TokenInfo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenInfo__factory>;
    getContractFactory(
      name: "SuperfluidToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SuperfluidToken__factory>;
    getContractFactory(
      name: "SuperToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SuperToken__factory>;
    getContractFactory(
      name: "UUPSProxiable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSProxiable__factory>;
    getContractFactory(
      name: "Lockable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lockable__factory>;
    getContractFactory(
      name: "MultiCaller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiCaller__factory>;
    getContractFactory(
      name: "Testable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Testable__factory>;
    getContractFactory(
      name: "Timer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Timer__factory>;
    getContractFactory(
      name: "AddressWhitelistInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AddressWhitelistInterface__factory>;
    getContractFactory(
      name: "OptimisticOracleConstraints",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OptimisticOracleConstraints__factory>;
    getContractFactory(
      name: "OracleInterfaces",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OracleInterfaces__factory>;
    getContractFactory(
      name: "FinderInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FinderInterface__factory>;
    getContractFactory(
      name: "IdentifierWhitelistInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IdentifierWhitelistInterface__factory>;
    getContractFactory(
      name: "OptimisticOracleInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OptimisticOracleInterface__factory>;
    getContractFactory(
      name: "StoreInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StoreInterface__factory>;
    getContractFactory(
      name: "IPcrHost",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPcrHost__factory>;
    getContractFactory(
      name: "IPcrOptimisticOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPcrOptimisticOracle__factory>;
    getContractFactory(
      name: "IPcrToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPcrToken__factory>;
    getContractFactory(
      name: "Events",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Events__factory>;
    getContractFactory(
      name: "PcrHost",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PcrHost__factory>;
    getContractFactory(
      name: "PcrOptimisticOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PcrOptimisticOracle__factory>;
    getContractFactory(
      name: "PcrToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PcrToken__factory>;

    getContractAt(
      name: "ERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Upgradeable>;
    getContractAt(
      name: "IERC20MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20MetadataUpgradeable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC777",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC777>;
    getContractAt(
      name: "IERC777",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC777>;
    getContractAt(
      name: "IERC777Recipient",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC777Recipient>;
    getContractAt(
      name: "IERC777Sender",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC777Sender>;
    getContractAt(
      name: "IERC1820Registry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1820Registry>;
    getContractAt(
      name: "SuperAppBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SuperAppBase>;
    getContractAt(
      name: "IInstantDistributionAgreementV1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInstantDistributionAgreementV1>;
    getContractAt(
      name: "ISuperAgreement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperAgreement>;
    getContractAt(
      name: "ISuperApp",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperApp>;
    getContractAt(
      name: "ISuperfluid",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluid>;
    getContractAt(
      name: "ISuperfluidGovernance",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluidGovernance>;
    getContractAt(
      name: "ISuperfluidToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluidToken>;
    getContractAt(
      name: "ISuperToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperToken>;
    getContractAt(
      name: "ISuperTokenFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperTokenFactory>;
    getContractAt(
      name: "ERC20WithTokenInfo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20WithTokenInfo>;
    getContractAt(
      name: "TokenInfo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenInfo>;
    getContractAt(
      name: "SuperfluidToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SuperfluidToken>;
    getContractAt(
      name: "SuperToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SuperToken>;
    getContractAt(
      name: "UUPSProxiable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSProxiable>;
    getContractAt(
      name: "Lockable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Lockable>;
    getContractAt(
      name: "MultiCaller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiCaller>;
    getContractAt(
      name: "Testable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Testable>;
    getContractAt(
      name: "Timer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Timer>;
    getContractAt(
      name: "AddressWhitelistInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AddressWhitelistInterface>;
    getContractAt(
      name: "OptimisticOracleConstraints",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OptimisticOracleConstraints>;
    getContractAt(
      name: "OracleInterfaces",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OracleInterfaces>;
    getContractAt(
      name: "FinderInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FinderInterface>;
    getContractAt(
      name: "IdentifierWhitelistInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IdentifierWhitelistInterface>;
    getContractAt(
      name: "OptimisticOracleInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OptimisticOracleInterface>;
    getContractAt(
      name: "StoreInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StoreInterface>;
    getContractAt(
      name: "IPcrHost",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPcrHost>;
    getContractAt(
      name: "IPcrOptimisticOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPcrOptimisticOracle>;
    getContractAt(
      name: "IPcrToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPcrToken>;
    getContractAt(
      name: "Events",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Events>;
    getContractAt(
      name: "PcrHost",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PcrHost>;
    getContractAt(
      name: "PcrOptimisticOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PcrOptimisticOracle>;
    getContractAt(
      name: "PcrToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PcrToken>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
