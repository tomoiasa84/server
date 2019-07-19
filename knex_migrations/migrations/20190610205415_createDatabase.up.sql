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
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "phoneNumber" varchar UNIQUE,
  "location" int REFERENCES "Locations" ("id") ON DELETE CASCADE,
  "isActive" boolean
);

CREATE TABLE "UserSettings"(
  "id" SERIAL PRIMARY KEY,
  "setting" int REFERENCES "Settings" ("id") ON DELETE CASCADE,
  "user" int REFERENCES "Users" ("id") ON DELETE CASCADE 
);

CREATE TABLE "Connections" (
  "id" SERIAL PRIMARY KEY,
  "originUser" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "targetUser" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "confirmation" boolean,
  "blockFlag" boolean
);

CREATE TABLE "Cards" (
  "id" SERIAL PRIMARY KEY,
  "postedBy" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "searchFor" int REFERENCES "Tags" ("id") ON DELETE CASCADE,
  "createdAt" varchar,
  "text" varchar
);
CREATE TABLE "Shares"(
  "id" SERIAL PRIMARY KEY,
  "card" int REFERENCES "Cards" ("id") ON DELETE CASCADE,
  "sharedBy" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "sharedTo" int REFERENCES "Users" ("id") ON DELETE CASCADE
);
CREATE TABLE "Recommands" (
  "id" SERIAL PRIMARY KEY,
  "card" int REFERENCES "Cards" ("id") ON DELETE CASCADE,
  "userAsk" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userSend" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userRecommand" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "acceptedFlag" boolean
);

CREATE TABLE "UserTags" (
  "id" SERIAL PRIMARY KEY,
  "user" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "tag" int REFERENCES "Tags" ("id") ON DELETE CASCADE,
  "default" boolean
);

CREATE TABLE "TagReviews" (
  "id" SERIAL PRIMARY KEY,
  "user" int REFERENCES "Users" ("id") ON DELETE CASCADE,
  "userTag" int REFERENCES "UserTags" ("id") ON DELETE CASCADE,
  "stars" int,
  "text" varchar
);

CREATE TABLE "MessageThreads" (
  "id" SERIAL PRIMARY KEY,
  "recommandation" int REFERENCES "Recommands" ("id") ON DELETE CASCADE
);

CREATE TABLE "Messages" (
  "id" SERIAL PRIMARY KEY,
  "text" varchar,
  "messageThread" int REFERENCES "MessageThreads" ("id") ON DELETE CASCADE,
  "from" int REFERENCES "Users" ("id") ON DELETE CASCADE
);

CREATE TABLE "UserMessageThreads" (
  "id" SERIAL PRIMARY KEY, 
  "thread" int REFERENCES "MessageThreads" ("id") ON DELETE CASCADE,
  "user" int REFERENCES "Users" ("id") ON DELETE CASCADE
);
ALTER TABLE "MessageThreads" ALTER COLUMN "recommandation" DROP NOT NULL;