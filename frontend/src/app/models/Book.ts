export interface BookRoot {
    data: Book[],
    pages: number
}

export interface Book {
    type: 'book'
    _id: string
    title: string
    author: string
    release: string
    genre: string
    user_id: string
    description: string
    added_at: string
    updated_at: string
    imageUrl: string
}
