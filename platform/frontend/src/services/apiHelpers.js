import {HOME_URL, SIGNIN_URL} from "./apiConfig"

function getRefreshDate() {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 270);
    return now;
}

function clearCurrentUser() {
    localStorage.removeItem("currentUser")
    window.location = SIGNIN_URL
}

function checkCurrentUser() {
    if (localStorage.getItem("currentUser")) {
        window.location = HOME_URL
        return true
    }
    return false
}

function getHeader(auth=true) {
    const header = {"Content-Type":"application/json"}
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (auth && user) {
        header["Authorization"] = "Bearer " + user.access
    }
    return header
}

function parseQuery(query) {
    const parsed = []
    for (var key in query)
        parsed.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
    return parsed.join('&')
}

export {clearCurrentUser, checkCurrentUser, getHeader, parseQuery, getRefreshDate}