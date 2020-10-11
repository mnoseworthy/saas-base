export class User {
    constructor() {
        this.uid = "";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.lastUpdated = new Date();
    }
    public uid: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public lastUpdated: Date;
}