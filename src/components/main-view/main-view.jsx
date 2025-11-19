import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

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
        <BrowserRouter>
            <Row className="justify-content-md-center">
                <Routes>
                    <Route
                        path="/signup"
                        element={
                            user ? (
                                <Navigate to="/movies" />
                            ) : (
                                <Col md={6} lg={4} className="mx-auto">
                                    <SignupView />
                                </Col>
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/movies" />
                            ) : (
                                <Col md={6} lg={4} className="mx-auto">
                                    <LoginView
                                        onLoggedIn={(user, token) => {
                                            setUser(user);
                                            setToken(token);
                                        }}
                                    />
                                </Col>
                            )
                        }
                    />
                    <Route
                        path="/movies/:movieId"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : (
                                <Col>
                                    <div className="text-end my-3">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                    <MovieView movies={movies} />
                                </Col>
                            )
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            !user ? (
                                <Navigate to="/login" />
                            ) : movies.length === 0 ? (
                                <Col className="text-center">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleLogout}
                                        className="mb-3"
                                    >
                                        Logout
                                    </Button>
                                    <div>The list is empty!</div>
                                </Col>
                            ) : (
                                <>
                                    <Col xs={12} className="d-flex justify-content-end my-3">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </Col>
                                    {movies.map((movie) => (
                                        <Col xs={6} sm={6} md={4} lg={3} key={movie.id} className="mb-4">
                                            <MovieCard movie={movie} />
                                        </Col>
                                    ))}
                                </>
                            )
                        }
                    />
                    <Route path="/" element={<Navigate to={user ? "/movies" : "/login"} />} />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};