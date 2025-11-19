import { useState } from 'react';
import { useParams, Link } from 'react-router';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

export const MovieView = ({ movies, user, token, onUserUpdate }) => {
    const [userFavorites, setUserFavorites] = useState(user.favoriteMovies || []);

    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/300x450?text=No+Image';
    };

    const { movieId } = useParams();
    const movie = movies.find(m => m.id === movieId);

    if (!movie) {
        return <div>Movie not found</div>;
    }

    const isFavorite = userFavorites.includes(movie.id);

    const handleToggleFavorite = async () => {
        const method = isFavorite ? 'DELETE' : 'PUT';

        const response = await fetch(`https://arcane-movies-f00164225bec.herokuapp.com/users/${user.username}/movies/${movie.id}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            let updatedFavorites;
            if (isFavorite) {
                updatedFavorites = userFavorites.filter(id => id !== movie.id);
            } else {
                updatedFavorites = [...userFavorites, movie.id];
            }
            
            setUserFavorites(updatedFavorites);
            
            // Update the user object in MainView
            const updatedUser = { ...user, favoriteMovies: updatedFavorites };
            onUserUpdate(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <Row>
            {/* Movie Poster */}
            <Col md={4} lg={3}>
                <Card className="h-100">
                    <Card.Img
                        variant="top"
                        src={movie.image}
                        alt={movie.title}
                        onError={handleImageError}
                    // style={{ height: '500px', objectFit: 'cover' }}
                    />
                </Card>
            </Col>

            {/* Movie Details */}
            <Col md={8} lg={9}>
                <Card className="h-100">
                    <Card.Body className="d-flex flex-column">
                        {/* Header with title and year */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <Card.Title as="h1" className="mb-2">
                                    {movie.title}
                                </Card.Title>
                                <Badge bg="secondary" className="me-2">
                                    {movie.year}
                                </Badge>
                                <Badge bg="primary">
                                    {movie.genre}
                                </Badge>
                            </div>
                            {movie.featured && (
                                <Badge bg="warning" text="dark">
                                    Featured
                                </Badge>
                            )}
                        </div>

                        {/* Description */}
                        <Card.Text as="div" className="mb-4">
                            <h5 className="text-muted mb-2">Synopsis</h5>
                            <p className="lead">{movie.description}</p>
                        </Card.Text>

                        {/* Director Info */}
                        <Card.Text as="div" className="mb-4">
                            <h6 className="text-muted mb-1">Directed by</h6>
                            <span className="h5">{movie.director}</span>
                        </Card.Text>

                        {/* Action Buttons */}
                        <div className="mt-auto d-flex justify-content-between">
                            <Button
                                as={Link}
                                to="/movies"
                                variant="outline-primary"
                                size="lg"
                            >
                                ← Back to Movies
                            </Button>
                            
                            <Button 
                                variant={isFavorite ? "danger" : "success"}
                                size="lg"
                                onClick={handleToggleFavorite}
                            >
                                {isFavorite ? "❤️ Remove from Fav" : "🤍 Add to Fav"}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};