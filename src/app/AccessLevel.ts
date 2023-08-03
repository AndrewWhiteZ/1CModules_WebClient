export class AccessLevel {

    canCommit: boolean;
    canManage: boolean;
    canView: boolean;
    roleName: string;

    constructor(canCommit: boolean, canManage: boolean, canView: boolean, roleName: string) {
        this.canCommit = canCommit;
        this.canManage = canManage;
        this.canView = canView;
        this.roleName = roleName;
    }

}