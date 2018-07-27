using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GenFu;

namespace GraphQLAPI
{
    public class ContactRepository : IContactRepository
    {
        private IEnumerable<Contact> _contacts = new List<Contact>();
        public ContactRepository()
        {
// GenFu.GenFu.Configure<Contact>().Fill(c => c.FirstName).AsFirstName();
            _contacts = A.ListOf<Contact>();
        }

        public IEnumerable<Contact> AllContacts()
        {
            return _contacts;
        }

        public Contact ContactByPhone(string phone)
        {
            throw new NotImplementedException();
        }
    }
}
