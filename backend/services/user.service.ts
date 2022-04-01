import {collections} from "./database.service";
import {HttpException} from "../exceptions/http.exception";
import {User} from '../models/user';
import {sha512} from "js-sha512";

export class UserService {
    async getUser(email: string) {
        let user = await collections.user.findOne({email: email});
        if (!user) throw new HttpException('User does not exist', 404);
        return user;
    }

    async insertUser(user: User) {
        let existingUser = await collections.user.findOne({email: user.email});
        if (existingUser) throw new HttpException('Email already registered', 409);

        user.password = sha512(user.password);
        return collections.user.insertOne(user);
    }

    async setToken(email: string, token: string, expires: Date) {
        let updateQuery = await collections.user.updateOne({email: email}, {$set: {session: {token: token, expires: expires}}});
        if (updateQuery.modifiedCount !== 1) {
            throw new HttpException('Token update failed', 500);
        } else {
            return true;
        }
    }

    validateUser(user: User) {
        if (!(user.email && user.name && user.password)) return false;
        if (!(/[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+/).test(user.email)) return false;
        if (user.password.length <= 8) return false;
        return true;
    }

    async deleteUser(email: string) {
        let user = collections.user.deleteOne({email: email});
        if (!user) {
            throw new HttpException('User removal failed', 500);
        } else {
            return true;
        }
    }

    async updateUser(email: string, update: any) {
        let query = await collections.user.updateOne({email: email}, {$set: update});
        if (query.modifiedCount !== 1) {
            throw new HttpException('User update failed', 500);
        } else {
            return true;
        }
    }
}