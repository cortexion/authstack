import React, { useMemo } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { CardContent, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const AllMovies = () => {
    const { addConsumable, consumbales, fetchData } = useAuthContext();
    const [filterTerm, setFilterTerm] = useState<string>("");

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    return <Container maxWidth="md" component="main">
    <Typography variant="h4" component="h1" gutterBottom>
      Consumables List
    </Typography>
    <List>
      {consumbales.map((date: any) => (
        <div key={date.date}>
          <ListItem>
            <ListItemText
              primary={date.date}
              secondary={date.consumables.length > 0 ? (
                <List>
                  {date.consumables.map((consumable: any) => (
                    <ListItem key={consumable.id}>
                      <ListItemText
                        primary={consumable.name}
                        secondary={`Protein: ${consumable.protein}, Carbs: ${consumable.carb}, Fat: ${consumable.fat}, Amount: ${consumable.amount}, Date: ${consumable.consumedAt}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : 'No consumables'}
            />
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  </Container>
};

export default AllMovies;