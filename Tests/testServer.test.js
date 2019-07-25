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

  it("Get empty cards", async () => {
    const response = await query({
      query: testQueries.card.get_cards,
      variables: {}
    });
    const result = response.data.get_cards;
    expect(result).to.be.an("array").to.be.empty;
  });
  let cardId = 0;
  let cardObject = undefined;
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
    cardObject = result;
    expect(result).to.not.be.undefined;
  });
  it("Check postedBy field", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 1 }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(cardObject.postedBy);
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
  let recommandObject = undefined;
  it("Create Recommand", async () => {
    const response = await mutate({
      mutation: recommandAPI.create_recommand,
      variables: { cardId: 1, userAsk: 1, userSend: 2, userRec: 3 }
    });
    const result = response.data.create_recommand;
    recId = result.id;
    recommandObject = result;
    expect(result).to.not.be.undefined;
  });
  it("Check Card field", async () => {
    const response = await query({
      query: testQueries.card.get_card,
      variables: { cardId: 1 }
    });
    const result = response.data.get_card;
    expect(result).to.deep.equal(recommandObject.card);
  });
  it("Check userAsk field", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 1 }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(recommandObject.userAsk);
  });
  it("Check userSend field", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 2 }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(recommandObject.userSend);
  });
  it("Check userRecommand field", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 3 }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(recommandObject.userRecommand);
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
  let usertag = undefined;
  it("Create User Tag", async () => {
    const response = await mutate({
      mutation: userTagApi.create_userTag,
      variables: { userId: 1, tagId: 1 }
    });
    const result = response.data.create_userTag;
    usertag = result;
    userTagId = result.id;
    expect(result).to.not.be.undefined;
  });
  it("Check UserTag owner", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 1 }
    });
    const result = response.data.get_user;
    expect(result).to.deep.equal(usertag.user);
  });
  it("Check User UserTag", async () => {
    const response = await query({
      query: testQueries.user.get_user,
      variables: { userId: 1 }
    });
    const result = response.data.get_user.tags;
    expect(result)
      .to.be.an("array")
      .and.to.deep.contain(usertag.tag);
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
const sharesApi = require("./shareQL");
describe("Test Share function", () => {
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Tags", { id: 1, name: "Nany" });
    await knexModule.insert("Users", {
      id: 1,
      name: "User1",
      location: 1,
      phoneNumber: "1"
    });
    await knexModule.insert("Users", {
      id: 2,
      name: "User2",
      location: 1,
      phoneNumber: "12"
    });
    await knexModule.insert("Users", {
      id: 3,
      name: "User3",
      location: 1,
      phoneNumber: "123"
    });
    await knexModule.insert("Users", {
      id: 4,
      name: "User4",
      location: 1,
      phoneNumber: "1234"
    });
    await knexModule.insert("Users", {
      id: 5,
      name: "User5",
      location: 1,
      phoneNumber: "12345"
    });
    await knexModule.insert("Cards", {
      id: 1,
      postedBy: 1,
      searchFor: 1,
      text: "Nany"
    });
  });
  after(async () => {
    await knexModule.deleteById("Users", 1);
    await knexModule.deleteById("Users", 2);
    await knexModule.deleteById("Users", 3);
    await knexModule.deleteById("Users", 4);
    await knexModule.deleteById("Users", 5);
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Tags", 1);
    await knexModule.deleteById("Cards", 1);
  });
  it("Get Shares", async () => {
    const response = await query({
      query: sharesApi.get_shares,
      variables: {}
    });
    const result = response.data.get_shares;
    expect(result).to.be.an("array").empty;
  });
  let shareId = 0;
  it("Create Share", async () => {
    const response = await mutate({
      mutation: sharesApi.create_share,
      variables: { cardId: 1, sharedBy: 2, sharedTo: [3, 4, 5] }
    });
    const result = response.data.create_share;
    shareIds = result;
    expect(result).to.be.an("array").not.empty;
  });
  it("Delete Share", async () => {
    const response = await mutate({
      mutation: sharesApi.delete_share,
      variables: { shareIds: shareIds }
    });
    const result = response.data.delete_share;
    expect(result).to.deep.equal(shareIds);
  });
});
let connectionApi = require("./connectionQL");
describe("Test User fields", () => {
  before(async () => {
    await knexModule.insert("Locations", { id: 1, city: "Iasi" });
    await knexModule.insert("Tags", { id: 1, name: "Tag1" });
    await knexModule.insert("Tags", { id: 2, name: "Tag2" });
    await knexModule.insert("Tags", { id: 3, name: "Tag3" });
    await knexModule.insert("Users", {
      id: 1,
      name: "User1",
      location: 1,
      phoneNumber: "1"
    });
    await knexModule.insert("Users", {
      id: 2,
      name: "User2",
      location: 1,
      phoneNumber: "12"
    });
    await knexModule.insert("Users", {
      id: 3,
      name: "User3",
      location: 1,
      phoneNumber: "123"
    });
    await knexModule.insert("Users", {
      id: 4,
      name: "User4",
      location: 1,
      phoneNumber: "1234"
    });
    await knexModule.insert("Cards", {
      id: 1,
      postedBy: 1,
      searchFor: 1,
      text: "Tag1"
    });
    await knexModule.insert("Cards", {
      id: 2,
      postedBy: 1,
      searchFor: 2,
      text: "Tag2"
    });
    await knexModule.insert("Cards", {
      id: 3,
      postedBy: 1,
      searchFor: 3,
      text: "Tag3"
    });
    await knexModule.insert("Cards", {
      id: 4,
      postedBy: 3,
      searchFor: 1,
      text: "Tag1"
    });
    await knexModule.insert("Cards", {
      id: 5,
      postedBy: 4,
      searchFor: 2,
      text: "Tag2"
    });
  });
  after(async () => {
    await knexModule.deleteById("Users", 1);
    await knexModule.deleteById("Users", 2);
    await knexModule.deleteById("Users", 3);
    await knexModule.deleteById("Users", 4);
    await knexModule.deleteById("Locations", 1);
    await knexModule.deleteById("Tags", 1);
    await knexModule.deleteById("Tags", 2);
    await knexModule.deleteById("Tags", 3);
    await knexModule.deleteById("Cards", 1);
    await knexModule.deleteById("Cards", 2);
    await knexModule.deleteById("Cards", 3);
    await knexModule.deleteById("Cards", 4);
    await knexModule.deleteById("Cards", 5);
  });
  let connId = 0;
  it("Create connection", async () => {
    const response = await mutate({
      mutation: connectionApi.create_connection,
      variables: { origin: 1, target: 2 }
    });
    const result = response.data.create_connection;
    connId = result;
    expect(result).to.not.equal(0);
  });
  it("Delete connection", async () => {
    const response = await mutate({
      mutation: connectionApi.delete_connection,
      variables: { connId }
    });
    const result = response.data.delete_connection;
    expect(result).to.equal(connId);
  });
  let connections = {
    conn1: {},
    conn2: {}
  };
  it("Check connections field", async () => {
    const response1 = await mutate({
      mutation: connectionApi.create_connection,
      variables: { origin: 1, target: 3 }
    });
    const response2 = await mutate({
      mutation: connectionApi.create_connection,
      variables: { origin: 1, target: 4 }
    });
    connections.conn1 = response1.data.create_connection;
    connections.conn2 = response2.data.create_connection;
    const responseOrigin = await query({
      query: testQueries.user.get_user,
      variables: { userId: 1 }
    });
    const responseTarget1 = await query({
      query: testQueries.user.get_user,
      variables: { userId: 3 }
    });
    const responseTarget2 = await query({
      query: testQueries.user.get_user,
      variables: { userId: 4 }
    });
    const originConnections = responseOrigin.data.get_user.connections;
    const target1 = responseTarget1.data.get_user;
    const target2 = responseTarget2.data.get_user;
    expect(originConnections)
      .to.be.an("array")
      .and.to.deep.contain(target1)
      .and.contain(target2);
  });
  it("Check cards field", async () => {
    const userResponse = await query({
      query: connectionApi.get_user,
      variables: { userId: 1 }
    });
    const cardResponse = await query({
      query: testQueries.card.get_card,
      variables: { cardId: 1 }
    });
    const card = cardResponse.data.get_card;
    const userCards = userResponse.data.get_user.cards;
    expect(userCards)
      .to.be.an("array")
      .and.to.deep.contain(card);
  });

  it("Check feed cards field", async () => {
    console.log("CHECK FEED CARDS");
    const userResponse = await query({
      query: connectionApi.get_user,
      variables: { userId: 1 }
    });
    const cardResponse1 = await query({
      query: testQueries.card.get_card,
      variables: { cardId: 4 }
    });
    const cardResponse2 = await query({
      query: testQueries.card.get_card,
      variables: { cardId: 5 }
    });
    const card1 = cardResponse1.data.get_card;
    const card2 = cardResponse2.data.get_card;
    const cardsFeed = userResponse.data.get_user.cards_feed;
    expect(cardsFeed)
      .to.be.an("array")
      .and.to.deep.contain(card1)
      .and.contain(card2);
  });
  it("Delete connections", async () => {
    let id1 = connections.conn1;
    let id2 = connections.conn2;
    const response1 = await mutate({
      mutation: connectionApi.delete_connection,
      variables: { connId: id1 }
    });
    const response2 = await mutate({
      mutation: connectionApi.delete_connection,
      variables: { connId: id2 }
    });
    const result1 = response1.data.delete_connection;
    const result2 = response2.data.delete_connection;
    expect([result1, result2]).to.deep.equal([id1, id2]);
  });
});
