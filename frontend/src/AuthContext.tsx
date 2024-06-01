import React, { useCallback } from 'react'
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<any>({
    user: null,
    consumbales: [],
    addConsumable: () => { },
    login: () => { },
    logout: () => { },
});
export const useAuthContext = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);
    const [consumbales, setConsumables] = useState<any[]>([]);

    const doHealthCheck = useCallback(async (authJwt: string) => {
        console.log('doHealthCheck')
        console.log(authJwt)
        try {
            const response = await fetch(`/api/auth/healthCheck`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authJwt}`
                }
            });
            if (response.status === 401) {
                const errorText = await response.text();
                alert("Error: " + errorText);
                setUser(null);
                localStorage.removeItem('authjwt');
            } else {
                const userJson = await response.json();
                setUser(userJson.accessToken);
            }                
        } catch (e) {
            console.log('checkHealth error: ', e);
            setUser(null);
            throw new Error((e as Error).message);
        }
    }, []);

    const addConsumable = useCallback(async (result: any) => {
        console.log('addConsumable: ')
        console.log(result)
        //take result and do body: JSON.stringify({ ...result } etc
        try {
            const response = await fetch(`/api/test/consumables/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}`
                },
                body: JSON.stringify({
                    name: result.name.fi,
                    protein: 100.00,
                    carb: 20.00,
                    fat: 23.00,
                    amount: parseFloat(result.amount),
                    consumedAt: result.consumedAt
                })
            });
            const userJson = await response.json();
            
        } catch (e) {
            console.log('checkHealth error: ', e);
            throw new Error((e as Error).message);
        }
    }, [user]);

    const getConsumables = useCallback(async (authJwt: string) => {
        console.log('getConsumables')
        console.log(authJwt)
        try {
            const response = await fetch(`/api/test/consumables`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authJwt}`
                }
            });
            const consumablesJson = await response.json();
            console.log('getConsumables: ', consumablesJson);
            setConsumables(consumablesJson);
        } catch (e) {
            console.log('checkHealth error: ', e);
            setUser(null);
            throw new Error((e as Error).message);
        }
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        console.log('login')
        console.log(username)
        console.log(password)
        try {
            const response = await fetch(`/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const userJson = await response.json();
            setUser(userJson.accessToken);
            localStorage.setItem('authjwt', userJson.accessToken);
        } catch (e) {
            console.log('checkHealth error: ', e);
            setUser(null);
            //localStorage.removeItem('authjwt');
            throw new Error((e as Error).message);
        }
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        localStorage.removeItem('authjwt');
    }, []);

    useEffect(() => {
        (async () => {
            //localStorage.setItem('authjwt', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZXJtYW4iLCJpYXQiOjE3MTQ1NjY2NzcsImV4cCI6MTcxNDY1MzA3N30.LMotSNYd9kV1AjFJMsbO-ERTA1YbEGZL4_DcahmIob4');
            const authJwt = localStorage.getItem('authjwt');
            //console.log('authJwt is: ', authJwt);
            if (authJwt) {
                console.log('authJwt is: ', authJwt);
                setUser(authJwt);
                doHealthCheck(authJwt);
                getConsumables(authJwt);
            } else {
                setUser(null);
                //localStorage.removeItem('authjwt');
            }
            if (consumbales.length < 1) {
                //fetchMovies();
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ consumbales, addConsumable, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};