import axios from "axios";
import {isJwtDied} from "../functions/isJwtDied";

const $host = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_API,
    validateStatus: status => true
})

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_API,
    validateStatus: status => true
})

const $hostFiles = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_API_FILES,
    validateStatus: status => true
})

const $authHostFiles = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_API_FILES,
    validateStatus: status => true
})

const $hostSubscribe = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_SUBSCRIBE_API,
    validateStatus: status => true
})

const $authSubscribe = axios.create({
    baseURL: process.env.REACT_APP_SPOTIFY_SUBSCRIBE_API,
    validateStatus: status => true
})

// TODO: Пофиксить вызов метода RefreshToken, он должен быть не тут
function authInterceptor(config: any) {
    let token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`

    if (isJwtDied(token)) {
        let refreshToken = localStorage.getItem('refresh');
        $host.post("api/Auth/RefreshToken", {
            accessToken: token,
            refreshToken: refreshToken
        }).then(x => {
            config.headers.Authorization = `Bearer ${x.data.accessToken}`;
            localStorage.setItem('token', token!);
            localStorage.setItem('refresh', x.data.refreshToken);
        }).catch(error => {
            console.log(error)
        });
    }

    return config
}

$authHost.interceptors.request.use(authInterceptor)
$authHostFiles.interceptors.request.use(authInterceptor)
$authSubscribe.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
    $hostFiles,
    $authHostFiles,
    $hostSubscribe,
    $authSubscribe
}