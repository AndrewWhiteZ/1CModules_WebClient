export class Commit {

    id: string;
    message: string;
    when: Date;

    constructor(id: string, message: string, when: Date) {
        this.id = id;
        this.message = message;
        this.when = when;
    }

}