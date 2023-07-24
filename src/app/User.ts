export class User {

    id: string;
    name: string;
    fullName: string;
    createdOn: Date;

    constructor(id: string, name: string, fullName: string, createdOn: Date) {
        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.createdOn = createdOn;
    }

}