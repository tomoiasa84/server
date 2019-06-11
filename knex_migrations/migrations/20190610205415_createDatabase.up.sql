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
  "location" int REFERENCES "location" ("id"),
  "hasAccount" boolean,
  "notification1" boolean,
  "notification2" boolean,
  "notification3" boolean,
  "privacy1" int REFERENCES "privacy" ("id"),
  "privacy2" int REFERENCES "privacy" ("id"),
  "privacy3" int REFERENCES "privacy" ("id")
);

CREATE TABLE "userfriend" (
  "id" SERIAL PRIMARY KEY,
  "userOrigin" int REFERENCES "userx" ("id"),
  "userTarget" int REFERENCES "userx" ("id"),
  "acceptedFlag" boolean,
  "blockFlag" boolean
);

CREATE TABLE "card" (
  "id" SERIAL PRIMARY KEY,
  "postedBy" int REFERENCES "userx" ("id"),
  "searchFor" int REFERENCES "tag" ("id"),
  "created_at" varchar,
  "message" varchar
);

CREATE TABLE "userrecomcard" (
  "id" SERIAL PRIMARY KEY,
  "cardId" int REFERENCES "card" ("id"),
  "userAsk" int REFERENCES "userx" ("id"),
  "userRecommender" int REFERENCES "userx" ("id"),
  "userRecommended" int REFERENCES "userx" ("id"),
  "acceptedFlag" boolean
);

CREATE TABLE "usertag" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "userx" ("id"),
  "tag_id" int REFERENCES "tag" ("id"),
  "default" boolean
);

CREATE TABLE "usertagreview" (
  "id" SERIAL PRIMARY KEY,
  "recommendationBy" int REFERENCES "userx" ("id"),
  "recommendationFor" int REFERENCES "usertag" ("id"),
  "stars" int,
  "text" varchar
);

CREATE TABLE "messageThread" (
  "id" SERIAL PRIMARY KEY,
  "userrecomcard" int REFERENCES "userrecomcard" ("id")
);

CREATE TABLE "message" (
  "id" SERIAL PRIMARY KEY,
  "text" varchar,
  "messageThread" int REFERENCES "messageThread" ("id"),
  "messageFrom" int REFERENCES "userx" ("id")
);

CREATE TABLE "messageThreadUser" (
  "thread" int REFERENCES "messageThread" ("id"),
  "user" int REFERENCES "userx" ("id")
);
