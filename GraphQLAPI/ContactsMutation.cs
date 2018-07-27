using GraphQL.Types;

namespace GraphQLAPI 
{
    public class ContactsMutation : ObjectGraphType
    {
        public ContactsMutation(IContactRepository contactRepository)
        {
            Name = "Mutation";

     Field<ContactType>(
           "createContact",
           arguments: new QueryArguments(
           new QueryArgument<NonNullGraphType<ContactInputType>> { Name = "contact" }
     ),
     resolve: context =>
     {
        var contact = context.GetArgument<Contact>("contact");
        return contactRepository.Add(contact);
     });
   }


    }
}
