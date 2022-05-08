import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { BehaviorSubject, firstValueFrom, Subject, Subscription } from 'rxjs';

const GET_QUERY = `
  query($receiver: String!){
    streams(where:{
          receiver: $receiver
        }
       ) {
    	token {
        id
        symbol
      }
      createdAtTimestamp
	    updatedAtTimestamp
	    currentFlowRate
	    streamedUntilUpdatedAt
        }
  }
`;

const GET_USER = `
query($address: String!){
    user(id:$address) {
      id
      rewardsCreated {  
      id
      title
      rewardStep 
      earliestNextAction
      rewardToken
      rewardAmount
      }
      rewardsMembership {
      id
      units
      reward  {  
        id
        title
        rewardStep 
        earliestNextAction
        rewardToken
        currentIndex
        rewardAmount
        }
      }
      proposaslsSubmitted
    }
  }
`;

const userMemberships = gql`
  {
    userMemberships(first: 5) {
      units
    }
  }
`;

const indexes = gql`
  {
    rewardIndexHistories(first: 5) {
      index
      reward
      timeStamp
    }
  }
`;

const proposals = gql`
  {
    proposals(first: 5) {
      id
      proposer
      reward
      status
    }
  }
`;

const GET_REWARD = `
query($id: String!)
  {
    reward(id:$id) {
      id
      admin {
        id
      }
      rewardAmount
      rewardToken
      currentdeposit
      customAncillaryData
      token
      title
      url
      tokenImpl
      optimisticOracleImpl
      earliestNextAction
      interval
      rewardStep
      rewardStatus
      totalDistributed
      currentIndex
      unitsIssued
    }
  }
`;


const GET_MEMBERSHIP = `
query($id: String!)
  {
    userMembership(id:$id) {
      id
      units
      reward {
      rewardAmount
      rewardToken
      currentdeposit
      customAncillaryData
      token
      title
      url
      tokenImpl
      optimisticOracleImpl
      earliestNextAction
      interval
      rewardStep
      rewardStatus
      totalDistributed
      currentIndex
      unitsIssued
      }
    }
  }
`;


@Injectable({
  providedIn: 'root',
})
export class GraphQlService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {}

  watchTokens(id: string) {
    const variables = { id: id };
    return this.apollo.watchQuery<any>({
      query: gql(GET_REWARD),
      pollInterval: 500,
      variables,
    }).valueChanges;
  }

  watchMemberships(id: string) {
    const variables = { id: id };
    return this.apollo.watchQuery<any>({
      query: gql(GET_MEMBERSHIP),
      pollInterval: 500,
      variables,
    }).valueChanges;
  }



  async query() {
    try {
      const posts = await this.apollo
        .query<any>({
          query: proposals,
        })
        .toPromise();

      console.log(posts);
      return posts;
    } catch (error) {
      console.log(error);
      return {};
    }

    // this.querySubscription = this.postsQuery.valueChanges.subscribe(({ data, loading }) => {
    //   this.loading = loading;
    //   this.posts = data.posts;
    // });
  }

  async queryIndexes() {
    try {
      const posts = await this.apollo
        .query<any>({
          query: indexes,
        })
        .toPromise();

      console.log(posts);
      return posts;
    } catch (error) {
      console.log(error);
      return {};
    }

    // this.querySubscription = this.postsQuery.valueChanges.subscribe(({ data, loading }) => {
    //   this.loading = loading;
    //   this.posts = data.posts;
    // });
  }

  queryUser(address: string) {
    const variables = { address: address.toLowerCase() };
    return this.apollo.watchQuery<any>({
      query: gql(GET_USER),
      variables,
    }).valueChanges;
  }
}
