import request from '../utils/request'

export const getSign = (data) => {
    return request({
        url: 'users/wallet',
        method: 'POST',
        data
    })
}

export const authWallet = (data) => {
    return request({
        url: 'auth/wallet',
        method: 'POST',
        data
    })
}

export const getShipsOrMe = (params) => {
    return request({
        headers: {
            isToken: true
        },
        url: 'ships/me',
        params
    })
}
export const startXunlian = (id) => {
    return request({
        headers: {
            isToken: true
        },
        url: 'ships/racing/' + id,

    })
}

// 加油
export const addOil = () => {
    return request({
        headers: {
            isToken: true
        },
        url: 'ships/refuel',

    })
}
