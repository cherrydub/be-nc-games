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

describe("catchAll bad path", () => {
  it("404: GET response with array of category objects", () => {
    return request(app)
      .get("/api/nonexistingpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Path not found!!!");
      });
  });
});

describe("getCategories(", () => {
  it("200: GET response with array of category objects", () => {
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

describe("getReviewById()", () => {
  it("200: GET response of review object with 9 keys in Object ", () => {
    return request(app)
      .get("/api/reviews/7")
      .then(({ body }) => {
        const bodyReview = body.review;
        expect(Object.keys(bodyReview)).toHaveLength(9);
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
