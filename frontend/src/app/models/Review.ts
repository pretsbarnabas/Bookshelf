export interface Review {
    _id: string
    book_id: string
    user_id: string
    score: number
    content: string
    added_at: Date
    updated_at: Date
}    
