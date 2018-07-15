using GraphQL.Types;
public class HelloWorldQuery : ObjectGraphType
{
    public HelloWorldQuery()
    {
        Field<StringGraphType>(
            name: "name",
            resolve: context => "John Doe"
        );

        Field<StringGraphType>(
            name: "phone",
            resolve: context => "972-111-1111"
        );
    }
}