CREATE TABLE "Settings" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "value" varchar
);

CREATE TABLE "Locations" (
  "id" SERIAL PRIMARY KEY,
  "city" varchar
);

CREATE TABLE "Tags" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "Users" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "phoneNumber" varchar UNIQUE,
  "location" int REFERENCES "Locations" ("id") ON DELETE CASCADE,
  "isActive" boolean
);

CREATE TABLE "UserSettings"(
  "id" SERIAL PRIMARY KEY,
  "setting" int REFERENCES "Settings" ("id") ON DELETE CASCADE,
  "user" varchar REFERENCES "Users" ("id") ON DELETE CASCADE 
);

CREATE TABLE "Connections" (
  "id" SERIAL PRIMARY KEY,
  "originUser" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "targetUser" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "confirmation" boolean,
  "blockFlag" boolean
);

CREATE TABLE "Cards" (
  "id" SERIAL PRIMARY KEY,
  "postedBy" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "searchFor" int REFERENCES "Tags" ("id") ON DELETE CASCADE,
  "createdAt" varchar,
  "text" varchar
);
CREATE TABLE "Shares"(
  "id" SERIAL PRIMARY KEY,
  "card" int REFERENCES "Cards" ("id") ON DELETE CASCADE,
  "sharedBy" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "sharedTo" varchar REFERENCES "Users" ("id") ON DELETE CASCADE
);
CREATE TABLE "Recommands" (
  "id" SERIAL PRIMARY KEY,
  "card" int REFERENCES "Cards" ("id") ON DELETE CASCADE,
  "userAsk" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userSend" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userRecommand" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "acceptedFlag" boolean
);

CREATE TABLE "UserTags" (
  "id" SERIAL PRIMARY KEY,
  "user" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "tag" int REFERENCES "Tags" ("id") ON DELETE CASCADE,
  "default" boolean
);

CREATE TABLE "TagReviews" (
  "id" SERIAL PRIMARY KEY,
  "user" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userTag" int REFERENCES "UserTags" ("id") ON DELETE CASCADE,
  "stars" int,
  "text" varchar
);

CREATE TABLE "Conversations"(
  "id" varchar PRIMARY KEY,
  "user1" varchar REFERENCES "Users" ("id") ON DELETE CASCADE,
  "user2" varchar REFERENCES "Users" ("id") ON DELETE CASCADE
);
