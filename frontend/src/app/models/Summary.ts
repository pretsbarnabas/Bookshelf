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

export interface CreateSummaryModel {
    book_id: string | number
    content: string
}

export function isCreateSummaryModel(obj: any): obj is CreateSummaryModel {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.book_id === 'string' || typeof obj.book_id === 'number' &&
        typeof obj.content === 'string'
}