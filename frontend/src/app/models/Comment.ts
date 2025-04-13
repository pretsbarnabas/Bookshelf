import { ReviewModel } from "./Review"
import { UserLikeModel, UserModel } from "./User"

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
    review: ReviewModel,
    liked_by_user: 'liked' | 'disliked' | 'none'
    likedBy?: UserLikeModel[],
    dislikedBy?: UserLikeModel[],
}