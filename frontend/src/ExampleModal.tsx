import React, { useEffect, useState } from 'react';
import { Button, Modal, Paper, TextField } from '@mui/material';
import { useAuthContext } from './AuthContext';
//https://mui.com/x/react-date-pickers/date-picker/
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ExampleModal = () => {
    const [dateValue, setDateValue] = React.useState<Dayjs | null>(dayjs());
    const { addConsumable, consumbales, fetchData } = useAuthContext();
    const [results, setResults] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [query, setQuery] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility    

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
            <Button onClick={handleOpen} variant="contained">Open Modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Paper style={{ minHeight: '800px', maxHeight: '800px', overflowY: 'auto', padding: '20px', margin: 'auto', width: 'fit-content' }}>
                <Button onClick={handleClose} variant="contained" style={{ display: 'flex'}}>Close Modal</Button>
                <TextField id="outlined-basic" label="Search food" variant="outlined" type="text"
                placeholder="Search food..."
                value={query}
                onChange={handleInputChange}
                style={{ width: '500px', marginTop: '50px', marginBottom: '20px' }}
            />
                    {results.map((result) => (
                        <div key={result.id} style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginBottom: '5px' }}>
                            <TextField id="outlined-basic" label="Amount (grams)" variant="outlined" type="text"
                                placeholder="Amount (grams)"
                                value={result.amount}
                                defaultValue={100}
                                onChange={(event: any) => handleAmountInputChange(event, result)}
                                style={{ width: '450px' }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                    <div style={{ width: '450px', display: 'inline-grid'}}><DatePicker
                        label="Date consumed"
                        value={dateValue}
                        onChange={(dateValue) => handleConsumedAtInputChange(dateValue, result)}
                    /></div>
                    </DemoContainer>
                    </LocalizationProvider>
                            <Button size="small" variant="outlined" style={{ marginTop: '5px' }} onClick={() => addConsumable(result)}>Add to tracking</Button>
                            <p style={{ margin: '0px' }}>{result.name.fi}</p>
                            <p style={{ margin: '0px' }}>Energy: {Math.round(result.energyKcal * 100) / 100} Kcal/100g</p>
                            <p style={{ margin: '0px' }}>Fat: {Math.round(result.fat * 100) / 100} g/100g</p>
                            <p style={{ margin: '0px' }}>Carb: {Math.round(result.carbohydrate * 100) / 100} g/100g</p>
                            <p style={{ margin: '0px' }}>Protein: {Math.round(result.protein * 100) / 100} g/100g</p>
                        </div>
                    ))}
                </Paper>
            </Modal>
        </>
    );
};

export default ExampleModal;
