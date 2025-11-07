import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

    return (
        <Row>
            {!user ? (
                <Col md={6} lg={4} className="mx-auto">
                    {showSignup ? (
                        <>
                            <SignupView />
                            <p className="text-center mt-3">
                                Already have an account?
                                <Button
                                    variant="link"
                                    onClick={() => setShowSignup(false)}
                                >
                                    Sign in here
                                </Button>
                            </p>
                        </>
                    ) : (
                        <>
                            <LoginView
                                onLoggedIn={(user, token) => {
                                    setUser(user);
                                    setToken(token);
                                }}
                            />
                            <p className="text-center mt-3">
                                Don't have an account?
                                <Button
                                    variant="link"
                                    onClick={() => setShowSignup(true)}
                                >
                                    Sign up here
                                </Button>
                            </p>
                        </>
                    )}
                </Col>
            ) : selectedMovie ? (
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}
                        className="mb-3"
                    >
                        Logout
                    </Button>
                    <MovieView
                        movie={selectedMovie}
                        onBackClick={() => setSelectedMovie(null)}
                    />
                </Col>
            ) : movies.length === 0 ? (
                <Col className="text-center">
                    <Button
                        variant="outline-secondary"
                        onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}
                        className="mb-3"
                    >
                        Logout
                    </Button>
                    <div>The list is empty!</div>
                </Col>
            ) : (
                <>
                    <Col xs={12}>
                        <Button
                            variant="outline-secondary"
                            onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}
                            className="mb-3"
                        >
                            Logout
                        </Button>
                    </Col>
                    {movies.map((movie) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={movie.id} className="mb-4">
                            <MovieCard
                                movie={movie}
                                onMovieClick={(newSelectedMovie) => {
                                    setSelectedMovie(newSelectedMovie);
                                }}
                            />
                        </Col>
                    ))}
                </>
            )}
        </Row>
    );
};