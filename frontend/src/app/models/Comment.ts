import { ReviewModel } from "./Review"
import { UserModel } from "./User"

export interface CommentRoot {
    data: CommentModel[],
    pages: number
}

export interface CommentModel {
    _id: string
    content: string
    created_at: string
    updated_at: string
    user: UserModel
    review: ReviewModel
}