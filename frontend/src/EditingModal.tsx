import React, { useEffect, useState } from 'react';
import { Button, Modal, Paper, TextField, Typography } from '@mui/material';
import { useAuthContext } from './AuthContext';
import { ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';

interface Consumable {
    id: string;
    name: string;
    amount: number;
    energyKcal: number;
    fat: number;
    carb: number;
    protein: number;
}

const EditingModal: React.FC = () => {
    const location = useLocation();
    const { selectedDateObject, updateDateObject } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [consumables, setConsumables] = useState<Consumable[]>(selectedDateObject?.consumables || []);
    const [initialConsumables, setInitialConsumables] = useState<Consumable[]>(selectedDateObject?.consumables || []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (hasChanges()) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                setOpen(false);
            }
        } else {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (selectedDateObject) {
            setConsumables(selectedDateObject?.consumables);
            setInitialConsumables(selectedDateObject?.consumables);
        }
    }, [selectedDateObject]);

    const handleInputChange = (id: string, field: keyof Consumable, value: any) => {
        setConsumables(prevConsumables => 
            prevConsumables.map(consumable => 
                consumable.id === id ? { ...consumable, [field]: value } : consumable
            )
        );
    };

    const hasChanges = () => {
        return JSON.stringify(consumables) !== JSON.stringify(initialConsumables);
    };

    const pathSegments = location.pathname.split('/');
    const dateSegment = pathSegments[pathSegments.length - 1];

    const handleSubmit = async () => {
        const response = await updateDateObject(dateSegment, consumables);
        if (response.success) {
            setInitialConsumables(consumables);
            handleClose();
        } else {
            alert(`Error with removing: ${response.message}`);
        }     
    };

    return (
        <>
            {/*!!consumables.length && <Button 
                onClick={handleOpen} 
                variant="contained" 
                color="primary"
                style={{ }}
            >
                Edit Date
            </Button>*/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Paper style={{ 
                    minHeight: '800px', 
                    maxHeight: '800px', 
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
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary" 
                        style={{ 
                            marginBottom: '20px',
                            color: '#fff',
                        }}
                        disabled={!hasChanges()}
                    >
                        Save changes
                    </Button>
                    {consumables.map((consumable) => (
                        <div key={consumable.id} style={{ 
                            border: '1px solid #3f51b5', 
                            borderRadius: '10px', 
                            padding: '20px', 
                            marginBottom: '20px', 
                            backgroundColor: '#fff', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s',
                        }}>
                            <Typography variant="h6" style={{ 
                                marginBottom: '10px', 
                                color: '#3f51b5', 
                                fontWeight: 'bold'
                            }}>
                                {consumable.name}
                            </Typography>
                            <TextField
                                label="Amount (grams)"
                                type="number"
                                value={consumable.amount}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(consumable.id, 'amount', parseFloat(e.target.value))}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                            <TextField
                                label="Energy (Kcal/100g)"
                                type="number"
                                value={consumable.energyKcal}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(consumable.id, 'energyKcal', parseFloat(e.target.value))}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                            <TextField
                                label="Fat (g/100g)"
                                type="number"
                                value={consumable.fat}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(consumable.id, 'fat', parseFloat(e.target.value))}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                            <TextField
                                label="Carbohydrate (g/100g)"
                                type="number"
                                value={consumable.carb}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(consumable.id, 'carb', parseFloat(e.target.value))}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                            <TextField
                                label="Protein (g/100g)"
                                type="number"
                                value={consumable.protein}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(consumable.id, 'protein', parseFloat(e.target.value))}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </div>
                    ))}                    
                </Paper>
            </Modal>
        </>
    );
};

export default EditingModal;
