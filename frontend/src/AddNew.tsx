import React from 'react'
import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function getBlankItem(): any {
    return { firstname: "", lastname: "" };
}

const ItemRow = ({
    item,
    idx,
    onClickRemoveItem,
    onChangeItemRowField
}: any) => (
    <div key={`cat-${idx}`} style={{ display: 'inline-flex', width: '100%' }}>
        <h5>{`Actor #${idx + 1}`}</h5>
        <div style={{ marginLeft: "15px" }}>
            <input
                style={{ maxHeight: "35px", maxWidth: "300px", padding: '20px' }}
                placeholder="Actor's firstname"
                type="text"
                required={true}
                name="firstname"
                data-itemid={idx}
                onChange={onChangeItemRowField}
                value={item.firstname}
            />
        </div>
        <div style={{ marginLeft: "15px" }}>
            <input
                style={{ maxHeight: "35px", maxWidth: "300px", padding: '20px' }}
                placeholder="Actor's lastname"
                type="text"
                required={true}
                name="lastname"
                data-itemid={idx}
                onChange={onChangeItemRowField}
                value={item.lastname}
            />
        </div>
        <div className="form-group col-xs-3" style={{ marginLeft: "15px" }}>
            <Button
                variant="outlined" color="error"
                data-itemid={idx}
                onClick={onClickRemoveItem}
            >
                Remove actor
            </Button>
        </div>
    </div>
);

const AddNew = () => {
    const { fetchMovies } = useAuthContext();
    const [name, setName] = React.useState("");
    const [synopsis, setSynopsis] = React.useState("");
    const [actors, setActors] = React.useState<any[]>([]);
    const [genres, setGenres] = React.useState<string[]>([]);
    const [director, setDirector] = useState<any>(() => {
        return {
            firstname: '',
            lastname: '',
        };
    });
    const [genre, setGenre] = React.useState<string>('');
    const [year, setYear] = React.useState<number>(0);
    const [ageLimit, setageLimit] = React.useState<number>(0);
    const [rating, setRating] = React.useState<number>(0);
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "synopsis":
                setSynopsis(value);
                break;
        }
    };
    const handleDirectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newDirector = { ...director };
        switch (name) {
            case "firstname":
                newDirector.firstname = value;
                setDirector(newDirector);
                break;
            case "lastname":
                newDirector.lastname = value;
                setDirector(newDirector);
                break;
        }
    };
    const addGenre = () => {
        setGenre('');
        setGenres([...genres, genre]);
    };
    const addBlankActor = () => setActors([...actors, getBlankItem()]);
    const removeItemByIndex = (index: number) => {
        const newItems = [...actors];
        newItems.splice(index, 1);
        setActors(newItems);
    };
    const mutateItemAtIndex = (
        index: number,
        field: keyof any,
        value: string
    ) => {
        const newActors = [...actors];
        newActors[index] = { ...actors[index], [field]: value };
        setActors(newActors);
    };
    const onClickRemoveItem = (e: any) => {
        const itemIndex = parseInt(e.target.dataset.itemid || "", 10);
        if (!Number.isNaN(itemIndex)) {
            removeItemByIndex(itemIndex);
        }
        e.preventDefault();
    };
    const onChangeItemRowField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const itemIndex = parseInt(e.target.dataset.itemid || "", 10);
        if (!Number.isNaN(itemIndex)) {
            const { name, value } = e.target;
            switch (name) {
                case "firstname":
                case "lastname":
                    mutateItemAtIndex(itemIndex, name, value);
                    break;
            }
        }

        e.preventDefault();
    };

    const submitMovie = useCallback(async (name: any, director: any, synopsis: any, actors: any, genres: any, year: any, ageLimit: any, rating: any) => {
        try {
            const response = await fetch(`/api/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, director, synopsis, actors, genres, year, ageLimit, rating }),
            });
            const json = await response.json();
            fetchMovies();
            //setToken(json);
            return json;
        } catch (e) {
            console.log('fetchChartData error: ', e);
            throw new Error((e as Error).message);
        } finally {

        }
    }, []);

    return <Container maxWidth="md" component="main">
        <Card>
            <Typography variant="h5" style={{ margin: '10px' }}>Add a new movie</Typography>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                style={{}}
            >
                <TextField id="username" label="Movie name" variant="outlined" type='text' value={name} onChange={(ev) => setName(ev.target.value)} required />
                <TextField id="password" label="Synopsis" variant="outlined" type='text' value={synopsis} onChange={(ev) => setSynopsis(ev.target.value)} required />
                <br></br>
                <TextField id="username" label="Year" variant="outlined" type='number' value={year} onChange={(ev) => setYear(Number(ev.target.value))} required />
                <TextField id="firstname" name="firstname" label="Director's firstname" variant="outlined" type='text' value={director.firstname} onChange={handleDirectorChange} required />
                <TextField id="lastname" name="lastname" label="Director's lastname" variant="outlined" type='text' value={director.lastname} onChange={handleDirectorChange} required />
                <br></br>
                {actors.map((val, idx) => (
                    <ItemRow
                        item={val}
                        idx={idx}
                        key={idx}
                        onClickRemoveItem={onClickRemoveItem}
                        onChangeItemRowField={onChangeItemRowField}
                    />
                ))}
                <Button
                    variant="outlined"
                    onClick={addBlankActor}
                >
                    Add a new actor
                </Button>
                <br />
                <br />
                <TextField id="ageLimit" label="ageLimit" variant="outlined" type='number' value={ageLimit} onChange={(ev) => setageLimit(Number(ev.target.value))} required />
                <TextField id="rating" label="Rating" variant="outlined" type='number' value={rating} onChange={(ev) => setRating(Number(ev.target.value))} required />
                <br></br>
                <TextField
                    type="text"
                    name="genre"
                    id="genre"
                    value={genre}
                    onChange={(ev) => setGenre(ev.target.value)}
                />
                <Button
                    variant="outlined"
                    onClick={addGenre}
                >
                    Add new a genre
                </Button>
                <br></br>Genres:
                {genres.map((val, idx) => (
                    <div key={val}>{val}</div>
                ))}<br></br>
                <Button variant="outlined" style={{ marginTop: '16px' }} onClick={async () => { submitMovie(name, director, synopsis, actors, genres, year, ageLimit, rating); }}>Submit movie</Button>
                <br></br><br></br><br></br>
            </Box>
        </Card>
    </Container>
};

export default AddNew;