using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphQLAPI
{
    public interface IContactRepository
    {
        Contact ContactByPhone(string phone);
        IEnumerable<Contact> AllContacts();
        object Add(Contact contact);
    }
}
