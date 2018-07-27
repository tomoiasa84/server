using GraphQL.Types;
namespace GraphQLAPI
{
    internal class ContactInputType : InputObjectGraphType
    {
        public ContactInputType()
        {
            Name = "ContactInput";
            Field<NonNullGraphType<StringGraphType>>("FirstName");
            Field<StringGraphType>("LastName");
            Field<StringGraphType>("EmailAddress");
            Field<IntGraphType>("PhoneNumber");            
        }
    }
    
}