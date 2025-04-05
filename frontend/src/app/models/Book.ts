import { UserModel } from "./User"

export interface BookRoot {
    data: BookModel[],
    pages: number
}

export interface BookModel {
    type: 'book'
    _id: string
    title: string
    author: string
    release: string
    genre: string
    user_id: number
    description: string
    added_at: string
    updated_at: string
    imageUrl: string
}

export interface CreateBookModel {
    title: string,
    author?: string,
    release: string,
    genre: string,
    description: string,
    image?: string
}

export function isCreateBookModel(obj: any): obj is CreateBookModel {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.title === 'string' &&
        (typeof obj.author === 'undefined' || typeof obj.author === 'string') &&
        typeof obj.release === 'string' &&
        typeof obj.genre === 'string' &&
        typeof obj.description === 'string' &&
        (typeof obj.image === 'undefined' || typeof obj.image === 'string');
}
