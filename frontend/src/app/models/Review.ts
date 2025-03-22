import { UserModel } from "./User"

export interface ReviewRoot {
    data: ReviewModel[],
    pages: number
}

export interface ReviewModel {
    type: 'review'
    _id: string
    user: UserModel
    book_id: string
    score: number
    content: string
    created_at: string
    updated_at: string
}
