require("dotenv").config();
const { createTestClient } = require("apollo-server-testing");
const { ApolloServer, gql } = require("apollo-server");
const { expect } = require("chai");
const typeDefs = require("../schema");
const resolvers = require("../resolvers");
const knexModule = require("../db/knexModule");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    knexModule
  }
});
const { query, mutate } = createTestClient(server);
const testQueries = require("./testQueries");
describe("Test User", () => {
  before(() => {
    knexModule.insert("Locations", { id: 1, city: "Iasi" });
  });
  after(() => {
    knexModule.deleteById("Locations", 1);
  });
  it("Get Users on empty table", async () => {
    const response = await query({
      query: testQueries.user.get_users,
      variables: {}
    });
    const result = response.data.get_users;
    expect(result).to.be.an("array").to.be.empty;
  });
  it("Create new user", async () => {
    const user1 = {
      id: 1,
      name: "User1",
      location: {
        city: "Iasi",
        id: 1
      },
      phoneNumber: "1234"
    };
    const response = await mutate({
      mutation: testQueries.user.create_user,
      variables: {
        id: 1,
        name: "User1",
        location: 1,
        phoneNumber: "1234"
      }
    });
    const result = response.data.create_user;
    //console.log(response);
    expect([
      result.id,
      result.name,
      result.location,
      result.phoneNumber
    ]).to.deep.equal([user1.id, user1.name, user1.location, user1.phoneNumber]);

    //expect(result.id).to.be.equal(user1.id);
  });
  it("Delete user", async () => {
    const response = await mutate({
      mutation: testQueries.user.delete_user,
      variables: { userId: 1 }
    });
    const result = response.data.delete_user;
    expect(result).to.be.equal(1);
  });
});
describe("Test Card", () => {
  before(() => {
    knexModule.insert("Locations", { id: 1, city: "Iasi" }).then(() => {
      knexModule.insert("Tags", { id: 1, name: "Nany" }).then(() => {
        knexModule.insert("Users", {
          id: 1,
          name: "User1",
          location: 1,
          phoneNumber: "1234"
        });
      });
    });
  });
  after(() => {
    knexModule.deleteById("Locations", 1).then(() => {
      knexModule.deleteById("Tags", 1);
    });
  });
  it("Get empty cards", async () => {
    const response = await query({
      query: testQueries.card.get_cards,
      variables: {}
    });
    console.log(response);

    const result = response.data.get_cards;
    expect(result).to.be.an("array").to.be.empty;
  });
});
