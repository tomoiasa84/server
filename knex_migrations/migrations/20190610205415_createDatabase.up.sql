CREATE TABLE "privacy" (
  "id" SERIAL PRIMARY KEY,
  "setting" varchar
);

CREATE TABLE "location" (
  "id" SERIAL PRIMARY KEY,
  "city" varchar
);

CREATE TABLE "tag" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "userx" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "phone" varchar UNIQUE,
  "location" int REFERENCES "location" ("id") ON DELETE CASCADE,
  "hasAccount" boolean,
  "notification1" boolean,
  "notification2" boolean,
  "notification3" boolean,
  "privacy" int REFERENCES "privacy" ("id") ON DELETE CASCADE
);

CREATE TABLE "userfriend" (
  "id" SERIAL PRIMARY KEY,
  "user1" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "user2" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "confirmation" boolean,
  "blockFlag" boolean
);

CREATE TABLE "card" (
  "id" SERIAL PRIMARY KEY,
  "postedBy" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "searchFor" int REFERENCES "tag" ("id") ON DELETE CASCADE,
  "created_at" varchar,
  "message" varchar
);
CREATE TABLE "sharecard"(
  "id" SERIAL PRIMARY KEY,
  "cardId" int REFERENCES "card" ("id") ON DELETE CASCADE,
  "sharedBy" int REFERENCES "userx" ("id") ON DELETE CASCADE
);
CREATE TABLE "userrecomcard" (
  "id" SERIAL PRIMARY KEY,
  "cardId" int REFERENCES "card" ("id") ON DELETE CASCADE,
  "userAsk" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "userRecommender" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "userRecommended" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "acceptedFlag" boolean
);

CREATE TABLE "usertag" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "tag_id" int REFERENCES "tag" ("id") ON DELETE CASCADE,
  "default" boolean
);

CREATE TABLE "usertagreview" (
  "id" SERIAL PRIMARY KEY,
  "recommendationBy" int REFERENCES "userx" ("id") ON DELETE CASCADE,
  "recommendationFor" int REFERENCES "usertag" ("id") ON DELETE CASCADE,
  "stars" int,
  "text" varchar
);

CREATE TABLE "message_thread" (
  "id" SERIAL PRIMARY KEY,
  "userrecomcard" int REFERENCES "userrecomcard" ("id") ON DELETE CASCADE
);

CREATE TABLE "message" (
  "id" SERIAL PRIMARY KEY,
  "text" varchar,
  "messageThread" int REFERENCES "message_thread" ("id") ON DELETE CASCADE,
  "messageFrom" int REFERENCES "userx" ("id") ON DELETE CASCADE
);

CREATE TABLE "message_thread_user" (
  "id" SERIAL PRIMARY KEY, 
  "thread" int REFERENCES "message_thread" ("id") ON DELETE CASCADE,
  "user" int REFERENCES "userx" ("id") ON DELETE CASCADE
);
ALTER TABLE message_thread ALTER COLUMN userrecomcard DROP NOT NULL;