using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;

namespace GraphQLAPI
{
    public class ContactType: ObjectGraphType<Contact>
    {
        public ContactType()
        {
            Field(x => x.Id).Description("The id of the contact.");
            Field(x => x.FirstName).Description("The first name of the contact.");
            Field(x => x.LastName).Description("The last name of the contact.");
            Field(x => x.EmailAdress).Description("The email of the contact.");
            Field(x => x.PhoneNumber).Description("The phone of the contact.");
            

        }
    }
}
