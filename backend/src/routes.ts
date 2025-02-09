const express = require("express")
import { UserController } from "./controllers/user.controller"
import { BookController } from "./controllers/book.controller"
import { ReviewController } from "./controllers/review.controller"
import { CommentController } from "./controllers/comment.controller"
import { SummaryController } from "./controllers/summary.controller"

/**
 * @swagger
 * components:
 *  schemas:
 *      user:
 *          type: object
 *          properties:
 *              _id:
 *                  type: object
 *              username:
 *                  type: string
 *              password_hashed:
 *                  type: string
 *              email:
 *                  type: string
 *              created_at:
 *                  type: string
 *              updated_at:
 *                  type: string
 *              last_login:
 *                  type: string
 *              role:
 *                  type: string
 *              booklist:
 *                  type: array
 *          example:
 *              _id: 67a5c3cba3bb48fa646f9638
 *              username: User
 *              password_hashed: $2b$10$Tk179TvlrUQqQuxU/XHoI.rP/edBea12duhNIOTV2VO9FZZhvRo5S
 *              email: email@email.com
 *              role: user
 *              booklist: []
 *              created_at: 2025-02-07T08:26:51.424Z
 *              updated_at: 2025-02-07T08:26:51.424Z
 *              last_login: 2025-02-07T08:26:51.424Z
 *              
 *  requestBodies:
 *      user:
 *          type: object
 *          required: 
 *              - username
 *              - password
 *              - email
 *              - role
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *              email:
 *                  type: string
 *              role:
 *                  type: string
 */

export const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: login
 *     description: Login feature
 *
 * /api/login:
 *   post:
 *     summary: Login for a user
 *     tags: 
 *       - login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post("/login",UserController.login)

// User routes

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Routes managing users
 *
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of requested users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 *
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/user'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 */
router.get("/users/",UserController.getAllUsers)
router.get("/users/:id",UserController.getUserById)
router.post("/users/",UserController.createUser)
router.delete("/users/:id",UserController.deleteUser)
router.put("/users/:id",UserController.updateUser)


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
router.get("/summary/",SummaryController.getAllSummaries)
router.get("/summary/:id",SummaryController.getSummaryById)
router.post("/summary/",SummaryController.createSummary)
router.delete("/summary/:id",SummaryController.deleteSummary)
router.put("/summary/:id",SummaryController.updateSummary)

module.exports = router