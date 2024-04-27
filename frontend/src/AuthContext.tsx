import React, { useCallback } from 'react'
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<any>({
    movies: [],
    fetchMovies: () => { },
});
export const useAuthContext = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }: any) => {
    const [movies, setMovies] = useState<any[]>([]);

    const fetchMovies = useCallback(async () => {
        try {
            const response = await fetch(`/api/movies/`, {
                method: 'GET',
            });
            const moviesJson = await response.json();
            console.log(moviesJson);
            setMovies(moviesJson);
        } catch (e) {
            console.log('fetchChartData error: ', e);
            throw new Error((e as Error).message);
        } finally {

        }
    }, []);

    useEffect(() => {
        (async () => {
            if (movies.length < 1) {
                //fetchMovies();
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ movies, fetchMovies }}>
            {children}
        </AuthContext.Provider>
    );
};