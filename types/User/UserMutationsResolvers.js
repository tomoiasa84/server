const knex = require('../../db/pgAdaptop');


const userMutationsResolvers = {
    Mutation: {
        delete_user: (root,{userId},context)=>{

            return knex('userx').where('id',userId)
            .first()
            .del()
            .then((data)=>{

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
                    message: err.error
                }
            })
        },
        create_user: (root, {
            name,
            cityId,
            phone
        }) => {

            return knex('userx').insert({
                name: name,
                location: cityId,
                hasAccount: true,
                notification1: true,
                notification2: true,
                notification3: true,
                privacy: 1
            })
            .then((data) => {

                return {
                    status: 'ok',
                    message: 'User created.'
                }
            })
            .catch((err) => {

                return {
                    status: 'bad',
                    message: 'Eroare la insert'
                }
            })
        },
        refuse_connection: (root, {
            idUser
        }, context) => {
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
        }, context) => {

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
            id,
            name,
            location,
            phone
        }, context) {

            //console.log(id,name,phone,location);
            let promesies = [];
            if (name) {
                promesies.push(knex('userx')
                    .where({
                        id: id
                    })
                    .update({
                        name: name
                    }))
            }
            if (location) {
                promesies.push(
                    knex('location')
                    .where({
                        city: location
                    })
                    .first()
                    .then((data) => {
                        return knex('userx')
                            .where({
                                id: id
                            })
                            .update({
                                location: data.id
                            })
                    })
                )
            }
            return Promise.all(promesies)
                .then(() => {
                    return knex('userx').where('id', id).first()
                        .then((user) => {
                            if (!user) {
                                return {
                                    status: 'bad',
                                    message: 'User doen\'t exist'
                                }
                            } else {
                                return {
                                    status: 'good',
                                    message: 'User updated successfully'
                                }
                            }

                        })
                })
                .catch((err) => {

                    return {
                        status: 'bad',
                        message: 'Error, could not update user'
                    }
                });
        },
        create_connection(obj, {
            id1,
            id2
        }, context) {

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