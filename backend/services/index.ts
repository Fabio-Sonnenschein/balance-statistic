import { AuthService } from './auth.service';
import {UserService} from "./user.service";


export default {
    // Centralized Service export
    authService: new AuthService(),
    userService: new UserService()
}
