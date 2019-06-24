const cardSubscriptions = {

    Subscription:{
        cardUpdateSub: {

            subscribe(root,{userId},{pubsub}){

                
                return pubsub.asyncIterator(`cardUpdate${userId}`)
            }
        }
    }
}

module.exports = cardSubscriptions;