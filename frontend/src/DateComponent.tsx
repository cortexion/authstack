import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    DialogActions,
    TextField
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
    const navigate = useNavigate();
    const { user, dates, selectedDateObject, setSelectedDateObject, updateDateObject } = useAuthContext();
    const date = location.state?.date || 'Date not available';
    const [removedConsumables, setRemovedConsumables] = useState<Consumable[]>([]);
    const [editedConsumables, setEditedConsumables] = useState<Consumable[]>([]);
    const consumables = selectedDateObject?.consumables || [];

    const pathSegments = location.pathname.split('/');
    const dateSegment = pathSegments[pathSegments.length - 1];

    const [modalOpen, setModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [isSavingAfterRemoving, setIsSavingAfterRemoving] = useState(false);

    useEffect(() => {
        if (!user) {
            const timeoutId = setTimeout(() => {
                navigate("/");
            }, 3000);

            return () => clearTimeout(timeoutId);
        }
    }, [user, navigate]);

    useEffect(() => {
        const foundDate = dates.find((item: any) => item.date === dateSegment);
        if (foundDate) {
            setSelectedDateObject({ ...selectedDateObject, consumables: foundDate.consumables });
            setEditedConsumables(foundDate.consumables);
        }
    }, [dateSegment, dates]);

    const handleOpenModal = (item: any) => {
        setItemToRemove(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setItemToRemove(null);
    };

    const handleConfirmRemove = async () => {
        setEditMode(false);
        if (itemToRemove) {
            const updatedConsumables = editedConsumables.filter((consumable: Consumable) => consumable.id !== itemToRemove.id);
            const response = await updateDateObject(dateSegment, updatedConsumables);
            if (response.success) {
                setRemovedConsumables([...removedConsumables, itemToRemove]);
                setEditedConsumables(updatedConsumables);
                handleCloseModal();
                setTimeout(() => {
                    setEditMode(true);
                }, 50);
            } else {
                alert(`Error with removing: ${response.message}`);
            }
        }
    };

    const handleInputChange = (id: number, field: keyof Consumable, value: any) => {
        setEditedConsumables(prevConsumables =>
            prevConsumables.map(consumable =>
                consumable.id === id ? { ...consumable, [field]: value } : consumable
            )
        );
    };

    const handleSaveChanges = async () => {
        const response = await updateDateObject(dateSegment, editedConsumables);
        if (response.success) {
            setSelectedDateObject({ ...selectedDateObject, consumables: editedConsumables });
            setEditMode(false);
            alert("Changes saved successfully!");
        } else {
            alert(`Error with saving changes: ${response.message}`);
        }
    };

    const handleToggleEditMode = () => {
        setEditMode(!editMode);
    };

    const hasChanges = JSON.stringify(consumables) !== JSON.stringify(editedConsumables);

    let totalWeekEnergyKcal = 0;
    let totalWeekProtein = 0;
    let totalWeekCarb = 0;
    let totalWeekFat = 0;

    editedConsumables.forEach((dayItem: Consumable) => {
        totalWeekEnergyKcal += dayItem.energyKcal;
        totalWeekProtein += dayItem.protein;
        totalWeekCarb += dayItem.carb;
        totalWeekFat += dayItem.fat;
    });

    const pieChartData = [
        { id: 1, value: totalWeekProtein, label: `Protein ${totalWeekProtein.toFixed(2)} g` },
        { id: 2, value: totalWeekCarb, label: `Carbohydrates ${totalWeekCarb.toFixed(2)} g` },
        { id: 3, value: totalWeekFat, label: `Fat ${totalWeekCarb.toFixed(2)} g` },
    ];

    return (
        <Container maxWidth="md" component="main">{JSON.stringify(isSavingAfterRemoving)}
            {!!consumables.length && (
                <div style={{
                    border: '1px solid black',
                    marginTop: '40px',
                    backgroundColor: 'rgb(231, 231, 231)',
                    borderRadius: '5px',
                    padding: '15px',
                    margin: '10px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
                    <Typography variant="h6" style={{ marginTop: '0px' }}>
                        Date: {dayjs(date).format('DD.MM.YYYY')}
                    </Typography>
                    <hr />
                    <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
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
                        />
                    </div>
                </div>
            )}
            <Typography variant="h6" style={{ marginTop: '30px' }}>Consumables:</Typography>
            {!!editedConsumables.length ? (
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {editedConsumables.map((item: Consumable, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Button size="small" variant="outlined" onClick={() => handleOpenModal(item)} disabled={!editMode}>Remove</Button>
                                    </TableCell>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                value={item.name}
                                                onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                                            />
                                        ) : item.name}
                                    </TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                type="number"
                                                value={item.energyKcal}
                                                onChange={(e) => handleInputChange(item.id, 'energyKcal', parseFloat(e.target.value))}
                                            />
                                        ) : item.energyKcal}
                                    </TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                type="number"
                                                value={item.protein}
                                                onChange={(e) => handleInputChange(item.id, 'protein', parseFloat(e.target.value))}
                                            />
                                        ) : item.protein}
                                    </TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                type="number"
                                                value={item.carb}
                                                onChange={(e) => handleInputChange(item.id, 'carb', parseFloat(e.target.value))}
                                            />
                                        ) : item.carb}
                                    </TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                type="number"
                                                value={item.fat}
                                                onChange={(e) => handleInputChange(item.id, 'fat', parseFloat(e.target.value))}
                                            />
                                        ) : item.fat}
                                    </TableCell>
                                    <TableCell>
                                        {editMode ? (
                                            <TextField
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => handleInputChange(item.id, 'amount', parseFloat(e.target.value))}
                                            />
                                        ) : item.amount}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">No consumables available.</Typography>
            )}

            <Button variant="contained" color="secondary" onClick={handleToggleEditMode}>
                {editMode ? 'Disable Editing' : 'Enable Editing'}
            </Button>

            {(editMode && hasChanges) && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    style={{ marginLeft: '10px' }}
                >
                    Save Changes
                </Button>
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
                    <Button onClick={() => {handleConfirmRemove();}} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DateComponent;
