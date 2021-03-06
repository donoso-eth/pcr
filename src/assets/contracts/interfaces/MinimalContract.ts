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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface MinimalContractInterface extends utils.Interface {
  functions: {
    "testEvent(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "testEvent",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "testEvent", data: BytesLike): Result;

  events: {
    "RewardCreated(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RewardCreated"): EventFragment;
}

export type RewardCreatedEvent = TypedEvent<
  [string, BigNumber],
  { admin: string; payload: BigNumber }
>;

export type RewardCreatedEventFilter = TypedEventFilter<RewardCreatedEvent>;

export interface MinimalContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MinimalContractInterface;

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
    testEvent(
      _payload: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  testEvent(
    _payload: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    testEvent(_payload: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "RewardCreated(address,uint256)"(
      admin?: string | null,
      payload?: null
    ): RewardCreatedEventFilter;
    RewardCreated(
      admin?: string | null,
      payload?: null
    ): RewardCreatedEventFilter;
  };

  estimateGas: {
    testEvent(
      _payload: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    testEvent(
      _payload: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
