import React from 'react'
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';

const TopBar = () => {
    let navigate = useNavigate();

    return <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
            <Toolbar sx={{ flexWrap: 'wrap' }}>
                <Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }} style={{ cursor: 'pointer', color: 'orange', fontWeight: 'bold' }} onClick={() => { navigate("/"); }}>
                    My Movies
                </Typography>
                <nav>
                    <Link
                        variant="button"
                        color="text.primary"
                        sx={{ my: 1, mx: 1.5 }}
                        style={{ cursor: 'pointer' }}
                        onClick={() => { navigate("/"); }}
                    >
                        All movies
                    </Link>
                    <Link
                        variant="button"
                        color="text.primary"
                        sx={{ my: 1, mx: 1.5 }}
                        style={{ cursor: 'pointer' }}
                        onClick={() => { navigate("/addnew"); }}
                    >
                        Add new
                    </Link>
                </nav>
            </Toolbar>
        </AppBar>
    </React.Fragment>
};

export default TopBar;