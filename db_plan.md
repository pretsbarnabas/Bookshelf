# BookList - Záróvizsga adatbázis terv



## Táblák

### Users
|Mező|Típus|Megkötések|
|----|-----|----------|
|id|`ObjectID`|primary key, required|
|username|`string`|required, min1, max100|
|password_hashed|`string`|required (hashelés backenden)|
|email|`string` (email format)|required|
|created_at|`Date`|required, default: Date.now()|
|updated_at|`Date`|required, default: Date.now()|
|last_login|`Date`|required|
|role|`string` (ENUM)| required, ENUM: user,editor,admin|
|booklist|`Array` [ {"book_id": `ObjectID`, "read_status: `string` (ENUM)"} ]|required, ENUM: to_read,has_read,is_reading,dropped,favorite|

### Books
|Mező|Típus|Megkötések|
|----|-----|----------|
|id|`ObjectID`|primary key, required|
|title|`string`|required,min1,max200|
|author|`string`|required,min1,max200|
|release|`Date`|required|
|genre|`string` (ENUM)| required, ENUM: Crime,Detective,Romance,Erotic,Fantasy,SciFi,Action,Adventure,Mystery,Horror,Comedy,Literary prose,Poetry,Drama,Historical,Children,Philosophical,Religious|
|user_id|`ObjectID`|required, foreign key to users.id|
|description|`string`|required,max:10000|
|added_at|`Date`|required, default: Date.now()|
|updated_at|`Date`|required, default: Date.now()|

### Reviews
|Mező|Típus|Megkötések|
|----|-----|----------|
|id|`ObjectID`|primary key, required|
|user_id|`ObjectID`|required, foreign key to users.id|
|book_id|`ObjectID`|required, foreign key to books.id|
|score|`number`|required,min1,max10|
|content|`string`|required,min0,max10000|
|created_at|`Date`|required, default: Date.now()|
|updated_at|`Date`|required, default: Date.now()|

### Summaries
|Mező|Típus|Megkötések|
|----|-----|----------|
|id|`ObjectID`|primary key, required|
|user_id|`ObjectID`|required, foreign key to users.id|
|user_id|`ObjectID`|required, foreign key to books.id|
|content|`string`|required,min1|
|created_at|`Date`|required,  default: Date.now()|
|updated_at|`Date`|required, default: Date.now()|

### Comments
|Mező|Típus|Megkötések|
|----|-----|----------|
|id|`ObjectID`|primary key, required|
|user_id|`ObjectID`|foreign key to users.id, required|
|review_id|`ObjectID`|foreign key to reviews.id, required|
|content|`string`|min:1,max:1000|
|created_at|`Date`|required, default: Date.now()|
|updated_at|`Date`|required, default: Date.now()|

## Adatbázis vizuálisan
![DB Image][imagelink]

## Adatbázis MongoDB Shell formában
```
use BooksProject;

db.createCollection("books", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "books",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId",
                    "title": "id"
                },
                "ttl": {
                    "bsonType": "string",
                    "title": "title",
                    "maxLength": 200,
                    "minLength": 1
                },
                "athr": {
                    "bsonType": "string",
                    "title": "author",
                    "maxLength": 200,
                    "minLength": 1
                },
                "release": {
                    "bsonType": "date"
                },
                "genre": {
                    "bsonType": "string",
                    "enum": [
                        "Crime",
                        "Detective",
                        "Romance",
                        "Erotic",
                        "Fantasy",
                        "SciFi",
                        "Action",
                        "Adventure",
                        "Mystery",
                        "Horror",
                        "Comedy",
                        "Literary prose",
                        "Poetry",
                        "Drama",
                        "Historical",
                        "Children",
                        "Philosophical",
                        "Religious"
                    ]
                },
                "user_id": {
                    "bsonType": "objectId"
                },
                "description": {
                    "bsonType": "string",
                    "maxLength": 10000
                },
                "added_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                }
            },
            "additionalProperties": false,
            "required": [
                "id",
                "ttl",
                "athr",
                "release",
                "genre",
                "description",
                "added_at",
                "updated_at"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});




db.createCollection("users", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "users",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "username": {
                    "bsonType": "string",
                    "maxLength": 100,
                    "minLength": 1
                },
                "password_hashed": {
                    "bsonType": "string"
                },
                "email": {
                    "bsonType": "string"
                },
                "created_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                },
                "last_login": {
                    "bsonType": "date"
                },
                "role": {
                    "bsonType": "string",
                    "enum": [
                        "user",
                        "editor",
                        "admin"
                    ]
                },
                "booklist": {
                    "bsonType": "array",
                    "additionalItems": true,
                    "items": {
                        "bsonType": "object",
                        "properties": {
                            "book_id": {
                                "bsonType": "objectId"
                            },
                            "read_status": {
                                "bsonType": "string",
                                "enum": [
                                    "to_read",
                                    "has_read",
                                    "is_reading",
                                    "dropped",
                                    "favorite"
                                ]
                            }
                        },
                        "additionalProperties": false,
                        "required": [
                            "book_id",
                            "read_status"
                        ]
                    }
                }
            },
            "additionalProperties": false,
            "required": [
                "id",
                "username",
                "password_hashed",
                "email",
                "created_at",
                "updated_at",
                "last_login",
                "role"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});




db.createCollection("reviews", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "reviews",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "user_id": {
                    "bsonType": "objectId"
                },
                "book_id": {
                    "bsonType": "objectId"
                },
                "score": {
                    "bsonType": "number",
                    "maximum": 10,
                    "minimum": 1
                },
                "content": {
                    "bsonType": "string",
                    "maxLength": 10000,
                    "minLength": 0
                },
                "created_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                }
            },
            "additionalProperties": false,
            "required": [
                "id",
                "user_id",
                "book_id",
                "score",
                "content",
                "created_at",
                "updated_at"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});




db.createCollection("summaries", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "summaries",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "user_id": {
                    "bsonType": "objectId"
                },
                "book_id": {
                    "bsonType": "objectId"
                },
                "content": {
                    "bsonType": "string",
                    "minLength": 1
                },
                "created_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                }
            },
            "additionalProperties": false,
            "required": [
                "id",
                "user_id",
                "book_id",
                "content",
                "created_at",
                "updated_at"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});




db.createCollection("comments", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "comments",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "id": {
                    "bsonType": "objectId"
                },
                "user_id": {
                    "bsonType": "objectId"
                },
                "review_id": {
                    "bsonType": "objectId"
                },
                "content": {
                    "bsonType": "string",
                    "maxLength": 1000,
                    "minLength": 1
                },
                "created_at": {
                    "bsonType": "date"
                },
                "updated_at": {
                    "bsonType": "date"
                }
            },
            "additionalProperties": false,
            "required": [
                "id",
                "user_id",
                "review_id",
                "content",
                "created_at",
                "updated_at"
            ]
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});
```

## Példa adat
```
db.books.insert({
    "id": ObjectId("7fdb24bfd2c9eaca400201b8"),
    "ttl": "Lorem",
    "athr": "Lorem",
    "release": ISODate("2016-04-08T15:06:21.595Z"),
    "genre": "Crime",
    "user_id": ObjectId("bbcb7eae48aa8ebcf9170140"),
    "description": "Lorem",
    "added_at": ISODate("2016-04-08T15:06:21.595Z"),
    "updated_at": ISODate("2016-04-08T15:06:21.595Z")
});

db.users.insert({
    "id": ObjectId("db0b0c1f83fb29f652cc5a2f"),
    "username": "Lorem",
    "password_hashed": "$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa",
    "email": "sample@email.com",
    "created_at": ISODate("2016-04-08T15:06:21.595Z"),
    "updated_at": ISODate("2016-04-08T15:06:21.595Z"),
    "last_login": ISODate("2016-04-08T15:06:21.595Z"),
    "role": "user",
    "booklist": [
        {
            "book_id": ObjectId("b6f57d5cb100e1c6b1dddcfe"),
            "read_status": "to_read"
        }
    ]
});

db.reviews.insert({
    "id": ObjectId("a826b9febba8c411cf6d82cb"),
    "user_id": ObjectId("65ae40cdabccdafedc9c01de"),
    "book_id": ObjectId("a04cadf92fa8b9c550f4bbff"),
    "score": 8,
    "content": "Lorem",
    "created_at": ISODate("2016-04-08T15:06:21.595Z"),
    "updated_at": ISODate("2016-04-08T15:06:21.595Z")
});

db.summaries.insert({
    "id": ObjectId("72bd5cfdf84d7fea96483da4"),
    "user_id": ObjectId("1b6fad0cddcb9f5dd4abe8e2"),
    "book_id": ObjectId("fac3f3c8babba71ff700efda"),
    "content": "Lorem",
    "created_at": ISODate("2016-04-08T15:06:21.595Z"),
    "updated_at": ISODate("2016-04-08T15:06:21.595Z")
});

db.comments.insert({
    "id": ObjectId("7ef503b3e63a6bcb56f8db37"),
    "user_id": ObjectId("e7bac4050eaf7b5ef50e0bae"),
    "review_id": ObjectId("f9df7adaadbe730bbec1908b"),
    "content": "Lorem",
    "created_at": ISODate("2016-04-08T15:06:21.595Z"),
    "updated_at": ISODate("2016-04-08T15:06:21.595Z")
});
```

[imagelink]: https://cdn.discordapp.com/attachments/760462650365837332/1336425516940660786/image.png?ex=67a3c2c0&is=67a27140&hm=b4752f344dbdccbe53966cf34713bf6bceb819a5bd67cc8b2e2f715a263abe52&