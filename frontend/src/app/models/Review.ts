export interface ReviewRoot {
    data: Review[],
    pages: number
}

export interface Review {
    type: 'review'
    _id: string
    user_id: string
    book_id: string
    score: number
    content: string
    created_at: string
    updated_at: string
}
// import { User } from "./User"

// export interface Review {
//     _id?: string
//     book_id: string
//     user: User
//     score: number
//     content: string
//     added_at?: Date
//     updated_at?: Date
// }  
