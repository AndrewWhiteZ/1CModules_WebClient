export class RegRequest {

    username: string;
    email: string;
    fullName: string;
    password: string;

    constructor(username: string, email: string, fullName: string, password: string) {
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
    }

}