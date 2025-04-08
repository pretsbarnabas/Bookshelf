import { BookModel } from "./Book"
import { UserModel, UserLikeModel } from "./User"

export interface ReviewRoot {
    data: ReviewModel[],
    pages: number
}

export interface ReviewModel {
    type: 'review'
    _id: string
    user: UserModel
    book: BookModel
    score: number
    content: string
    created_at: string
    updated_at: string,
    liked_by_user: 'liked' | 'disliked' | 'none'
    likedBy?: UserLikeModel[],
    dislikedBy?: UserLikeModel[],
}
