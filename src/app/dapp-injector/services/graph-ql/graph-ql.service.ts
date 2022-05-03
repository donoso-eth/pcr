import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

const rewards = gql`
{
  rewards(first: 5) {
    id
    admin
    rewardAmount
    rewardToken
    currentdeposit
    customAncillaryData
    token,
    title,
    url,
    earliestNextAction,
    interval
  }
}
`;

@Injectable({
  providedIn: 'root',
})
export class GraphQlService {
  loading!: boolean;
  posts: any;
  postsQuery!: QueryRef<any>;
  private querySubscription!: Subscription;
  constructor(private apollo: Apollo) {}
  
  
 async  query() {
    // this.postsQuery = this.apollo.watchQuery<any>({
    //   query: GET_POSTS,
    //   pollInterval: 500,
    // });
  try {
    const posts = await  this.apollo.query<any>({
      query: rewards
    }).toPromise()

    console.log(posts)
  return posts?.data
  } catch (error) {
    console.log(error)
      return {}
  }

    // this.querySubscription = this.postsQuery.valueChanges.subscribe(({ data, loading }) => {
    //   this.loading = loading;
    //   this.posts = data.posts;
    // });
  }
}
