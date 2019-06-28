const locationMutationsResolver = {

    Mutation: {
        update_location: (root, {
            locationId
        }, {
            knex
        }) => {

            return knex('Locations').where('id', locationId).del()
                .then((deleted) => {

                    if (deleted) return locationId;
                    return 0;
                })
                .catch((err) => {

                    console.log(err);
                    return 0;
                })
        },
        update_location: (root, {
            locationId,
            city
        }, {
            knex
        }) => {

            return knex('Locations')
                .where('id', locationId)
                .update({
                    city: city
                })
                .then((updated) => {

                    if (updated0) return knex('Locations').where('id', locationIds[0]).first();
                    return {
                        id: 0
                    }
                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        create_location: (root, {
            city
        }, {
            knex
        }) => {

            return knex('Locations')
                .returning('id')
                .insert({
                    city: city
                })
                .then((locationIds) => {

                    return knex('Locations').where('id', locationIds[0]).first();
                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        }
    }
}
module.exports = locationMutationsResolver;