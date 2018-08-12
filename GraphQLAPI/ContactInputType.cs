using GraphQL.Types;
namespace GraphQLAPI
{
    internal class ContactInputType : InputObjectGraphType
    {
        public ContactInputType()
        {
            Name = "ContactInput";
            Field<StringGraphType>("FirstName");
            Field<StringGraphType>("LastName");
            Field<StringGraphType>("EmailAddress");
            Field<StringGraphType>("PhoneNumber");            
        }
    }
    
}