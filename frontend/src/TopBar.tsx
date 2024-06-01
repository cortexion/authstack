import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useAuthContext } from './AuthContext';
import { Modal, Paper, TextField, Typography } from '@mui/material';
import ExampleModal from './ExampleModal'; // Import the modal component

const TopBar = () => {
    let navigate = useNavigate();
    const { login, logout } = useAuthContext();
    
    const [username, setUsername] = React.useState("testerman");
    const [password, setPassword] = React.useState("testerman");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
          if (query.length > 0) {
            fetchResults(query);
          } else {
            setResults([]);
            setLoading(false);
          }
        }, 500);
    
        return () => {
          clearTimeout(debounceTimer);
        };
      }, [query]);

    const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
        const response = await fetch(
        `https://fineli.fi/fineli/api/v1/foods?q=${searchQuery}`
        );
        const data = await response.json();
        setResults(data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
    }
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
      };

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
                    <TextField size="small" id="username" label="Username" variant="outlined" type='text' value={username} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setUsername(ev.target.value)} required />
                    <TextField size="small" id="password" label="Password" variant="outlined" type='text' value={password} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setPassword(ev.target.value)} required />
                    <Button size="small" variant="outlined" onClick={async () => { login(username, password); }}>Login</Button>
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
                    <Button size="small" variant="outlined" onClick={async () => { logout(); }}>Logout</Button>
                </nav>
            </Toolbar>
        </AppBar>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
            <Toolbar sx={{ flexWrap: 'wrap' }}>
                <nav>
            <ExampleModal />
                </nav>
            </Toolbar>
        </AppBar>
    </React.Fragment>
};

export default TopBar;
