import { AccessLevel } from "./AccessLevel";
import { User } from "./User";

export class Profile {

    user: User;
    accessLevel: AccessLevel;

    constructor(user: User, accessLevel: AccessLevel) {
        this.user = user;
        this.accessLevel = accessLevel;
    }

}