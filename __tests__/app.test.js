const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET: catchAll bad path", () => {
  it("GET 404: response with array of category objects", () => {
    return request(app)
      .get("/api/nonexistingpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Path not found!!!");
      });
  });
});

describe("GET: getCategories(", () => {
  it("200: response with array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .then(({ body }) => {
        const bodyCategory = body.category;
        expect(bodyCategory).toHaveLength(4);
        expect(bodyCategory).toBeInstanceOf(Array);
        bodyCategory.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("slug", expect.any(String));
          expect(singleObject).toHaveProperty(
            "description",
            expect.any(String)
          );
        });
      });
  });
});

describe("GET: getReviewById()", () => {
  it("200: response of review object with 10 (updated for later tasks) keys in Object ", () => {
    return request(app)
      .get("/api/reviews/7")
      .then(({ body }) => {
        const bodyReview = body.review;
        expect(Object.keys(bodyReview)).toHaveLength(10);
        expect(bodyReview).toBeInstanceOf(Object);
        expect(bodyReview).toHaveProperty("review_id", 7);
        expect(bodyReview).toHaveProperty(
          "title",
          "Mollit elit qui incididunt veniam occaecat cupidatat"
        );
        expect(bodyReview).toHaveProperty(
          "review_body",
          "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis."
        );
        expect(bodyReview).toHaveProperty("designer", "Avery Wunzboogerz");
        expect(bodyReview).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/776657/pexels-photo-776657.jpeg?w=700&h=700"
        );
        expect(bodyReview).toHaveProperty("votes", 9);
        expect(bodyReview).toHaveProperty("category", "social deduction");
        expect(bodyReview).toHaveProperty("owner", "mallionaire");
        expect(bodyReview).toHaveProperty("created_at", expect.any(String));
        expect(bodyReview).toHaveProperty("comment_count", "0");
      });
  });

  it("400: wrong ID format, not valid", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request, choose valid ID");
      });
  });

  it("404: correct ID format, however ID not within data", () => {
    return request(app)
      .get("/api/reviews/17")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 ID Not Found");
      });
  });
});

describe("GET: getReviews()", () => {
  it("200: response with array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(13);
        expect(bodyReviews).toBeInstanceOf(Array);
        bodyReviews.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("owner", expect.any(String));
          expect(singleObject).toHaveProperty("title", expect.any(String));
          expect(singleObject).toHaveProperty("review_id", expect.any(Number));
          expect(singleObject).toHaveProperty("category", expect.any(String));
          expect(singleObject).toHaveProperty(
            "review_img_url",
            expect.any(String)
          );
          expect(singleObject).toHaveProperty("created_at", expect.any(String));
          expect(singleObject).toHaveProperty("votes", expect.any(Number));
          expect(singleObject).toHaveProperty("designer", expect.any(String));
          expect(singleObject).toHaveProperty(
            "comment_count",
            expect.any(String)
          );
          expect(Object.keys(singleObject)).toHaveLength(9);
        });
      });
  });
});

describe("GET: getReviewIdComments()", () => {
  it("200: comments from ID 2 ", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .then(({ body }) => {
        const bodyComments = body.comments;
        expect(bodyComments).toHaveLength(3);
        bodyComments.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("comment_id", expect.any(Number));
          expect(singleObject).toHaveProperty("votes", expect.any(Number));
          expect(singleObject).toHaveProperty("created_at", expect.any(String));
          expect(singleObject).toHaveProperty("author", expect.any(String));
          expect(singleObject).toHaveProperty("body", expect.any(String));
          expect(singleObject).toHaveProperty("review_id", expect.any(Number));
          expect(Object.keys(singleObject)).toHaveLength(6);
        });

        expect(bodyComments[0]).toHaveProperty("comment_id", 5);
        expect(bodyComments[0]).toHaveProperty("review_id", 2);
        expect(bodyComments[0]).toHaveProperty(
          "created_at",
          "2021-01-18T10:24:05.410Z"
        );
      });
  });

  it("200: empty array where certain correct ID does not have comments ", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .then(({ body }) => {
        const bodyComments = body.comments;
        expect(bodyComments).toHaveLength(0);
        expect(bodyComments).toBeInstanceOf(Array);
      });
  });

  it("400: wrong ID format, not valid", () => {
    return request(app)
      .get("/api/reviews/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request, choose valid ID");
      });
  });

  it("404: correct ID format, however ID not within data scope", () => {
    return request(app)
      .get("/api/reviews/17/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 ID Not Found");
      });
  });
});

describe("POST: postReviewIdComment()", () => {
  it("201: return posted comment ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({ username: "bainesface", body: "lets add this :)" })
      .then(({ body }) => {
        const bodyComment = body.comment;
        expect(Object.keys(bodyComment)).toHaveLength(6);
        expect(bodyComment).toHaveProperty("comment_id", 7);
        expect(bodyComment).toHaveProperty("body", "lets add this :)");
        expect(bodyComment).toHaveProperty("review_id", 1);
        expect(bodyComment).toHaveProperty("author", "bainesface");
        expect(bodyComment).toHaveProperty("votes", 0);
      });
  });

  it("201: return posted comment, ignoring extra fields ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({
        username: "bainesface",
        body: "lets add this :)",
        favFood: "pizza",
      })
      .then(({ body }) => {
        const bodyComment = body.comment;
        expect(Object.keys(bodyComment)).toHaveLength(6);
        expect(bodyComment).toHaveProperty("comment_id", 7);
        expect(bodyComment).toHaveProperty("body", "lets add this :)");
        expect(bodyComment).toHaveProperty("review_id", 1);
        expect(bodyComment).toHaveProperty("author", "bainesface");
        expect(bodyComment).toHaveProperty("votes", 0);
        expect(bodyComment).not.toHaveProperty("favFood");
      });
  });

  it('404: responds with error message when unauthorized user attempt to be added"', () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "cherry",
        body: "👀👀👀",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("404 Not Found");
      });
  });

  it("400: error when send obj is incomplete ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "bainesface" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request: psql: 23502");
      });
  });

  it("400: error when wrong ID format", () => {
    return request(app)
      .post("/api/reviews/notAnId/comments")
      .send({ username: "bainesface", body: "not an ID body" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request, choose valid ID");
      });
  });

  it("404: review_id out of scope", () => {
    return request(app)
      .post("/api/reviews/420/comments")
      .send({ username: "bainesface", body: "bad review_id" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});

describe("PATCH: patchReviewIdVotes()", () => {
  it("201: return updated votes ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(201)
      .send({ inc_votes: 100 })
      .then(({ body }) => {
        const bodyVote = body.review;
        expect(Object.keys(bodyVote)).toHaveLength(9);
        expect(bodyVote).toHaveProperty("votes", 101);
      });
  });

  it("201: return updated object with no extra keys/entries ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(201)
      .send({ inc_votes: 100, favFood: "pizza" })
      .then(({ body }) => {
        const bodyVote = body.review;
        expect(Object.keys(bodyVote)).toHaveLength(9);
        expect(bodyVote).toHaveProperty("votes", 101);
        expect(bodyVote).not.toHaveProperty("favFood");
      });
  });

  it("400: error when wrong ID format", () => {
    return request(app)
      .patch("/api/reviews/notAnId")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request, choose valid ID");
      });
  });

  it("404: error when ID out of scope", () => {
    return request(app)
      .patch("/api/reviews/420")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 ID Not Found");
      });
  });

  it("400: error when send obj is incomplete ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request: psql: 23502");
      });
  });
});

describe("DELETE: delete comment by commentID ", () => {
  it("204: deletes item and returns no content ", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  it("400: error when wrong ID format", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request, choose valid ID");
      });
  });

  it("404: error when ID out of scope", () => {
    return request(app)
      .delete("/api/comments/420")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 ID Not Found");
      });
  });
});

describe("GET: getUsers()", () => {
  it("200: response with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const bodyUsers = body.users;
        expect(bodyUsers).toHaveLength(4);
        expect(bodyUsers).toBeInstanceOf(Array);
        bodyUsers.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("username", expect.any(String));
          expect(singleObject).toHaveProperty("name", expect.any(String));
          expect(singleObject).toHaveProperty("avatar_url", expect.any(String));
          expect(Object.keys(singleObject)).toHaveLength(3);
        });
      });
  });
});

describe("GET: getReviews() with queries", () => {
  it("200: sorted_by:reviews (default DESC)", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(13);
        expect(bodyReviews).toBeInstanceOf(Array);
        expect(bodyReviews[0]).toHaveProperty("review_id", 13);
        expect(bodyReviews.at(-1)).toHaveProperty("review_id", 1);
      });
  });

  it("200: category: dexterity", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(1);
      });
  });

  it("200: sorted default reviews with order:ASC", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(13);
        expect(bodyReviews).toBeInstanceOf(Array);
        expect(bodyReviews[0]).toHaveProperty(
          "created_at",
          "1970-01-10T02:08:38.400Z"
        );
        expect(bodyReviews.at(-1)).toHaveProperty(
          "created_at",
          "2021-01-25T11:16:54.963Z"
        );
      });
  });

  it("200: sorted_by:reviews & order:ASC", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=ASC")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(13);
        expect(bodyReviews).toBeInstanceOf(Array);
        expect(bodyReviews[0]).toHaveProperty("review_id", 1);
        expect(bodyReviews.at(-1)).toHaveProperty("review_id", 13);
      });
  });

  it("200: category:dexterity, default order & sort", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(1);
        expect(bodyReviews).toBeInstanceOf(Array);
        expect(bodyReviews[0]).toHaveProperty("category", "dexterity");
      });
  });

  it("200: category:social deduction, order:ASC, sort_by:vots", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction&sort_by=votes&order=ASC")
      .then(({ body }) => {
        const bodyReviews = body.reviews;
        expect(bodyReviews).toHaveLength(11);
        expect(bodyReviews).toBeInstanceOf(Array);
        expect(bodyReviews[0]).toHaveProperty("votes", 5);
        expect(bodyReviews.at(-1)).toHaveProperty("votes", 100);
        bodyReviews.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("category", "social deduction");
        });
      });
  });

  it("404: error when wrong category", () => {
    return request(app)
      .get("/api/reviews?category=wrongCategory")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Category Not Found");
      });
  });

  it("400: error when invalid order input", () => {
    return request(app)
      .get("/api/reviews?order=wrongOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Order Request");
      });
  });

  it("400: error when invalid order input", () => {
    return request(app)
      .get("/api/reviews?sort_by=wrongSort")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Column Not Found");
      });
  });
});

describe("GET /api", () => {
  it("200: endpoints json object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
  it("200; Responds with JSON object containing endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty(["GET /api"]);
        expect(body).toHaveProperty(["GET /api/categories"]);
        expect(body).toHaveProperty(["GET /api/reviews"]);
      });
  });
  it(" / info about README.md file", () => {
    expect(endpoints["GET /"].description).toEqual(
      "serves up info about Readme.md file"
    );
  });
  it("/api endpoints json object", () => {
    expect(endpoints["GET /api"].description).toEqual(
      "serves up a json representation of all the available endpoints of the api"
    );
  });
});
