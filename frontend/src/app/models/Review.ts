import { UserLoggedInModel } from "./User"

export interface Review {
    _id: string
    book_id: string
    user: UserLoggedInModel
    score: number
    content: string
    added_at: Date
    updated_at: Date
}    
