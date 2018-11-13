export default {
    Query: {
        contacts(_, { filters, options }, { userId, db }, ast) {
            console.log(userId)
            $filters = filters
            $options = options
            const users = db.contacts.astToQuery(ast, {
                $filters,
                $options
            }).fetch()
            return users
        }

    },
    Mutation: {
        contactCreate: (_, {data}, {db}) => {
            console.log(data)
            data.createdAt = new Date();
            const contactId = db.contacts.insert({
                ...data
            });
            return db.contacts.findOne(contactId);
        },

        contactUpdate(_, { contactId, data }, { db }){
            const contact = db.contacts.createQuery({
                $filters: {_id: contactId},
            }).fetchOne();

            if(contact._id === contactId){
                return db.contacts.update(contactId, {
                    $set: {...data}
                });
            }
            else
                throw new Meteor.Error("no rights to update this contact");
        },
    }
}