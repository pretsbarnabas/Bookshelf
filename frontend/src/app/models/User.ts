export interface UserRegistrationFormModel {
    name: string,
    email: string,
    passwordGroup: any
}

export interface UserRegistrationModel {
    username: string,
    email: string,
    password: string,
    role: 'user'
}

export interface UserLoginModel {
    email: string,
    password: string
}

export interface UserLoggedInModel {
    username: string,
    email: string
    role: 'user' | 'editor' | 'admin'
}