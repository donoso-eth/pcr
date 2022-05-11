export const GET_QUERY = `
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

export const GET_USER = `
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

export const GET_INDEXES = `
query($id: String!){
    rewardIndexHistories(first: 5, where: {reward:$id}, orderBy: timeStamp, orderDirection: desc) {
      index
      rewardAmount
      timeStamp
      reward 
    }
  }
`;

export const GET_PROPOSALS = `
  {
    proposals(last: 5, orderBy: id, orderDirection: desc ) {
      id
      proposer
      reward
      status
      priceProposed
      priceResolved
    }
  }
`;

export const GET_REWARD = `
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
      priceType
      optimisticOracleLivenessTime
      rewardStep
      rewardStatus
      totalDistributed
      currentIndex
      unitsIssued
      currentProposal {
        id
        startQualifying
        startLivenessPeriod
        status
        priceProposed
      }
    }
  }
`;

export const GET_MEMBERSHIP = `
query($id: String!)
  {
    userMembership(id:$id) {
      units
      reward {
      id
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
      priceType
      optimisticOracleLivenessTime
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
