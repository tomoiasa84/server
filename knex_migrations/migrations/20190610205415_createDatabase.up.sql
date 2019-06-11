CREATE TABLE "userx" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "location" int,
  "hasAccount" boolean,
  "notification1" boolean,
  "notification2" boolean,
  "notification3" boolean,
  "privacy1" int,
  "privacy2" int,
  "privacy3" int
);

CREATE TABLE "privacy" (
  "id" int PRIMARY KEY,
  "setting" varchar
);

CREATE TABLE "location" (
  "id" int PRIMARY KEY,
  "city" varchar
);

CREATE TABLE "userfriend" (
  "id" int PRIMARY KEY,
  "userOrigin" int,
  "userTarget" int,
  "acceptedFlag" boolean,
  "blockFlag" boolean
);

CREATE TABLE "card" (
  "id" int PRIMARY KEY,
  "postedBy" int,
  "searchFor" int,
  "created_at" varchar,
  "message" varchar
);

CREATE TABLE "userrecomcard" (
  "id" int PRIMARY KEY,
  "cardId" int,
  "userAsk" int,
  "userRecommender" int,
  "userRecommended" int,
  "acceptedFlag" boolean
);

CREATE TABLE "tag" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "usertag" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "tag_id" int,
  "default" boolean
);

CREATE TABLE "usertagreview" (
  "id" int PRIMARY KEY,
  "recommendationBy" int,
  "recommendationFor" int,
  "stars" int,
  "text" varchar
);

CREATE TABLE "messageThread" (
  "id" int PRIMARY KEY,
  "userrecomcard" int
);

CREATE TABLE "message" (
  "id" int PRIMARY KEY,
  "text" varchar,
  "messageThread" int,
  "messageFrom" int
);

CREATE TABLE "messageThreadUser" (
  "thread" int,
  "user" int
);

ALTER TABLE "userx" ADD FOREIGN KEY ("location") REFERENCES "location" ("id");

ALTER TABLE "userx" ADD FOREIGN KEY ("privacy1") REFERENCES "privacy" ("id");

ALTER TABLE "userx" ADD FOREIGN KEY ("privacy2") REFERENCES "privacy" ("id");

ALTER TABLE "userx" ADD FOREIGN KEY ("privacy3") REFERENCES "privacy" ("id");

ALTER TABLE "userfriend" ADD FOREIGN KEY ("userOrigin") REFERENCES "userx" ("id");

ALTER TABLE "userfriend" ADD FOREIGN KEY ("userTarget") REFERENCES "userx" ("id");

ALTER TABLE "card" ADD FOREIGN KEY ("postedBy") REFERENCES "userx" ("id");

ALTER TABLE "card" ADD FOREIGN KEY ("searchFor") REFERENCES "tag" ("id");

ALTER TABLE "userrecomcard" ADD FOREIGN KEY ("cardId") REFERENCES "card" ("id");

ALTER TABLE "userrecomcard" ADD FOREIGN KEY ("userAsk") REFERENCES "userx" ("id");

ALTER TABLE "userrecomcard" ADD FOREIGN KEY ("userRecommender") REFERENCES "userx" ("id");

ALTER TABLE "userrecomcard" ADD FOREIGN KEY ("userRecommended") REFERENCES "userx" ("id");

ALTER TABLE "usertag" ADD FOREIGN KEY ("user_id") REFERENCES "userx" ("id");

ALTER TABLE "usertag" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id");

ALTER TABLE "usertagreview" ADD FOREIGN KEY ("recommendationBy") REFERENCES "userx" ("id");

ALTER TABLE "usertagreview" ADD FOREIGN KEY ("recommendationFor") REFERENCES "usertag" ("id");

ALTER TABLE "messageThread" ADD FOREIGN KEY ("userrecomcard") REFERENCES "userrecomcard" ("id");

ALTER TABLE "message" ADD FOREIGN KEY ("messageThread") REFERENCES "messageThread" ("id");

ALTER TABLE "message" ADD FOREIGN KEY ("messageFrom") REFERENCES "userx" ("id");

ALTER TABLE "messageThreadUser" ADD FOREIGN KEY ("thread") REFERENCES "messageThread" ("id");

ALTER TABLE "messageThreadUser" ADD FOREIGN KEY ("user") REFERENCES "userx" ("id");