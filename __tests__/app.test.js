const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("getCategories(", () => {
  it("200: GET response with array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        expect(body).toBeInstanceOf(Array);
        body.forEach((singleObject) => {
          expect(singleObject).toHaveProperty("slug", expect.any(String));
          expect(singleObject).toHaveProperty(
            "description",
            expect.any(String)
          );
        });
      });
  });
});

describe("getReviewById()", () => {
  it("200: GET response of review object with 9 keys in Object ", () => {
    return request(app)
      .get("/api/reviews/7")
      .then(({ body }) => {
        expect(Object.keys(body)).toHaveLength(9);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("review_id", expect.any(Number));
        expect(body).toHaveProperty("title", expect.any(String));
        expect(body).toHaveProperty("review_body", expect.any(String));
        expect(body).toHaveProperty("designer", expect.any(String));
        expect(body).toHaveProperty("review_img_url", expect.any(String));
        expect(body).toHaveProperty("votes", expect.any(Number));
        expect(body).toHaveProperty("category", expect.any(String));
        expect(body).toHaveProperty("owner", expect.any(String));
        expect(body).toHaveProperty("created_at", expect.any(String));
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
        expect(body.msg).toBe("404 ID not found");
      });
  });
});
