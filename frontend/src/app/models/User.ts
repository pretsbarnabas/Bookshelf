export interface UserRegistrationFormModel {
    username: string,
    email: string,
    passwordGroup: any
}

export interface UserRegistrationModel {
    username: string,
    password: string,
    email: string,
    role: 'user'
}

export interface UserLoginModel {
    username: string,
    password: string
}

export interface UserLoggedInModel {
    username: string
    email: string
    role: 'user' | 'editor' | 'admin'
    booklist: any[]
    created_at: string
    updated_at: string
    last_login: string
}