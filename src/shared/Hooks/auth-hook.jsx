import {useState,useCallback,useEffect} from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({ userIdc: uid, token: token, expiration: tokenExpirationDate.toISOString() }));
    }, []);

    const logout = useCallback((uid) => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData')
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainigTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainigTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate])


    useEffect(() => {
        const storeData = JSON.parse(localStorage.getItem('userData'));
        if (storeData && storeData.token && new Date(storeData.expiration) > new Date()) {
            login(storeData.userId, storeData.token, new Date(storeData.expiration))
        }
    }, [login]);
    return {token,login,logout,userId}
};
