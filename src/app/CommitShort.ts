import { DateTime } from "./DateTime";

export class CommitShort {

    id: string;
    message: string;
    when: DateTime;

    constructor(id: string, message: string, when: Date) {
        this.id = id;
        this.message = message;
        this.when = new DateTime(
            when.toString().slice(0, 4),
            when.toString().slice(5, 7),
            when.toString().slice(8, 10),
            when.toString().slice(11, 13),
            when.toString().slice(14, 16),
            when.toString().slice(17, 19),
        );
    }

}