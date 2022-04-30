import { Payload } from '../generated/schema';
import { RewardCreated } from '../generated/MinimalContract/MinimalContract';
export function handleRewardCreated(event: RewardCreated): void {
  event.params.admin.toHexString();

  let payloadString = event.params.admin.toHexString();

  let payload = Payload.load(payloadString);

  if (payload === null) {
    payload = new Payload(event.params.admin.toHexString());
    payload.owner = event.params.admin;

  }
  payload.payload = event.params.payload;
  payload.save()
}
