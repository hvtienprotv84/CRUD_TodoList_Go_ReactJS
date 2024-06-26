package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/RotrixLOL/go-react-crud/models"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error ocurred while loading .env file")
	}

	// Declare server port
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "5000"
	}

	app := fiber.New()

	// Connect to mongoDB
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		panic(err)
	}

	// Crete collection in x database
	coll := client.Database("go-react-crud").Collection("users")

	// Load frontend
	app.Static("/", "./client/dist")

	// Log all requests
	app.Use(logger.New())

	// Use CORS to avoid errors in frontend while using the API
	app.Use(cors.New(cors.Config{
		// Put frontend url (https://domain.com) or if it's in local (http://localhost:5000), or whatever service to use
		// Leave in "*" to give access to all origins
		AllowOrigins: "https://go-react-crud.fly.dev", // <- this line
		AllowHeaders: "Access-Control-Allow-Origin",   // required
	}))

	// Declare route group
	api := app.Group("/api")

	// Get all users
	api.Get("/users", func(c *fiber.Ctx) error {
		var users []models.User
		results, err := coll.Find(context.TODO(), bson.M{})
		if err != nil {
			panic(err)
		}

		for results.Next(context.TODO()) {
			var user models.User
			results.Decode(&user)
			users = append(users, user)
		}

		return c.JSON(&fiber.Map{
			"status": c.Response().StatusCode(),
			"users":  users,
		})
	})

	// Create user
	api.Post("/users", func(c *fiber.Ctx) error {
		var user models.User

		c.BodyParser(&user)

		_, err := coll.InsertOne(context.TODO(), bson.D{
			{
				Key:   "name",
				Value: user.Name,
			},
		})
		if err != nil {
			panic(err)
		}

		return c.JSON(&fiber.Map{
			"status": c.Response().StatusCode(),
			"name":   user.Name,
		})
	})

	// Delete user
	api.Delete("/users", func(c *fiber.Ctx) error {
		var user models.User
		c.BodyParser(&user)

		id := user.Id

		_, err = coll.DeleteOne(context.TODO(), bson.M{"_id": id})

		if err != nil {
			return c.JSON(&fiber.Map{
				"status": fiber.StatusInternalServerError,
				"msg":    "Error while deleting specific user",
			})
		}

		return c.JSON(&fiber.Map{
			"status": fiber.StatusOK,
			"msg":    "Deleted user with id " + c.Params("id"),
		})
	})

	// Listen on port 5000 | env port variable from x service
	log.Fatal(app.Listen(":" + PORT))
}
