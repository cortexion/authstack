import React from 'react'
import { Navigate, useOutlet } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import TopBar from "./TopBar";

export const HomeLayout = () => {
    const outlet = useOutlet();
    const { user } = useAuthContext();

    return (
        <div>{/*'User: ' + user*/}
            <TopBar />
            {outlet}
        </div>
    );
};