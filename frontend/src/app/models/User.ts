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

export function isUserLoginModel(model: UserLoginModel | UserRegistrationFormModel | undefined): model is UserLoginModel {
    if(!model) return false;
    return 'username' in model && 'password' in model;
}

export function isUserRegistrationFormModel(model: UserLoginModel | UserRegistrationFormModel | undefined): model is UserRegistrationFormModel {
    if(!model) return false;
    return 'username' in model && 'email' in model && 'passwordGroup' in model;
}


export interface UserModel {
    type: 'user'
    _id: string
    username: string
    email: string
    role: 'user' | 'editor' | 'admin'
    booklist: any[]
    created_at: string
    updated_at: string
    last_login: string
    imageUrl?: string
    profile_image?: string
}

export interface UserRoot {
    data: UserModel[]
    pages: number
}