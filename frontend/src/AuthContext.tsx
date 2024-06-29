import React, { useCallback } from 'react'
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext<any>({
    user: null,
    selectedDateObject: null,
    dates: [],
    addConsumable: () => { },
    login: () => { },
    logout: () => { },
});
export const useAuthContext = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }: any) => {
    let navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [selectedDateObject, setSelectedDateObject] = useState<any>(null);
    const [dates, setDates] = useState<any[]>([]);

    const doHealthCheck = useCallback(async (authJwt: string) => {
        //console.log('doHealthCheck')
        //console.log(authJwt)
        try {
            const response = await fetch(`/api/auth/healthCheck`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authJwt}`
                }
            });
            if (response.status === 401) {
                const errorText = await response.text();
                //alert("Error: " + errorText);
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

    const getConsumables = useCallback(async (authJwt: string) => {
        try {
            const response = await fetch(`/api/manage/consumables`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authJwt}`
                }
            });
            if (response.status === 200) {
                const datesJson = await response.json();
                //console.log('getConsumables: ', consumablesJson);
                const newDates = datesJson?.map((date: any) => {
                    date.isExpanded = false;
                    return date;
                })
                setDates(newDates);
            } else {
                console.error('Auth error! Please login...');
            }
        } catch (e) {
            console.log('checkHealth error: ', e);
            setUser(null);
            throw new Error((e as Error).message);
        }
    }, []);

    const addConsumable = useCallback(async (dateValue: any, result: any) => {
        //console.log('addConsumable: ')
        //console.log(result)
        try {
            const response = await fetch(`/api/manage/consumables/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}`
                },
                body: JSON.stringify({
                    name: result.name.fi,
                    energyKcal: parseFloat(result.energyKcal).toFixed(2),
                    protein: parseFloat(result.protein).toFixed(2),
                    carb: parseFloat(result.carbohydrate).toFixed(2),
                    fat: parseFloat(result.fat).toFixed(2),
                    amount: parseFloat(result.amount).toFixed(2),
                    consumedAt: dateValue.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                })
            });
            const userJson = await response.json();
            if (!response.ok) {
                throw new Error(userJson.message || 'Network response was not ok');
            }
            getConsumables(user);
            return { success: true };
        } catch (e) {
            console.log('addConsumable error: ', e);
            return { success: false, message: (e as Error).message };
        }
    }, [user]);

    const updateDateObject = useCallback(async (date: string, updatedDateObject: any) => {
        try {
            const response = await fetch(`/api/manage/consumables/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}`
                },
                body: JSON.stringify({ date, consumables: updatedDateObject }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const userJson = await response.json();
            getConsumables(user);
            return { success: true };
        } catch (e) {
            console.log('checkHealth error: ', e);
            return false;
        }
    }, [user]);

    const login = useCallback(async (username: string, password: string) => {        
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
            setDates([]);
            getConsumables(userJson.accessToken);
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
        setDates([]);
        navigate(`/`);
    }, []);

    const signUp = useCallback(async (username: string, password: string) => {
        setDates([]);
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
            getConsumables(userJson.accessToken);
        } catch (e) {
            console.log('checkHealth error: ', e);
            setUser(null);
            //localStorage.removeItem('authjwt');
            throw new Error((e as Error).message);
        }
    }, []);

    useEffect(() => {
        (async () => {
            //localStorage.setItem('authjwt', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZXJtYW4iLCJpYXQiOjE3MTQ1NjY2NzcsImV4cCI6MTcxNDY1MzA3N30.LMotSNYd9kV1AjFJMsbO-ERTA1YbEGZL4_DcahmIob4');
            const authJwt = localStorage.getItem('authjwt');
            //console.log('authJwt is: ', authJwt);
            if (authJwt) {
                //console.log('authJwt is: ', authJwt);
                setUser(authJwt);
                doHealthCheck(authJwt);
                getConsumables(authJwt);
            } else {
                setUser(null);
                //localStorage.removeItem('authjwt');
            }
            if (dates.length < 1) {
                //fetchMovies();
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ dates, setDates, addConsumable, user, login, logout, selectedDateObject, setSelectedDateObject, updateDateObject }}>
            {children}
        </AuthContext.Provider>
    );
};