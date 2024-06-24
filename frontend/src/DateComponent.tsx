import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useAuthContext } from './AuthContext';

const DateComponent = () => {
    const location = useLocation();
    const { dates, selectedDateObject, setSelectedDateObject, updateDateObject } = useAuthContext();
    const date = location.state?.date || 'Date not available';
    const [removedConsumables, setRemovedConsumables] = useState<any[]>([]);
    const [isEdited, setIsEdited] = useState(false);
    const consumables = selectedDateObject?.consumables || [];
    
    const pathSegments = location.pathname.split('/');
    const dateSegment = pathSegments[pathSegments.length - 1];

    const [modalOpen, setModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<any>(null);

    useEffect(() => {
        if (!isEdited) {
            const foundDate = dates.find((item: any) => item.date === dateSegment);
            if (foundDate) {
                setSelectedDateObject({...selectedDateObject, consumables: foundDate.consumables});
            } 
        }       
    }, [isEdited, dateSegment, dates]);

    const handleOpenModal = (item: any) => {
        setItemToRemove(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setItemToRemove(null);
    };

    const handleConfirmRemove = async () => {
        if (itemToRemove) {
            const currentConsumables = selectedDateObject.consumables;
            const updatedConsumables = currentConsumables.filter((consumable: any) => consumable.id !== itemToRemove.id);
            setIsEdited(true);
            setRemovedConsumables([...removedConsumables, itemToRemove]);
    
            const success = await updateDateObject(dateSegment, updatedConsumables);
            if (success) {
                setSelectedDateObject({...selectedDateObject, consumables: updatedConsumables});
            }
            handleCloseModal();
        }
    };

    return (
        <Container maxWidth="md" component="main">
            {JSON.stringify(selectedDateObject)}
            <div style={{border: '1px solid black', backgroundColor: 'rgb(231, 231, 231)', borderRadius: '5px', padding: '15px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                <b>4 week's totals:</b><hr></hr>
                <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                <Table>
                    <TableHead>
                    <TableRow >
                        <TableCell><b>Energy</b></TableCell>
                        <TableCell><b>Protein</b></TableCell>
                        <TableCell><b>Carb</b></TableCell>
                        <TableCell><b>Fat</b></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    <TableRow>
                        <TableCell>{3542} kcal</TableCell>
                        <TableCell>{223} g</TableCell>
                        <TableCell>{223} g</TableCell>
                        <TableCell>{223} g</TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </div>

            <Typography variant="h4" gutterBottom>Date Component</Typography>
            <Typography variant="h6">Date: {date}</Typography>
            <Typography variant="h6" gutterBottom>Consumables:</Typography>
            {consumables && consumables.length > 0 ? (
            <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>EnergyKcal</TableCell>
                            <TableCell>Protein</TableCell>
                            <TableCell>Carb</TableCell>
                            <TableCell>Fat</TableCell>
                            <TableCell>Amount</TableCell>
                            {/*<TableCell>Consumed At</TableCell>*/}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consumables.map((item: any, index: any) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Button size="small" variant="outlined" onClick={() => handleOpenModal(item)}>Remove</Button>
                                </TableCell>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.energyKcal}</TableCell>
                                <TableCell>{item.protein}</TableCell>
                                <TableCell>{item.carb}</TableCell>
                                <TableCell>{item.fat}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                {/*<TableCell>{item.consumedAt}</TableCell>*/}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Typography variant="body1">No consumables available.</Typography>
        )}

        <Dialog open={modalOpen} onClose={handleCloseModal}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirmRemove} color="primary" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        </Container>
    );
};

export default DateComponent;
