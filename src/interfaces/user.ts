export default interface IUser {
    username: string;
    role: string;
    fullname: string;
    password: string;
    email?: string;
    blocked: boolean;
}