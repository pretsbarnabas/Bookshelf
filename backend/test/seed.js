const MongoClient = require("mongodb").MongoClient;
const Types = require("mongoose").Types



async function seed(){
    const uri = "mongodb://localhost:27017"

    const client = new MongoClient(uri,{
        useNewUrlParser: true
    })

    try {
        await client.connect()
        console.log("connected to db")

        const usersCollection = client.db("Bookshelf").collection("users")
        const booksCollection = client.db("Bookshelf").collection("books")
        const reviewsCollection = client.db("Bookshelf").collection("reviews")
        const commentsCollection = client.db("Bookshelf").collection("comments")
        const summariesCollection = client.db("Bookshelf").collection("summaries")

        usersCollection.drop()
        booksCollection.drop()
        reviewsCollection.drop()
        commentsCollection.drop()
        summariesCollection.drop()


        await usersCollection.insertOne({
            "_id": new Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "username": "admin",
            "password_hashed": "$2b$10$2ticgdLvmAs4b5epdj3rZeyf1.04UBUbxR7m/kk/HAYhhGVLAort.",
            "email": "admin@email.com",
            "created_at": "2016-04-08T15:06:21.595Z",
            "updated_at": "2016-04-08T15:06:21.595Z",
            "last_login": "2016-04-08T15:06:21.595Z",
            "role": "admin",
            "booklist": [
                {
                    "book_id": new Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
                    "read_status": "to_read"
                }
            ]
        })

        await booksCollection.insertOne({
            "_id": new Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "title": "Lorem",
            "author": "Lorem",
            "release": "2016-04-08T15:06:21.595Z",
            "genre": "Crime",
            "user_id": new Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "description": "Lorem",
            "added_at": "2016-04-08T15:06:21.595Z",
            "updated_at": "2016-04-08T15:06:21.595Z"
        })

        await reviewsCollection.insertOne({
            "_id": new Types.ObjectId("a826b9febba8c411cf6d82cb"),
            "user_id": new Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "book_id": new Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "score": 8,
            "content": "Lorem",
            "created_at": "2016-04-08T15:06:21.595Z",
            "updated_at": "2016-04-08T15:06:21.595Z"
        })

        await commentsCollection.insertOne({
            "_id": new Types.ObjectId("7ef503b3e63a6bcb56f8db37"),
            "user_id": new Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "review_id": new Types.ObjectId("a826b9febba8c411cf6d82cb"),
            "content": "Lorem",
            "created_at": "2016-04-08T15:06:21.595Z",
            "updated_at": "2016-04-08T15:06:21.595Z"
        })

        await summariesCollection.insertOne({
            "_id": new Types.ObjectId("72bd5cfdf84d7fea96483da4"),
            "user_id": new Types.ObjectId("db0b0c1f83fb29f652cc5a2f"),
            "book_id": new Types.ObjectId("7fdb24bfd2c9eaca400201b8"),
            "content": "Lorem",
            "created_at": "2016-04-08T15:06:21.595Z",
            "updated_at": "2016-04-08T15:06:21.595Z"
        })

        console.log("seeded")
        client.close()
    } catch (error) {
        console.log(error)
    }

}
seed()