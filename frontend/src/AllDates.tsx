import React, { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
    Container,
    Typography,
    Button,
    Divider,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
  } from '@mui/material';

const AllDates = () => {
    const navigate = useNavigate();
    const { dates, setDates, user } = useAuthContext();
    const [weeks, setWeeks] = useState({});

    const calculateWeeks = useCallback(() => {
        const weeksData: any = {};

        dates?.forEach((consumableDay: any) => {
            const consumableDate = new Date(consumableDay.date);
            const firstDayOfWeek = new Date(consumableDate);
            
            // Adjust the calculation to make Monday the first day of the week
            const day = consumableDate.getDay();
            const diff = (day === 0 ? -6 : 1) - day;  // If Sunday (0), go back 6 days, otherwise go back (day - 1) days
            firstDayOfWeek.setDate(consumableDate.getDate() + diff);
            const firstDayKey = firstDayOfWeek.toISOString().slice(0, 10);
        
            if (!weeksData[firstDayKey]) {
                weeksData[firstDayKey] = { days: [] };
            }
        
            weeksData[firstDayKey].days.push(consumableDay);
        });

        for (const week in weeksData) {
            const days1 = weeksData[week].days;
            let weekTotalEnergy = 0;
        
            days1.forEach((day: any) => {
                const consumables = day.consumables;
                let dayTotalEnergy = 0;
        
                consumables.forEach((item: any) => {
                    dayTotalEnergy += item.energyKcal * item.amount;
                });
        
                day.totalEnergy = dayTotalEnergy;
                weekTotalEnergy += dayTotalEnergy;
            });
        
            const numOfDays = days1.length;
            weeksData[week].totalEnergy = weekTotalEnergy / 100;
            weeksData[week].weightedAverageEnergy = ((weekTotalEnergy / numOfDays) * 7) / 100;
        }

        setWeeks(weeksData);
    }, [dates]);

    useEffect(() => {
        calculateWeeks();
    }, [dates, calculateWeeks]);

    const handleIsExpandedDate = (dateParam: any) => {
        const newWeeks: any = { ...weeks };
        for (const week in newWeeks) {            
            for (const day in newWeeks[week]['days']) {
                if (dateParam === newWeeks[week]['days'][day].date) {
                    newWeeks[week]['days'][day].isExpanded = !newWeeks[week]['days'][day].isExpanded
                }
            }
        }
        setWeeks(newWeeks);
    };

    const handleIsExpandedWeek = (date: any) => {
        const newWeeks: any = { ...weeks };
        for (const week in newWeeks) {
            if (date === week) {
                newWeeks[week].isExpanded = !newWeeks[week].isExpanded;
            }
        }
        setWeeks(newWeeks);
    };

    const seriesData = Object.values(weeks).map((week: any) => week.weightedAverageEnergy);
    const xAxisData = Object.keys(weeks).map(week => week.toUpperCase());

    return (
        <Container maxWidth="md" component="main">
            {user && '↖️ Try adding a new food with that button' }
            <Typography variant="h4" component="h1" gutterBottom>                
                {user ? 'Consumables List' : 'Login first! Just click LOGIN right there ↗️'}
            </Typography>
            {user && <div><div style={{ border: '1px solid black', borderRadius: '5px', padding: '15px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                <b>{weeks && Object.keys(weeks).length} week's totals ({dates.length} days): </b><hr></hr>
                Each week has its weighted average because not all weeks have the same number of days
                <Container component="div" style={{ display: 'contents' }}>
                    <BarChart
                        series={[
                        { data: seriesData },
                        ]}
                        height={290}
                        xAxis={[{ data: xAxisData, scaleType: 'band' }]}
                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    />
                    {/*<PieChart
                        series={[{ data: result }]}
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
                    />*/}
                </Container>
            </div>
            {Object.entries(weeks).reverse().map(([key, { days, isExpanded }]: any, index) => {
                    let totalWeekEnergyKcal = 0;
                    let totalWeekProtein = 0;
                    let totalWeekCarb = 0;
                    let totalWeekFat = 0;

                days.forEach((dayItem: any, index: any) => {
                    const totalEnergyKcal = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.energyKcal * consumable.amount / 100), 0);
                    totalWeekEnergyKcal += totalEnergyKcal;
                    const totalProtein = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.protein * consumable.amount / 100), 0);
                    totalWeekProtein += totalProtein;
                    const totalCarb = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.carb * consumable.amount / 100), 0);
                    totalWeekCarb += totalCarb;
                    const totalFat = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.fat * consumable.amount / 100), 0);
                    totalWeekFat += totalFat;
                })

                let startingDay = key;
                if (index === 0) {
                    startingDay = days[0].date;
                }

                const weekResult = days.map((day: any, index: number) => {
                    const totalEnergyKcal = day.consumables.reduce((total: any, consumable: any) => total + (consumable.energyKcal * consumable.amount / 100), 0);
                    totalWeekEnergyKcal += totalEnergyKcal;
                    return ({
                        id: index,
                        value: totalEnergyKcal,
                        label: dayjs(day.date).format('DD.MM.YYYY'),
                    })
                });

                //console.log('weekResult: ', weekResult)

                const anyValueNotZero = weekResult.some((item: any) => item.value !== 0);
                
                return (
                    <div key={key}>
                    <h3>Week {Object.keys(weeks).length - index} (starting day): {dayjs(startingDay).format('DD.MM.YYYY')}</h3>                    
                    <div style={{ border: '1px solid black', borderRadius: '5px', padding: '15px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                    {anyValueNotZero && <><b>Each day's kcals:</b><hr />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <PieChart
                        series={[{ data: weekResult }]}
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
                    /></div></>                    
                    }
                        <b>Week's totals:</b><hr />
                        {anyValueNotZero ? <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell><b>Energy:</b></TableCell>
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
                        </TableContainer> : <div>No consumables added to this week</div>}
                        <Button onClick={() => { handleIsExpandedWeek(key) }} variant="contained"
                        sx={{
                            padding: '6px 10px', fontSize: '0.85rem', backgroundColor: '#4ba34e', color: 'white',
                            '&:hover': { backgroundColor: '#388e3c' }, marginTop: '10px', borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', textTransform: 'none'
                        }}>
                        {!isExpanded ? `Show days (${days.length}) for this week` : `Hide days for this week`}
                        </Button>
                    </div>
                    {isExpanded && (
                        <div>
                        {days.map((dayItem: any, index: any) => {
                            const totalEnergyKcal = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.energyKcal * consumable.amount / 100), 0);
                            totalWeekEnergyKcal += totalEnergyKcal;
                            const totalProtein = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.protein * consumable.amount / 100), 0);
                            totalWeekProtein += totalProtein;
                            const totalCarb = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.carb * consumable.amount / 100), 0);
                            totalWeekCarb += totalCarb;
                            const totalFat = dayItem.consumables.reduce((total: any, consumable: any) => total + (consumable.fat * consumable.amount / 100), 0);
                            totalWeekFat += totalFat;

                            return (
                            <div key={index} style={{ border: '1px solid black', borderRadius: '5px', padding: '15px', margin: '10px', marginLeft: '50px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                                Date: {dayjs(dayItem.date).format('DD.MM.YYYY')}
                                <div>
                                {!!dayItem.consumables.length && dayItem.isExpanded && (
                                    <div>
                                    <Button
                                        onClick={() => { handleIsExpandedDate(dayItem.date) }}
                                        variant="contained"
                                        sx={{
                                        padding: '6px 10px', fontSize: '0.85rem', backgroundColor: '#4ba34e', color: 'white',
                                        '&:hover': { backgroundColor: '#388e3c' }, marginTop: '10px', borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', textTransform: 'none'
                                        }}>
                                        Click to hide this day's food
                                    </Button>
                                    <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                                        <Table>
                                        <TableHead>
                                            <TableRow>
                                            <TableCell><b>Name</b></TableCell>
                                            <TableCell><b>Kcal</b></TableCell>
                                            <TableCell><b>Protein</b></TableCell>
                                            <TableCell><b>Carbs</b></TableCell>
                                            <TableCell><b>Fat</b></TableCell>
                                            <TableCell><b>Amount (g)</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dayItem.consumables.map((innerConsumable: any, index: any) => {
                                            const energyTotal = (innerConsumable.energyKcal * innerConsumable.amount) / 100;
                                            const proteinTotal = (innerConsumable.protein * innerConsumable.amount) / 100;

                                            return (
                                                <TableRow key={innerConsumable.id}>
                                                <TableCell>{innerConsumable.name}</TableCell>
                                                <TableCell>{energyTotal.toFixed(2)}</TableCell>
                                                <TableCell>{proteinTotal.toFixed(2)}</TableCell>
                                                <TableCell>{innerConsumable.carb}g</TableCell>
                                                <TableCell>{innerConsumable.fat}g</TableCell>
                                                <TableCell>{innerConsumable.amount}g</TableCell>
                                                </TableRow>
                                            );
                                            })}
                                        </TableBody>
                                        </Table>
                                    </TableContainer>
                                    </div>
                                )}
                                {!!dayItem.consumables.length && !dayItem.isExpanded && (
                                    <div>
                                    <Button onClick={() => { handleIsExpandedDate(dayItem.date) }} variant="contained"
                                        sx={{
                                        padding: '6px 10px', fontSize: '0.85rem', backgroundColor: '#4ba34e', color: 'white',
                                        '&:hover': { backgroundColor: '#388e3c' }, marginTop: '10px', borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', textTransform: 'none'
                                        }}>
                                        Click to show this day's food
                                    </Button>
                                    </div>
                                )}
                                {!dayItem.consumables.length && <div>No food added to this date</div>}
                                </div>
                                {!!dayItem.consumables.length && (
                                <div style={{ marginTop: '10px', borderTop: '0px solid gray' }}>
                                    <b>Day's totals:</b><hr />
                                    <TableContainer component={Paper}>
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
                                            <TableCell>{totalEnergyKcal.toFixed(2)} kcal</TableCell>
                                            <TableCell>{totalProtein.toFixed(2)} g</TableCell>
                                            <TableCell>{totalCarb.toFixed(2)} g</TableCell>
                                            <TableCell>{totalFat.toFixed(2)} g</TableCell>
                                        </TableRow>
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                </div>
                                )}
                                <Divider />
                                <Link
                                variant="button"
                                color="text.primary"
                                sx={{ my: 1, mx: 1.5 }}
                                style={{ marginLeft: '0px', cursor: 'pointer' }}
                                onClick={() => { navigate(`/date/${dayItem.date}`, { state: { date: dayItem.date, consumables: dayItem.consumables } }); }}
                                >
                                <Button onClick={() => { handleIsExpandedDate(dayItem.date) }} variant="contained"
                                    sx={{
                                    marginLeft: '0px', padding: '4px 8px', fontSize: '0.85rem', backgroundColor: '#4b6da3', color: 'white',
                                    '&:hover': { backgroundColor: '#384260' }, marginTop: '10px', borderRadius: '10px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', textTransform: 'none'
                                    }}>
                                    Edit day's details
                                </Button>
                                </Link>
                            </div>
                            );
                        })}
                        </div>
                    )}
                    </div>
      )})}
        </div>}</Container>
    );
};

export default AllDates;
