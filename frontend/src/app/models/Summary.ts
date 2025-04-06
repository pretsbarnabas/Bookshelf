import { BookModel } from "./Book"
import { UserModel } from "./User"

export interface SummaryRoot {
    data: SummaryModel[],
    pages: number
}

export interface SummaryModel {
    _id: string
    content: string
    updated_at: string
    user: UserModel
    book: BookModel
}