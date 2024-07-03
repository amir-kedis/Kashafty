import request from "supertest";
import app from "../app";
import db from "../database/db";
import bcrypt from "bcryptjs";

jest.mock("../database/db");
jest.mock("bcryptjs");
jest.mock("../utils/generateToken", () => jest.fn());

import generateToken from "../utils/generateToken";

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new captain", async () => {
      const newCaptain = {
        firstName: "John",
        middleName: "Doe",
        lastName: "Smith",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        gender: "male",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ captainId: 1, ...newCaptain }],
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const response = await request(app)
        .post("/api/auth/signup")
        .send(newCaptain);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Captain created successfully");
      expect(generateToken).toHaveBeenCalledWith(expect.any(Object), 1);
    });

    it("should return 400 if email is taken", async () => {
      const newCaptain = {
        firstName: "John",
        middleName: "Doe",
        lastName: "Smith",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        password: "password123",
        gender: "male",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ email: "john.doe@example.com" }],
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send(newCaptain);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email is taken!!");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a captain", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const captain = {
        captainId: 1,
        ...loginData,
        password: "hashedPassword",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [captain] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged in successfully");
      expect(generateToken).toHaveBeenCalledWith(expect.any(Object), 1);
    });

    it("should return 400 if email is invalid", async () => {
      const loginData = {
        email: "invalid@example.com",
        password: "password123",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email");
    });

    it("should return 400 if password is invalid", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "invalidPassword",
      };

      const captain = {
        captainId: 1,
        email: "john.doe@example.com",
        password: "hashedPassword",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [captain] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid password");
    });
  });

  describe("PATCH /api/auth/newPassword", () => {
    it("should update the password", async () => {
      const updatePasswordData = {
        oldPassword: "oldPassword123",
        newPassword: "newPassword123",
      };

      const captain = {
        captainId: 1,
        password: "oldHashedPassword",
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [captain] });

      const response = await request(app)
        .patch("/api/auth/newPassword")
        .send(updatePasswordData)
        .set("Cookie", "token=some-jwt-token"); // assuming authentication middleware

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password updated successfully");
      expect(response.body.body).toEqual(
        expect.objectContaining({ password: "newHashedPassword" }),
      );
    });

    it("should return 400 if old password is invalid", async () => {
      const updatePasswordData = {
        oldPassword: "invalidOldPassword",
        newPassword: "newPassword123",
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .patch("/api/auth/newPassword")
        .send(updatePasswordData)
        .set("Cookie", "token=some-jwt-token"); // assuming authentication middleware

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Old password is Invalid");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should log out the captain", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", "token=some-jwt-token"); // assuming authentication middleware

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return the logged-in captain", async () => {
      const captain = {
        captainId: 1,
        firstName: "John",
        middleName: "Doe",
        lastName: "Smith",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        gender: "male",
      };

      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", "token=some-jwt-token") // assuming authentication middleware
        .set("captain", JSON.stringify(captain)); // mock captain data

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("You are in");
      expect(response.body.body).toEqual(captain);
    });
  });
});
