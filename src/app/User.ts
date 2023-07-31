export class User {

    id: string;
    name: string;
    fullName: string;
    createdOn: Date;
    email: string | null;

    constructor(id: string, name: string, fullName: string, createdOn: Date, email: string | null) {
        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.createdOn = createdOn;
        this.email = email;
    }

}