import React, { useMemo } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { CardContent, TextField, Typography } from '@mui/material';

const AllMovies = () => {
    const { movies, fetchMovies } = useAuthContext();
    const [filterTerm, setFilterTerm] = useState<string>("");

    function filterMoviesByTerm(movies: any, term: any) {
        return movies.filter((movie: any) =>
            movie.name.toLowerCase().includes(term) || String(movie.year).toLowerCase().includes(term)
        );
    }

    const filteredMovies = useMemo(() => {
        if (filterTerm !== "") {
            let filteredMovies = movies;
            filteredMovies = filterMoviesByTerm(filteredMovies, filterTerm);
            return filteredMovies;
        } else {
            return movies;
        }
    }, [filterTerm, movies]);

    const handleFilter = (e: any) => {
        setFilterTerm(e.target.value);
    };

    return <Container maxWidth="md" component="main">
        <Card>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                style={{ padding: '30px' }}
            >
                <h4>Movies list:</h4>
                <TextField id="outlined-basic" label="Filter movies" variant="outlined" type="text"
                    name="term"
                    className="form-input"
                    placeholder="Type in movie name or release year"
                    value={filterTerm || ""}
                    style={{ width: '500px' }}
                    onChange={handleFilter} />
                <br></br>
                {filteredMovies.map((movie: any) => (
                    <Card variant="outlined" style={{ width: '100%' }}>
                        <React.Fragment>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {movie.genres.join(", ")}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {movie.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {movie.year}
                                </Typography>
                                <Typography variant="body2">
                                    {movie.synopsis}
                                </Typography>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                ))}
            </Box>
        </Card>
    </Container>
};

export default AllMovies;