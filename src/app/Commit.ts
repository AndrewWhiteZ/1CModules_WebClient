import { User } from "./User";

export class Commit {

    id: string;
    message: string;
    tags: string[];
    author: User;
    when: Date;

    constructor(id: string, message: string, tags: string[], author: User, when: Date) {
        this.id = id;
        this.message = message;
        this.tags = tags;
        this.author = author;
        this.when = new Date(when);
    }
}