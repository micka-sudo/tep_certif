import axios from 'axios';
import {onBadAuth, refreshToken} from './auth.service'
import {REACT_APP_API_URL} from './apiConfig'
import {getHeader, parseQuery} from './apiHelpers'

const errorHandler = (error) => {
    switch (error.response.status) {
        case 401:
            onBadAuth()
            break
        default:
            break             
    }   
}

const checkRefresh = (callback) => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    console.log('checkRefresh')
    if (user) {
        console.log('checkRefresh + ')
        console.log('refreshDate ' + new Date(user.refreshDate))
        console.log('now :' + new Date())
        console.log(new Date(user.refreshDate) > new Date())
        if (new Date(user.refreshDate) < new Date()) {
            console.log('checkRefresh ++ ')
            refreshToken(user, callback)
        }
        else {
            console.log('checkRefresh +- ')
            callback();
        }
    }
    else {
        console.log('checkRefresh - ')
        onBadAuth();
    }
}

function getContents(path, query, successHandler) {
    checkRefresh(() => {
        axios.get(REACT_APP_API_URL + path + '?' + parseQuery(query), {headers: getHeader(true)})
            .then(function (response) {
                successHandler(response.data);
            })
            .catch(errorHandler)
    });
}

function putContent(path, data, successHandler, data_to_json=true) {
    checkRefresh(() => {
        const parsed = data_to_json ? JSON.stringify(data) : data;
            axios.patch(REACT_APP_API_URL + path, parsed,  {headers: getHeader(true)})
            .then((response) => {
                successHandler(response.data);
            })
            .catch(errorHandler);
    });
}

function postContent(path, data, successHandler, data_to_json=true) {
    checkRefresh(() => {
        const parsed = data_to_json ? JSON.stringify(data) : data;
        axios.post(REACT_APP_API_URL + path, parsed,  {headers: getHeader(true)})
            .then((response) => {
                successHandler(response.data);
            })
            .catch(errorHandler);
    });
}

function deleteContent(path, successHandler) {
    checkRefresh(() => {
        axios.delete(REACT_APP_API_URL + path, {headers:getHeader(true)})
            .then((response) => {
                successHandler(response.data);
            })
            .catch(errorHandler);
    });
}

export {getContents, putContent, postContent, deleteContent}