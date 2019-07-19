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
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Locations", { id: 2, city: "Bucuresti" });
  });
  after(async () => {
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Locations", 2);
  });
  it("Get Users on empty table", async () => {
    const response = await query({
      query: testQueries.user.get_users,
      variables: {}
    });
    const result = response.data.get_users;
    expect(result).to.be.an("array").to.be.empty;
  });
  let userId = 0;
  it("Create User", async () => {
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
    userId = result.id;
    expect(result).to.not.be.undefined;
  });
  let userUpdateObject = undefined;
  it("Update User", async () => {
    const response = await mutate({
      mutation: testQueries.user.update_user,
      variables: {
        id: 1,
        name: "User2",
        location: 2,
        phone: "asdfg"
      }
    });
    const result = response.data.update_user;
    userUpdateObject = result;
    expect(result).to.not.be.undefined;
  });
  it("Get user and compare to update", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: userUpdateObject.id }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(userUpdateObject);
  });
  it("Delete user", async () => {
    const response = await mutate({
      mutation: testQueries.user.delete_user,
      variables: { userId }
    });
    const result = response.data.delete_user;
    expect(result).to.be.equal(1);
  });
});
//Card Tests
describe("Test Card", () => {
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Tags", { id: 1, name: "Nany" });
    await knexModule.insert("Tags", { id: 2, name: "Cleaner" });
    await knexModule.insert("Users", {
      id: 1,
      name: "User1",
      location: 1,
      phoneNumber: "1234"
    });
  });
  after(async () => {
    await knexModule.deleteById("Users", 1);
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Tags", 1);
    await knexModule.deleteById("Tags", 2);
  });
  let cardId = 0;
  it("Get empty cards", async () => {
    const response = await query({
      query: testQueries.card.get_cards,
      variables: {}
    });
    const result = response.data.get_cards;
    expect(result).to.be.an("array").to.be.empty;
  });
  it("Create Card", async () => {
    const response = await mutate({
      mutation: testQueries.card.create_card,
      variables: {
        postedBy: 1,
        searchFor: 1,
        text: "Nanny wanted"
      }
    });
    const result = response.data.create_card;
    cardId = result.id;
    expect(result).to.not.be.undefined;
  });
  let updatedCardObject = undefined;
  it("Update Card", async () => {
    const response = await mutate({
      mutation: testQueries.card.update_card,
      variables: {
        cardId,
        searchFor: 2,
        text: "Cleaner"
      }
    });
    const result = response.data.update_card;
    updatedCardObject = result;
    expect(result).to.not.be.undefined;
  });
  it("Get Card", async () => {
    const response = await query({
      query: testQueries.card.get_card,
      variables: { cardId: updatedCardObject.id }
    });
    const result = response.data.get_card;
    expect(result).to.deep.equal(updatedCardObject);
  });
  it("Delete Card", async () => {
    const response = await mutate({
      mutation: testQueries.card.delete_card,
      variables: { cardId }
    });
    const result = response.data.delete_card;
    expect(result).to.be.equal(cardId);
  });
});
const recommandAPI = require("./recommandQL");
describe("Test Recommand", () => {
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Tags", { id: 1, name: "Nany" });
    await knexModule.insert("Tags", { id: 2, name: "Cleaner" });
    await knexModule.insert("Users", {
      id: 1,
      name: "User1",
      location: 1,
      phoneNumber: "1234"
    });
    await knexModule.insert("Users", {
      id: 2,
      name: "User2",
      location: 1,
      phoneNumber: "5678"
    });
    await knexModule.insert("Users", {
      id: 3,
      name: "User3",
      location: 1,
      phoneNumber: "qwer"
    });

    await knexModule.insert("Users", {
      id: 4,
      name: "User4",
      location: 1,
      phoneNumber: "vcxv"
    });
    await knexModule.insert("Users", {
      id: 5,
      name: "User5",
      location: 1,
      phoneNumber: "jghk"
    });
    await knexModule.insert("Users", {
      id: 6,
      name: "User6",
      location: 1,
      phoneNumber: "sdvds"
    });
    await knexModule.insert("Cards", {
      id: 1,
      postedBy: 1,
      searchFor: 1,
      text: "Nany"
    });
    await knexModule.insert("Cards", {
      id: 2,
      postedBy: 4,
      searchFor: 2,
      text: "Cleaner"
    });
  });
  after(async () => {
    await knexModule.deleteById("Cards", 1);
    await knexModule.deleteById("Cards", 2);
    await knexModule.deleteById("Users", 1);
    await knexModule.deleteById("Users", 2);
    await knexModule.deleteById("Users", 3);
    await knexModule.deleteById("Users", 4);
    await knexModule.deleteById("Users", 5);
    await knexModule.deleteById("Users", 6);
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Tags", 1);
    await knexModule.deleteById("Tags", 2);
  });
  it("Get Recommands", async () => {
    const response = await query({
      query: recommandAPI.get_recommands,
      variables: {}
    });
    const result = response.data.get_recommands;
    expect(result).to.be.an("array").to.be.empty;
  });
  let recId = 0;
  it("Create Recommand", async () => {
    const response = await mutate({
      mutation: recommandAPI.create_recommand,
      variables: { cardId: 1, userAsk: 1, userSend: 2, userRec: 3 }
    });
    const result = response.data.create_recommand;
    recId = result.id;
    expect(result).to.not.be.undefined;
  });
  let recObject = undefined;
  it("Update Recommand", async () => {
    const response = await mutate({
      mutation: recommandAPI.update_recommand,
      variables: {
        recommandId: recId,
        cardId: 2,
        userAsk: 4,
        userSend: 5,
        userRec: 6
      }
    });
    const result = response.data.update_recommand;
    recObject = result;
    expect(result).to.not.be.undefined;
  });
  it("Get Recommand", async () => {
    const response = await query({
      query: recommandAPI.get_recommand,
      variables: { recommandId: recObject.id }
    });
    const result = response.data.get_recommand;
    expect(result).to.be.deep.equal(recObject);
  });
  it("Delete Recommand", async () => {
    const response = await mutate({
      mutation: recommandAPI.delete_recommand,
      variables: { recommandId: recId }
    });
    const result = response.data.delete_recommand;
    expect(result).to.be.equal(recId);
  });
});
const userTagApi = require("./userTagQL");
describe("Test User Tag", () => {
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Tags", { id: 1, name: "Nany" });
    await knexModule.insert("Users", {
      id: 1,
      name: "User1",
      location: 1,
      phoneNumber: "1234"
    });
  });
  after(async () => {
    await knexModule.deleteById("Users", 1);
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Tags", 1);
  });
  it("Get User Tags", async () => {
    const response = await query({
      query: userTagApi.get_userTags,
      variables: {}
    });
    const result = response.data.get_userTags;
    expect(result).to.be.an("array").to.be.empty;
  });
  let userTagId = 0;
  it("Create User Tag", async () => {
    const response = await mutate({
      mutation: userTagApi.create_userTag,
      variables: { userId: 1, tagId: 1 }
    });
    const result = response.data.create_userTag;
    userTagId = result.id;
    expect(result).to.not.be.undefined;
  });
  let userTagObj = undefined;
  it("Update User Tag", async () => {
    const response = await mutate({
      mutation: userTagApi.update_userTag,
      variables: { userTagId: userTagId, defaultFlag: true }
    });
    const result = response.data.update_userTag;
    userTagObj = result;
    expect(result).to.not.be.undefined;
  });
  it("Get User Tag", async () => {
    const response = await query({
      query: userTagApi.get_userTag,
      variables: { userTagId: userTagObj.id }
    });
    const result = response.data.get_userTag;
    expect(result).to.deep.equal(userTagObj);
  });
  it("Delete User Tag", async () => {
    const response = await mutate({
      mutation: userTagApi.delete_userTag,
      variables: { userTagId: userTagId }
    });
    const result = response.data.delete_userTag;
    expect(result).to.be.equal(userTagId);
  });
});
