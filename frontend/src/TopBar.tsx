import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useAuthContext } from './AuthContext';
import { Modal, Paper, TextField, Typography } from '@mui/material';
import AddNewModal from './AddNewModal';
import EditingModal from './EditingModal';


const TopBar = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const { user, login, logout } = useAuthContext();
    
    const [username, setUsername] = React.useState("testerman");
    const [password, setPassword] = React.useState("testerman");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showSignup, setShowSignup] = useState(false);
    
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
                    My food diary
                </Typography>
                <nav>
                    <TextField disabled={user && true} size="small" id="username" label="Username" variant="outlined" type='text' value={username} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setUsername(ev.target.value)} required />
                    <TextField disabled={user && true} size="small" id="password" label="Password" variant="outlined" type='text' value={password} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setPassword(ev.target.value)} required />
                    <Button disabled={user && true} style={{ marginLeft: '5px' }} size="small" variant="outlined" onClick={async () => { login(username, password); }}>Login</Button>
                    <Button disabled={!user && true} style={{ marginLeft: '5px' }} size="small" variant="outlined" onClick={async () => { logout(); }}>Logout</Button>
                    {/*<Button style={{ marginLeft: '5px' }} size="small" variant="outlined" onClick={async () => { setShowSignup(!showSignup); }}>{!showSignup ? 'Show signup' : 'Hide signup'}</Button>*/}
                    {showSignup && <div style={{ marginTop: '10px' }}>                        
                        <TextField size="small" id="username" label="Username" variant="outlined" type='text' value={username} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setUsername(ev.target.value)} required />
                        <TextField size="small" id="password" label="Password" variant="outlined" type='text' value={password} onChange={(ev: { target: { value: React.SetStateAction<string>; }; }) => setPassword(ev.target.value)} required />
                        <Button style={{ marginLeft: '5px' }} size="small" variant="outlined" onClick={async () => { login(username, password); }}>Signup</Button>
                    </div>}
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
                <AddNewModal />{location.state ? <div style={{ display: 'inline', marginLeft: '5px' }}><EditingModal /></div> : null}            
                </nav>
            </Toolbar>
        </AppBar>
    </React.Fragment>
};

export default TopBar;
