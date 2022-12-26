export interface AuthResponse {
    _id: string,
    name: string,
    session: {
        token: string,
        expires: Date
    }
}
