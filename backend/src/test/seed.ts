const MongoClient = require("mongodb").MongoClient
import mongoose from "mongoose"



async function seed(){
    const uri = "mongodb://localhost:27017/Bookshelf"

    await mongoose.connect(uri)
    const client = mongoose.connection.db!

    try {
        console.log("Seeder: Connected to db")

        const usersCollection = client.collection("users")
        const booksCollection = client.collection("books")
        const reviewsCollection = client.collection("reviews")
        const commentsCollection = client.collection("comments")
        const summariesCollection = client.collection("summaries")


        const collections = (await client.listCollections().toArray()).map((collection:any) => collection.name as string);

        for (let i = 0; i < collections.length; i++) {
            await client.dropCollection(collections[i]);
        }

        await usersCollection.insertOne({
            "_id": new mongoose.Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "username": "admin",
            "password_hashed": "$2b$10$2ticgdLvmAs4b5epdj3rZeyf1.04UBUbxR7m/kk/HAYhhGVLAort.",
            "email": "admin@email.com",
            "created_at": new Date("2016-04-08T15:06:21.595Z"),
            "updated_at": new Date("2016-04-08T15:06:21.595Z"),
            "last_login": new Date("2016-04-08T15:06:21.595Z"),
            "role": "admin",
            "booklist": [
                {
                    "book_id": new mongoose.Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
                    "read_status": "to_read"
                }
            ]
        })

        await booksCollection.insertOne({
            "_id": new mongoose.Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "title": "Lorem",
            "author": "Lorem",
            "release": new Date("2016-04-08T15:06:21.595Z"),
            "genre": "Crime",
            "user_id": new mongoose.Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "description": "Lorem",
            "added_at": new Date("2016-04-08T15:06:21.595Z"),
            "updated_at": new Date("2016-04-08T15:06:21.595Z")
        })

        await reviewsCollection.insertOne({
            "_id": new mongoose.Types.ObjectId("a826b9febba8c411cf6d82cb"),
            "user_id": new mongoose.Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "book_id": new mongoose.Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "score": 8,
            "content": "Lorem",
            "created_at": new Date("2016-04-08T15:06:21.595Z"),
            "updated_at": new Date("2016-04-08T15:06:21.595Z")
        })

        await commentsCollection.insertOne({
            "_id": new mongoose.Types.ObjectId("7ef503b3e63a6bcb56f8db37"),
            "user_id": new mongoose.Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "review_id": new mongoose.Types.ObjectId("a826b9febba8c411cf6d82cb"),
            "content": "Lorem",
            "created_at": new Date("2016-04-08T15:06:21.595Z"),
            "updated_at": new Date("2016-04-08T15:06:21.595Z")
        })

        await summariesCollection.insertOne({
            "_id": new mongoose.Types.ObjectId("72bd5cfdf84d7fea96483da4"),
            "user_id": new mongoose.Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "book_id": new mongoose.Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "content": "Lorem",
            "created_at": new Date("2016-04-08T15:06:21.595Z"),
            "updated_at": new Date("2016-04-08T15:06:21.595Z")
        })

        console.log("Seeder: Seeded")
    } catch (error) {
        console.log(error)
    }

}
seed()
module.exports = {seed}