const userMutationsResolvers = {
    Mutation: {
        delete_user: (root,{userId},{ knex })=>{

            return knex('userx').where('id',userId)
            .first()
            .del()
            .then((data)=>{

                console.log(data);
                
                if(data){

                    return {
                        status: 'ok',
                        message: 'User deleted.'
                    }
                }
                return {
                    status: 'bad',
                    message: 'User does not exist.'
                }
            })
            .catch((err)=>{

                return {
                    status: 'bad',
                    message: `Code: ${err.code} Detail: ${err.detail}`
                }
            })
        },
        create_user: (root, {
            name,
            cityId,
            phone
        },{knex}) => {

            return knex.insert({
                name: name,
                location: cityId,
                phone: phone,
                hasAccount: true,
                notification1: true,
                notification2: true,
                notification3: true,
                privacy: 1
            })
            .returning('id')
            .into('userx')
            .then((userId) => {

                return knex('userx').where({
                    id:userId[0]
                }).first();
            })
            .catch((err) => {

                return {
                    id:0
                }
            })
        },
        refuse_connection: (root, {
            idUser
        }, { knex }) => {
            return knex('userfriend').where({
                    userTarget: idUser,
                    acceptedFlag: false
                })
                .del()
                .then((data) => {
                    console.log(data);
                    if (data) {
                        return {
                            status: 'ok',
                            message: 'User deleted'
                        }
                    }
                    return {
                        status: 'bad',
                        message: 'User already deleted'
                    }

                })
                .catch((err) => {
                    return {
                        status: 'bad',
                        message: 'Error:cannot delete user'
                    }
                })
        },
        accept_connection: (root, {
            idUser
        }, { knex }) => {

            return knex('userfriend').where('userTarget', idUser)
                .update({
                    acceptedFlag: true
                })
                .then((data) => {
                    console.log(data);
                    return {
                        status: 'ok',
                        message: 'Updated successfully'
                    }
                })
                .catch((err) => {

                    return {
                        status: 'bad',
                        message: 'Error, cannot update connection'
                    }
                });
        },
        update_user(obj, {
            userId,
            name,
            location,
            phone
        }, { knex }) {

            return knex('userx').where('id',userId).update(
                {
                    name:name,
                    location: location,
                    phone:phone
                }
            )
            .then((data) => {

                console.log(userId);
                return knex('userx').where('id',userId).first();
            })
            .catch((err) => {
                 
                console.log(err);
                return {
                    id:0
                }
            })
        },
        create_connection(obj, {
            id1,
            id2
        }, { knex }) {

            return knex('userfriend').insert({
                    userOrigin: id1,
                    userTarget: id2,
                    acceptedFlag: false,
                    blockFlag: false
                })
                .then((data) => {
                    //console.log(data);
                    return {
                        status: 'ok',
                        message: 'Insert successfully.'
                    }
                })
                .catch((err) => {
                    //console.log(err);
                    return {
                        status: 'bad',
                        message: 'Error at insert'
                    }
                })
        }
    },
}
module.exports = userMutationsResolvers;