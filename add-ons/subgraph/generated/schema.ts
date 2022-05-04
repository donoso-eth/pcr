// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Reward extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("rewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("currentdeposit", Value.fromBigInt(BigInt.zero()));
    this.set("rewardStatus", Value.fromBigInt(BigInt.zero()));
    this.set("rewardStep", Value.fromBigInt(BigInt.zero()));
    this.set("earliestNextAction", Value.fromBigInt(BigInt.zero()));
    this.set("interval", Value.fromBigInt(BigInt.zero()));
    this.set("target", Value.fromBigInt(BigInt.zero()));
    this.set("targetCondition", Value.fromBigInt(BigInt.zero()));
    this.set("optimisticOracleLivenessTime", Value.fromBigInt(BigInt.zero()));
    this.set("totalDistributed", Value.fromBigInt(BigInt.zero()));
    this.set("currentIndex", Value.fromBigInt(BigInt.zero()));
    this.set("unitsIssued", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Reward entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Reward entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Reward", id.toString(), this);
    }
  }

  static load(id: string): Reward | null {
    return changetype<Reward | null>(store.get("Reward", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string | null {
    let value = this.get("title");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (!value) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(<string>value));
    }
  }

  get url(): string | null {
    let value = this.get("url");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set url(value: string | null) {
    if (!value) {
      this.unset("url");
    } else {
      this.set("url", Value.fromString(<string>value));
    }
  }

  get admin(): string | null {
    let value = this.get("admin");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set admin(value: string | null) {
    if (!value) {
      this.unset("admin");
    } else {
      this.set("admin", Value.fromString(<string>value));
    }
  }

  get rewardToken(): string | null {
    let value = this.get("rewardToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set rewardToken(value: string | null) {
    if (!value) {
      this.unset("rewardToken");
    } else {
      this.set("rewardToken", Value.fromString(<string>value));
    }
  }

  get rewardAmount(): BigInt {
    let value = this.get("rewardAmount");
    return value!.toBigInt();
  }

  set rewardAmount(value: BigInt) {
    this.set("rewardAmount", Value.fromBigInt(value));
  }

  get token(): string | null {
    let value = this.get("token");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set token(value: string | null) {
    if (!value) {
      this.unset("token");
    } else {
      this.set("token", Value.fromString(<string>value));
    }
  }

  get currentdeposit(): BigInt {
    let value = this.get("currentdeposit");
    return value!.toBigInt();
  }

  set currentdeposit(value: BigInt) {
    this.set("currentdeposit", Value.fromBigInt(value));
  }

  get rewardStatus(): BigInt {
    let value = this.get("rewardStatus");
    return value!.toBigInt();
  }

  set rewardStatus(value: BigInt) {
    this.set("rewardStatus", Value.fromBigInt(value));
  }

  get rewardStep(): BigInt {
    let value = this.get("rewardStep");
    return value!.toBigInt();
  }

  set rewardStep(value: BigInt) {
    this.set("rewardStep", Value.fromBigInt(value));
  }

  get earliestNextAction(): BigInt {
    let value = this.get("earliestNextAction");
    return value!.toBigInt();
  }

  set earliestNextAction(value: BigInt) {
    this.set("earliestNextAction", Value.fromBigInt(value));
  }

  get interval(): BigInt {
    let value = this.get("interval");
    return value!.toBigInt();
  }

  set interval(value: BigInt) {
    this.set("interval", Value.fromBigInt(value));
  }

  get target(): BigInt {
    let value = this.get("target");
    return value!.toBigInt();
  }

  set target(value: BigInt) {
    this.set("target", Value.fromBigInt(value));
  }

  get targetCondition(): BigInt {
    let value = this.get("targetCondition");
    return value!.toBigInt();
  }

  set targetCondition(value: BigInt) {
    this.set("targetCondition", Value.fromBigInt(value));
  }

  get rewardTargetHitory(): Array<string> {
    let value = this.get("rewardTargetHitory");
    return value!.toStringArray();
  }

  set rewardTargetHitory(value: Array<string>) {
    this.set("rewardTargetHitory", Value.fromStringArray(value));
  }

  get optimisticOracleLivenessTime(): BigInt {
    let value = this.get("optimisticOracleLivenessTime");
    return value!.toBigInt();
  }

  set optimisticOracleLivenessTime(value: BigInt) {
    this.set("optimisticOracleLivenessTime", Value.fromBigInt(value));
  }

  get priceIdentifier(): Bytes | null {
    let value = this.get("priceIdentifier");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set priceIdentifier(value: Bytes | null) {
    if (!value) {
      this.unset("priceIdentifier");
    } else {
      this.set("priceIdentifier", Value.fromBytes(<Bytes>value));
    }
  }

  get customAncillaryData(): Bytes | null {
    let value = this.get("customAncillaryData");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set customAncillaryData(value: Bytes | null) {
    if (!value) {
      this.unset("customAncillaryData");
    } else {
      this.set("customAncillaryData", Value.fromBytes(<Bytes>value));
    }
  }

  get totalDistributed(): BigInt {
    let value = this.get("totalDistributed");
    return value!.toBigInt();
  }

  set totalDistributed(value: BigInt) {
    this.set("totalDistributed", Value.fromBigInt(value));
  }

  get currentIndex(): BigInt {
    let value = this.get("currentIndex");
    return value!.toBigInt();
  }

  set currentIndex(value: BigInt) {
    this.set("currentIndex", Value.fromBigInt(value));
  }

  get unitsIssued(): BigInt {
    let value = this.get("unitsIssued");
    return value!.toBigInt();
  }

  set unitsIssued(value: BigInt) {
    this.set("unitsIssued", Value.fromBigInt(value));
  }

  get rewardIndexHistory(): Array<string> {
    let value = this.get("rewardIndexHistory");
    return value!.toStringArray();
  }

  set rewardIndexHistory(value: Array<string>) {
    this.set("rewardIndexHistory", Value.fromStringArray(value));
  }
}

export class Subscription extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("units", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Subscription entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Subscription entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Subscription", id.toString(), this);
    }
  }

  static load(id: string): Subscription | null {
    return changetype<Subscription | null>(store.get("Subscription", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get units(): BigInt {
    let value = this.get("units");
    return value!.toBigInt();
  }

  set units(value: BigInt) {
    this.set("units", Value.fromBigInt(value));
  }
}

export class RewardTargetHitory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("reward", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save RewardTargetHitory entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save RewardTargetHitory entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("RewardTargetHitory", id.toString(), this);
    }
  }

  static load(id: string): RewardTargetHitory | null {
    return changetype<RewardTargetHitory | null>(
      store.get("RewardTargetHitory", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reward(): string {
    let value = this.get("reward");
    return value!.toString();
  }

  set reward(value: string) {
    this.set("reward", Value.fromString(value));
  }

  get target(): BigInt | null {
    let value = this.get("target");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set target(value: BigInt | null) {
    if (!value) {
      this.unset("target");
    } else {
      this.set("target", Value.fromBigInt(<BigInt>value));
    }
  }

  get targetCondition(): BigInt | null {
    let value = this.get("targetCondition");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set targetCondition(value: BigInt | null) {
    if (!value) {
      this.unset("targetCondition");
    } else {
      this.set("targetCondition", Value.fromBigInt(<BigInt>value));
    }
  }

  get timeStamp(): BigInt | null {
    let value = this.get("timeStamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timeStamp(value: BigInt | null) {
    if (!value) {
      this.unset("timeStamp");
    } else {
      this.set("timeStamp", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class RewardIndexHistory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("reward", Value.fromString(""));
    this.set("index", Value.fromBigInt(BigInt.zero()));
    this.set("timeStamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save RewardIndexHistory entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save RewardIndexHistory entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("RewardIndexHistory", id.toString(), this);
    }
  }

  static load(id: string): RewardIndexHistory | null {
    return changetype<RewardIndexHistory | null>(
      store.get("RewardIndexHistory", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reward(): string {
    let value = this.get("reward");
    return value!.toString();
  }

  set reward(value: string) {
    this.set("reward", Value.fromString(value));
  }

  get index(): BigInt {
    let value = this.get("index");
    return value!.toBigInt();
  }

  set index(value: BigInt) {
    this.set("index", Value.fromBigInt(value));
  }

  get timeStamp(): BigInt {
    let value = this.get("timeStamp");
    return value!.toBigInt();
  }

  set timeStamp(value: BigInt) {
    this.set("timeStamp", Value.fromBigInt(value));
  }
}

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("proposer", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proposal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Proposal entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Proposal", id.toString(), this);
    }
  }

  static load(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get("Proposal", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get proposer(): string {
    let value = this.get("proposer");
    return value!.toString();
  }

  set proposer(value: string) {
    this.set("proposer", Value.fromString(value));
  }

  get reward(): string | null {
    let value = this.get("reward");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set reward(value: string | null) {
    if (!value) {
      this.unset("reward");
    } else {
      this.set("reward", Value.fromString(<string>value));
    }
  }

  get timeStamp(): BigInt | null {
    let value = this.get("timeStamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timeStamp(value: BigInt | null) {
    if (!value) {
      this.unset("timeStamp");
    } else {
      this.set("timeStamp", Value.fromBigInt(<BigInt>value));
    }
  }

  get status(): string | null {
    let value = this.get("status");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set status(value: string | null) {
    if (!value) {
      this.unset("status");
    } else {
      this.set("status", Value.fromString(<string>value));
    }
  }
}

export class ProposalSummary extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("reward", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProposalSummary entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ProposalSummary entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ProposalSummary", id.toString(), this);
    }
  }

  static load(id: string): ProposalSummary | null {
    return changetype<ProposalSummary | null>(store.get("ProposalSummary", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get reward(): string {
    let value = this.get("reward");
    return value!.toString();
  }

  set reward(value: string) {
    this.set("reward", Value.fromString(value));
  }

  get timeStamp(): BigInt | null {
    let value = this.get("timeStamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timeStamp(value: BigInt | null) {
    if (!value) {
      this.unset("timeStamp");
    } else {
      this.set("timeStamp", Value.fromBigInt(<BigInt>value));
    }
  }

  get result(): BigInt | null {
    let value = this.get("result");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set result(value: BigInt | null) {
    if (!value) {
      this.unset("result");
    } else {
      this.set("result", Value.fromBigInt(<BigInt>value));
    }
  }
}
