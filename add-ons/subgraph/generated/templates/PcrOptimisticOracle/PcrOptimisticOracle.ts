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

export class ProposalAccepted extends ethereum.Event {
  get params(): ProposalAccepted__Params {
    return new ProposalAccepted__Params(this);
  }
}

export class ProposalAccepted__Params {
  _event: ProposalAccepted;

  constructor(event: ProposalAccepted) {
    this._event = event;
  }

  get pcrId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get proposalId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ProposalCreated extends ethereum.Event {
  get params(): ProposalCreated__Params {
    return new ProposalCreated__Params(this);
  }
}

export class ProposalCreated__Params {
  _event: ProposalCreated;

  constructor(event: ProposalCreated) {
    this._event = event;
  }

  get proposer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get proposalId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pcrId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get timeStamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ProposalRejected extends ethereum.Event {
  get params(): ProposalRejected__Params {
    return new ProposalRejected__Params(this);
  }
}

export class ProposalRejected__Params {
  _event: ProposalRejected;

  constructor(event: ProposalRejected) {
    this._event = event;
  }

  get pcrId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get proposalId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class RewardDeposit extends ethereum.Event {
  get params(): RewardDeposit__Params {
    return new RewardDeposit__Params(this);
  }
}

export class RewardDeposit__Params {
  _event: RewardDeposit;

  constructor(event: RewardDeposit) {
    this._event = event;
  }

  get pcrId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get depositAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class RewardSwitchStatus extends ethereum.Event {
  get params(): RewardSwitchStatus__Params {
    return new RewardSwitchStatus__Params(this);
  }
}

export class RewardSwitchStatus__Params {
  _event: RewardSwitchStatus;

  constructor(event: RewardSwitchStatus) {
    this._event = event;
  }

  get rewardStatus(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class RewardTargetAndConditionChanged extends ethereum.Event {
  get params(): RewardTargetAndConditionChanged__Params {
    return new RewardTargetAndConditionChanged__Params(this);
  }
}

export class RewardTargetAndConditionChanged__Params {
  _event: RewardTargetAndConditionChanged;

  constructor(event: RewardTargetAndConditionChanged) {
    this._event = event;
  }

  get pcrId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get target(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get targetCondition(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class PcrOptimisticOracle extends ethereum.SmartContract {
  static bind(address: Address): PcrOptimisticOracle {
    return new PcrOptimisticOracle("PcrOptimisticOracle", address);
  }
}
