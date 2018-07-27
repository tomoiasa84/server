using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphQLAPI
{
    public class Contact
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress { get; set; }
        public string PhoneNumber { get; set; }

        public override string ToString()
        {
            return $"{Id}: {FirstName} {LastName} - {EmailAdress} - {PhoneNumber}";
        }
    }
}
