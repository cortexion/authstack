import React, { useEffect, useState } from 'react';
import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import { useAuthContext } from './AuthContext';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';

const AddNewModal = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const dateSegment = pathSegments[pathSegments.length - 1];
    const initialDate = dayjs(dateSegment, 'YYYY-MM-DD', true).isValid() ? dayjs(dateSegment) : dayjs();
    const [dateValue, setDateValue] = React.useState<Dayjs | null>(initialDate);

    const { addConsumable, consumbales, fetchData } = useAuthContext();
    const [results, setResults] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (dayjs(dateSegment, 'YYYY-MM-DD', true).isValid()) {
          setDateValue(dayjs(dateSegment));
        }
      }, [dateSegment]);

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
        const resultsWithDefaultConsumedAt = data.map((item: any) => {
            return {...item, amount: 100, consumedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss') }
        }
        );
        setResults(resultsWithDefaultConsumedAt);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
    }
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
      };

    const handleAmountInputChange = (event: React.ChangeEvent<HTMLInputElement>, result: any) => {
        const newAmount = event.target.value;
        setResults(prevResults => {
            return prevResults.map(oldResult => 
                oldResult.id === result.id ? { ...oldResult, amount: newAmount } : oldResult
            );
        });
    };

    const handleConsumedAtInputChange = (dateValue: any, result: any) => {
        setResults(prevResults => {
            return prevResults.map(oldResult => 
                oldResult.id === result.id ? { ...oldResult, consumedAt: dateValue.format('YYYY-MM-DDTHH:mm:ss') } : oldResult
            );
        });
    };

    return (
<>
            <Button 
                onClick={handleOpen} 
                variant="contained" 
                color="primary" 
                style={{ margin: '10px' }}
            >
                Add a new consumable (food)
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Paper style={{ 
                    minHeight: '800px', 
                    maxHeight: '800px',
                    minWidth: '800px', 
                    maxWidth: '800px', 
                    overflowY: 'auto', 
                    margin: 'auto', 
                    padding: '40px', 
                    width: 'fit-content', 
                    borderRadius: '10px',
                    backgroundColor: '#f0f0f0',
                    border: '2px solid #3f51b5'
                }}>
                    <Button 
                        onClick={handleClose} 
                        variant="contained" 
                        color="primary" 
                        style={{
                            display: 'flex'
                        }}
                    >
                        Close Modal
                    </Button>
                    <TextField 
                        id="outlined-basic" 
                        label="Search food ('kana' for example)" 
                        variant="outlined" 
                        type="text"
                        placeholder="Search food... like 'kana'"
                        value={query}
                        onChange={handleInputChange}
                        style={{ 
                            width: '500px', 
                            marginTop: '30px', 
                            marginBottom: '20px', 
                            backgroundColor: '#fff' 
                        }}
                    />
                    {results.map((result) => (
                        <div key={result.id} style={{ 
                            border: '1px solid #3f51b5', 
                            borderRadius: '10px', 
                            padding: '20px', 
                            marginBottom: '20px', 
                            backgroundColor: '#fff', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s',
                        }}>
                            <TextField 
                                id="outlined-basic" 
                                label="Amount (grams)" 
                                variant="outlined" 
                                type="text"
                                placeholder="Amount (grams)"
                                value={result.amount}
                                defaultValue={100}
                                onChange={(event: any) => handleAmountInputChange(event, result)}
                                style={{ width: '450px', backgroundColor: '#f9f9f9' }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div style={{ width: '450px', display: 'inline-grid', marginTop: '20px' }}>
                                    <DatePicker
                                        label="Date consumed"
                                        value={dateValue}
                                        onChange={(dateValue) => setDateValue(dateValue)}
                                    />
                                </div>
                            </LocalizationProvider>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                style={{ 
                                    marginTop: '10px', 
                                    backgroundColor: '#3f51b5', 
                                    color: '#fff', 
                                    fontWeight: 'bold',
                                    marginLeft: '10px'
                                }} 
                                onClick={() => addConsumable(dateValue, result)}
                            >
                                Add to tracking
                            </Button>
                            <Typography variant="body1" style={{ margin: '5px 0', fontWeight: 'bold' }}>{result.name.fi}</Typography>
                            <Typography variant="body2" style={{ margin: '5px 0' }}>Energy: {Math.round(result.energyKcal * 100) / 100} Kcal/100g</Typography>
                            <Typography variant="body2" style={{ margin: '5px 0' }}>Fat: {Math.round(result.fat * 100) / 100} g/100g</Typography>
                            <Typography variant="body2" style={{ margin: '5px 0' }}>Carb: {Math.round(result.carbohydrate * 100) / 100} g/100g</Typography>
                            <Typography variant="body2" style={{ margin: '5px 0' }}>Protein: {Math.round(result.protein * 100) / 100} g/100g</Typography>
                        </div>
                    ))}
                </Paper>
            </Modal>
        </>
    );
};

export default AddNewModal;
