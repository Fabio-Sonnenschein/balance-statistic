import hat from 'hat';
import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";
import {sha512} from "js-sha512";

export class AuthService {
    rack: any;

    constructor() {
        this.rack = hat.rack();
    }

    async authUser(email: string, password: string) {
        let user = await collections.user.findOne({email: email});
        if (!user) {
            throw new HttpException('Invalid credentials', 401);
        } else if (user.password != sha512(password)) {
            throw new HttpException('Invalid credentials', 401);
        }
        return user;
    }

    async authToken(token: string) {
        let user = await collections.user.findOne({'session.token': token});
        if (!user) {
            throw new HttpException('Invalid token', 401);
        }
        return user;
    }

    generateToken() {
        return this.rack();
    }
}