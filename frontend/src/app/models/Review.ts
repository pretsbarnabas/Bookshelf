export interface ReviewRoot {
    data: Review[],
    pages: number
}

export interface Review {
    type: 'review'
    _id: string
    user: UserModel
    book_id: string
    score: number
    content: string
    created_at: string
    updated_at: string
}
import { UserModel } from "./User"

export interface ReviewPB {
    _id?: string
    book_id: string
    user: UserModel
    score: number
    content: string
    added_at?: Date
    updated_at?: Date
}  
