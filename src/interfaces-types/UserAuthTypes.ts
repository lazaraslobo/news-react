type CreateAccountInnertType = {
    label: string,
    value: string,
    hasError: boolean,
}

export type CreateAccountType = {
    fullName: CreateAccountInnertType;
    email: CreateAccountInnertType;
    password: CreateAccountInnertType;
}

export type UserResponseInnerType = {
    id: number;
    name: string;
    email: string;
    preferences ?: Preferences;
    created_at: string;
    updated_at: string;
}

export type UserResponseType = {
    user: UserResponseInnerType
}

export type Preferences = {
    userSelections ?: UserSelection;
}

export type UserSelection = {
    id: number;
    user_id: number;
    type: string;
    value: { [key: string]: string|string[] };
}