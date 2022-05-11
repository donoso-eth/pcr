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
    rewardIndexHistories(first: 5, where: {rewardId:$id}, orderBy: timeStamp, orderDirection: desc) {
      index
      rewardAmount
      timeStamp
      rewardId 
    }
  }
`;

export const GET_PROPOSALS = `
query($id: String!){
    proposals(first: 5, where: {rewardId:$id}, orderBy: timeStamp, orderDirection: desc ) {
      id
      rewardId
      proposalId
      status
      timeStamp
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
      target
      targetCondition
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
