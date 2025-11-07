import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showSignup, setShowSignup] = useState(false);

    // seEffect ALWAYS runs (but conditionally executes inside)
    useEffect(() => {
        if (!token) {
            return; // Exit early, but hook still ran
        }
        fetch("https://arcane-movies-f00164225bec.herokuapp.com/movies", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    title: movie.title,
                    year: movie.year,
                    description: movie.description,
                    genre: movie.genre.name,
                    director: movie.director.name,
                    image: movie.imageURL,
                    featured: movie.featured
                }));
                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
            });
    }, [token]);

    // Conditional rendering after all hooks
    if (!user) {
        return (
            <div>
                {showSignup ? (
                    <div>
                        <SignupView />
                        <p>
                            Already have an account? 
                            <button onClick={() => setShowSignup(false)}>
                                Sign in here
                            </button>
                        </p>
                    </div>
                ) : (
                    <div>
                        <LoginView
                            onLoggedIn={(user, token) => {
                                setUser(user);
                                setToken(token);
                            }}
                        />
                        <p>
                            Don't have an account? 
                            <button onClick={() => setShowSignup(true)}>
                                Sign up here
                            </button>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (selectedMovie) {
        return (
            <div>
                <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>
                    Logout
                </button>
                <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div>
                <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>
                    Logout
                </button>
                <div>The list is empty!</div>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>
                Logout
            </button>
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