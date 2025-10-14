import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: "1",
            title: "No Other Land",
            year: 2024,
            description: "Shows the destruction of a Palestinian community in the West Bank and how activists document and resist forced evictions.",
            genre: "Documentary",
            director: "Basel Adra",
            image: "https://upload.wikimedia.org/wikipedia/en/b/be/No_Other_Land_film_poster.jpg"
        },
        {
            id: "2",
            title: "Tár",
            year: 2022,
            description: "A celebrated music director's life starts to unravel amid scandal and the abuse of her power.",
            genre: "Drama",
            director: "Todd Field",
            image: "https://upload.wikimedia.org/wikipedia/en/1/19/T%C3%A1r_poster.jpg"
        },
        {
            id: "3",
            title: "Uncle Boonmee Who Can Recall His Past Lives",
            year: 2010,
            description: "A dying man revisits past lives and interacts with his deceased loved ones in rural Thailand.",
            genre: "Fantasy",
            director: "Apichatpong Weerasethakul",
            image: "https://upload.wikimedia.org/wikipedia/en/9/91/Boonmee-Poster.jpg"
        },
        {
            id: "4",
            title: "Neptune Frost",
            year: 2021,
            description: "A surreal Afrofuturist musical that intertwines technology, identity, and haunting resistance.",
            genre: "Sci-Fi",
            director: "Saul Williams",
            image: "https://upload.wikimedia.org/wikipedia/en/f/fc/NeptuneFrost.jpg"
        }
    ]);

    const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
        return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
    }

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))}
        </div>
    );
};