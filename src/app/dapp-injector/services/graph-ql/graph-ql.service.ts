import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';


const userSubscriptions = gql`
  {
    userSubscriptions(first: 5) {
   
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

const rewards = gql`
  {
    rewards(first: 5) {
      id
      admin
      rewardAmount
      rewardToken
      currentdeposit
      customAncillaryData
      token
      title
      url
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

@Injectable({
  providedIn: 'root',
})
export class GraphQlService implements OnDestroy {
  tokens$ = new Subject();

  private tokensSubscription!: Subscription;

  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.tokensSubscription.unsubscribe();
  }

  watchTokens() {
    this.tokensSubscription = this.apollo
      .watchQuery<any>({
        query: rewards,
        pollInterval: 500,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.tokens$.next(data);
      });
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

}
