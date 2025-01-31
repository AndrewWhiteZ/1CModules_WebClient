import { CommitShort } from "./CommitShort";

export class Module {
  name: string;
  type: string;
  lastCommit: CommitShort;
  locked: boolean;
  files: Module[] | null;

  constructor(name: string, type: string, lastCommit: CommitShort, locked: boolean, files: Module[] | null) {
    this.name = name;
    this.type = type;
    this.lastCommit = new CommitShort(lastCommit.id, lastCommit.message, new Date(lastCommit.when));
    this.locked = locked;
    this.files = files;
  }
}