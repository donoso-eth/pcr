/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type PCRHOSTCONFIGINPUTStruct = {
  pcrTokenImpl: string;
  pcrOptimisticOracleImpl: string;
  title: string;
  url: string;
};

export type PCRHOSTCONFIGINPUTStructOutput = [
  string,
  string,
  string,
  string
] & {
  pcrTokenImpl: string;
  pcrOptimisticOracleImpl: string;
  title: string;
  url: string;
};

export type IDAINPUTStruct = { host: string; ida: string; rewardToken: string };

export type IDAINPUTStructOutput = [string, string, string] & {
  host: string;
  ida: string;
  rewardToken: string;
};

export type OPTIMISTICORACLEINPUTStruct = {
  finder: string;
  target: BigNumberish;
  targetCondition: BigNumberish;
  rewardAmount: BigNumberish;
  interval: BigNumberish;
  optimisticOracleLivenessTime: BigNumberish;
  priceIdentifier: BytesLike;
  customAncillaryData: BytesLike;
};

export type OPTIMISTICORACLEINPUTStructOutput = [
  string,
  BigNumber,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  finder: string;
  target: BigNumber;
  targetCondition: number;
  rewardAmount: BigNumber;
  interval: BigNumber;
  optimisticOracleLivenessTime: BigNumber;
  priceIdentifier: string;
  customAncillaryData: string;
};

export type PcrAddressesStruct = {
  tokenContract: string;
  optimisticOracleContract: string;
};

export type PcrAddressesStructOutput = [string, string] & {
  tokenContract: string;
  optimisticOracleContract: string;
};

export interface PcrHostInterface extends utils.Interface {
  functions: {
    "_pcrTokensIssued()": FunctionFragment;
    "createPcrReward((address,address,string,string),(address,address,address),(address,int256,uint8,uint256,uint256,uint256,bytes32,bytes))": FunctionFragment;
    "getNumbersOfPcrTokens()": FunctionFragment;
    "getTokensAddressByUserAndId(address,uint256)": FunctionFragment;
    "getTotalPcrTokensByUser(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_pcrTokensIssued",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createPcrReward",
    values: [
      PCRHOSTCONFIGINPUTStruct,
      IDAINPUTStruct,
      OPTIMISTICORACLEINPUTStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getNumbersOfPcrTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokensAddressByUserAndId",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalPcrTokensByUser",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "_pcrTokensIssued",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createPcrReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumbersOfPcrTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokensAddressByUserAndId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalPcrTokensByUser",
    data: BytesLike
  ): Result;

  events: {};
}

export interface PcrHost extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PcrHostInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _pcrTokensIssued(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    createPcrReward(
      pcrHostConfig: PCRHOSTCONFIGINPUTStruct,
      _ida: IDAINPUTStruct,
      _optimisticOracleInput: OPTIMISTICORACLEINPUTStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getNumbersOfPcrTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    getTokensAddressByUserAndId(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[PcrAddressesStructOutput]>;

    getTotalPcrTokensByUser(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  _pcrTokensIssued(overrides?: CallOverrides): Promise<BigNumber>;

  createPcrReward(
    pcrHostConfig: PCRHOSTCONFIGINPUTStruct,
    _ida: IDAINPUTStruct,
    _optimisticOracleInput: OPTIMISTICORACLEINPUTStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getNumbersOfPcrTokens(overrides?: CallOverrides): Promise<BigNumber>;

  getTokensAddressByUserAndId(
    _owner: string,
    _id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<PcrAddressesStructOutput>;

  getTotalPcrTokensByUser(
    _owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    _pcrTokensIssued(overrides?: CallOverrides): Promise<BigNumber>;

    createPcrReward(
      pcrHostConfig: PCRHOSTCONFIGINPUTStruct,
      _ida: IDAINPUTStruct,
      _optimisticOracleInput: OPTIMISTICORACLEINPUTStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getNumbersOfPcrTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getTokensAddressByUserAndId(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PcrAddressesStructOutput>;

    getTotalPcrTokensByUser(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    _pcrTokensIssued(overrides?: CallOverrides): Promise<BigNumber>;

    createPcrReward(
      pcrHostConfig: PCRHOSTCONFIGINPUTStruct,
      _ida: IDAINPUTStruct,
      _optimisticOracleInput: OPTIMISTICORACLEINPUTStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getNumbersOfPcrTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getTokensAddressByUserAndId(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalPcrTokensByUser(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _pcrTokensIssued(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createPcrReward(
      pcrHostConfig: PCRHOSTCONFIGINPUTStruct,
      _ida: IDAINPUTStruct,
      _optimisticOracleInput: OPTIMISTICORACLEINPUTStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getNumbersOfPcrTokens(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokensAddressByUserAndId(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalPcrTokensByUser(
      _owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
