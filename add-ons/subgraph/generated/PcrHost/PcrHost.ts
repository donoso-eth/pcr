// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class RewardCreated extends ethereum.Event {
  get params(): RewardCreated__Params {
    return new RewardCreated__Params(this);
  }
}

export class RewardCreated__Params {
  _event: RewardCreated;

  constructor(event: RewardCreated) {
    this._event = event;
  }

  get reward(): RewardCreatedRewardStruct {
    return changetype<RewardCreatedRewardStruct>(
      this._event.parameters[0].value.toTuple()
    );
  }
}

export class RewardCreatedRewardStruct extends ethereum.Tuple {
  get admin(): Address {
    return this[0].toAddress();
  }

  get target(): BigInt {
    return this[1].toBigInt();
  }

  get rewardToken(): Address {
    return this[2].toAddress();
  }

  get token(): string {
    return this[3].toString();
  }

  get pcrId(): BigInt {
    return this[4].toBigInt();
  }

  get earliestNextAction(): BigInt {
    return this[5].toBigInt();
  }

  get optimisticOracleInput(): RewardCreatedRewardOptimisticOracleInputStruct {
    return changetype<
      RewardCreatedRewardOptimisticOracleInputStruct
    >(this[6].toTuple());
  }

  get tokenContract(): Address {
    return this[7].toAddress();
  }

  get optimisticOracleContract(): Address {
    return this[8].toAddress();
  }

  get title(): string {
    return this[9].toString();
  }

  get url(): string {
    return this[10].toString();
  }
}

export class RewardCreatedRewardOptimisticOracleInputStruct extends ethereum.Tuple {
  get finder(): Address {
    return this[0].toAddress();
  }

  get target(): BigInt {
    return this[1].toBigInt();
  }

  get targetCondition(): i32 {
    return this[2].toI32();
  }

  get rewardAmount(): BigInt {
    return this[3].toBigInt();
  }

  get interval(): BigInt {
    return this[4].toBigInt();
  }

  get optimisticOracleLivenessTime(): BigInt {
    return this[5].toBigInt();
  }

  get priceIdentifier(): Bytes {
    return this[6].toBytes();
  }

  get customAncillaryData(): Bytes {
    return this[7].toBytes();
  }
}

export class PcrHost extends ethereum.SmartContract {
  static bind(address: Address): PcrHost {
    return new PcrHost("PcrHost", address);
  }
}
