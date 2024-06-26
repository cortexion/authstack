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
import { PieChart } from '@mui/x-charts/PieChart';
import { useAuthContext } from './AuthContext';
import dayjs from 'dayjs';

interface Consumable {
    id: number;
    name: string;
    energyKcal: number;
    protein: number;
    carb: number;
    fat: number;
    amount: number;
}

const DateComponent = () => {
    const location = useLocation();
    const { dates, selectedDateObject, setSelectedDateObject, updateDateObject } = useAuthContext();
    const date = location.state?.date || 'Date not available';
    const [removedConsumables, setRemovedConsumables] = useState<Consumable[]>([]);
    const [isEdited, setIsEdited] = useState(false);
    const consumables = selectedDateObject?.consumables || [];
    
    const pathSegments = location.pathname.split('/');
    const dateSegment = pathSegments[pathSegments.length - 1];

    const [modalOpen, setModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<any>(null);

    useEffect(() => {
        const foundDate = dates.find((item: any) => item.date === dateSegment);
        if (foundDate) {
            setSelectedDateObject({...selectedDateObject, consumables: foundDate.consumables});
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
            const updatedConsumables = currentConsumables.filter((consumable: Consumable) => consumable.id !== itemToRemove.id);
            //setIsEdited(true);    
            const response = await updateDateObject(dateSegment, updatedConsumables);
            if (response.success) {
                //console.log('success');
                setRemovedConsumables([...removedConsumables, itemToRemove]);
                handleCloseModal();
            } else {
                alert(`Error with removing: ${response.message}`);
            }            
        }
    };

    let totalWeekEnergyKcal = 0;
    let totalWeekProtein = 0;
    let totalWeekCarb = 0;
    let totalWeekFat = 0;

    consumables.forEach((dayItem: any, index: any) => {
        totalWeekEnergyKcal = totalWeekEnergyKcal + dayItem.energyKcal;
        totalWeekProtein = totalWeekProtein + dayItem.protein;
        totalWeekCarb = totalWeekCarb + dayItem.carb;
        totalWeekFat = totalWeekFat + dayItem.fat;
    });

    const pieChartData = [
        //{ id: 0, value: totalWeekEnergyKcal, label: `Energy ${totalWeekEnergyKcal } kcal`},
        { id: 1, value: totalWeekProtein, label: `Protein ${totalWeekProtein.toFixed(2) } g`},
        { id: 2, value: totalWeekCarb, label: `Carbohydrates ${totalWeekCarb.toFixed(2) } g`},
        { id: 3, value: totalWeekFat, label: `Fat ${totalWeekCarb.toFixed(2) } g`},
      ];

    return (
        <Container maxWidth="md" component="main">
            <Typography variant="h5" style={{marginTop: '20px'}}>Date: {dayjs(date).format('DD.MM.YYYY')}</Typography>
            {/*JSON.stringify(selectedDateObject)*/}
            {!!consumables.length && <div style={{border: '1px solid black', backgroundColor: 'rgb(231, 231, 231)', borderRadius: '5px', padding: '15px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
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
                        <TableCell>{totalWeekEnergyKcal.toFixed(2)} kcal</TableCell>
                        <TableCell>{totalWeekProtein.toFixed(2)} g</TableCell>
                        <TableCell>{totalWeekCarb.toFixed(2)} g</TableCell>
                        <TableCell>{totalWeekFat.toFixed(2)} g</TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <PieChart
                            series={[{ data: pieChartData }]}
                            width={500}
                            height={300}
                            margin={{ left: 0, right: 0, top: 10, bottom: 110 }}
                            slotProps={{
                                legend: {
                                    labelStyle: {
                                        tableLayout: 'fixed',
                                    },
                                    direction: 'row',
                                    position: {
                                        horizontal: 'middle',
                                        vertical: 'bottom',
                                    },
                                },
                            }}
                            sx={{}}
                        />
                    </div>
            </div>}            
            <Typography variant="h6">Consumables:</Typography>
            {!!consumables.length ? (
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
                        {consumables.map((item: Consumable, index: number) => (
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
