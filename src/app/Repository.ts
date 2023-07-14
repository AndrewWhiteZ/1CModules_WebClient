import { Tag } from "./Tag";
import { User } from "./User";

export class Repository {

    id: string;
    name: string;
    tags: string[];
    creator: User;
    isPublic: boolean;

    constructor(id: string, name: string, tags: string[], creator: User, isPublic: boolean) {
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.creator = creator;
        this.isPublic = isPublic;
    }

}