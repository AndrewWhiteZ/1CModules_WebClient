import { Commit } from "./Commit";

export class Module {

    name: string;
    type: string;
    lastCommit: Commit;
    locked: boolean;
    files: Module[] | null;

    constructor(name: string, type: string, lastCommit: Commit, locked: boolean, files: Module[] | null) {
        this.name = name;
        this.type = type;
        this.lastCommit = lastCommit;
        this.locked = locked;
        this.files = files;
    }

}