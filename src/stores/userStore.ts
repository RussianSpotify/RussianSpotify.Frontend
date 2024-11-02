import User from "../models/User";
import {makeAutoObservable} from "mobx";

export default class UserStore {
    _user: User = new User()
    _isAuth: boolean = false
    _isAdmin: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    login(user: User) {
        this._isAuth = true
        this._user = user
        this._isAdmin = user._roles.includes('Админ')
    }

    logout() {
        this._isAuth = false
        this._user = new User()
    }

    get isAuth() {
        return this._isAuth
    }

    get isAdmin() {
        return this._isAdmin
    }

    get user() {
        return this._user;
    }
}