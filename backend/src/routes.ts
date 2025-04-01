const express = require("express")
import { UserController } from "./controllers/user.controller"
import { BookController } from "./controllers/book.controller"
import { ReviewController } from "./controllers/review.controller"
import { CommentController } from "./controllers/comment.controller"
import { SummaryController } from "./controllers/summary.controller"
import { Authenticator } from "./controllers/auth.controller"


export const router = express.Router()

router.post("/login",Authenticator.login)
router.post("/refreshToken",Authenticator.refreshToken)

// User routes

router.get("/users/",UserController.getAllUsers)
router.get("/users/:id",UserController.getUserById)
router.post("/users/",UserController.createUser)
router.delete("/users/:id",UserController.deleteUser)
router.put("/users/:id",UserController.updateUser)

// Booklist routes
router.get("/users/:id/booklist",UserController.getBooklist)
router.put("/users/:id/booklist",UserController.modifyBooklist)

// Likes and Dislikes
router.get("/reviews/:id/likedby",ReviewController.getLikedBy)
router.get("/reviews/:id/dislikedby",ReviewController.getDislikedBy)
router.put("/reviews/:id/like",ReviewController.putLike)
router.get("/comments/:id/likedby",CommentController.getLikedBy)
router.get("/comments/:id/dislikedby",CommentController.getDislikedBy)
router.put("/comments/:id/like",CommentController.putLike)


// Book routes
router.get("/books/",BookController.getAllBooks)
router.get("/books/:id",BookController.getBookById)
router.post("/books/",BookController.createBook)
router.delete("/books/:id",BookController.deleteBook)
router.put("/books/:id",BookController.updateBook)

// Review routes
router.get("/reviews/",ReviewController.getAllReviews)
router.get("/reviews/:id",ReviewController.getReviewById)
router.post("/reviews/",ReviewController.createReview)
router.delete("/reviews/:id",ReviewController.deleteReview)
router.put("/reviews/:id",ReviewController.updateReview)
router.get("/reviews/user/:id",ReviewController.getUsersReviews)

// Comment routes
router.get("/comments/",CommentController.getAllComments)
router.get("/comments/:id",CommentController.getCommentById)
router.post("/comments/",CommentController.createComment)
router.delete("/comments/:id",CommentController.deleteComment)
router.put("/comments/:id",CommentController.updateComment)

// Summary routes
router.get("/summaries/",SummaryController.getAllSummaries)
router.get("/summaries/:id",SummaryController.getSummaryById)
router.post("/summaries/",SummaryController.createSummary)
router.delete("/summaries/:id",SummaryController.deleteSummary)
router.put("/summaries/:id",SummaryController.updateSummary)

module.exports = router