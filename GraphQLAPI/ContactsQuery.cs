using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphQLAPI
{
    public class ContactsQuery : ObjectGraphType
    {
        public ContactsQuery(IContactRepository contactRepository)
        {
            

            Field<ListGraphType<ContactType>>("contacts",
                                           resolve: context =>
                                           {
                                               return contactRepository.AllContacts();
                                           });
        }


    }
}
