import { Link } from 'react-router';
import Card from 'react-bootstrap/Card';

export const MovieCard = ({ movie }) => {
    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/300x450?text=No+Image';
    };

    return (
        <Card
            as={Link}
            to={`/movies/${movie.id}`}
            className="h-100 movie-card"
            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
            <Card.Img
                variant="top"
                src={movie.image}
                alt={movie.title}
                onError={handleImageError}
            // style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title className="text-center">{movie.title}</Card.Title>
                <Card.Text className="text-muted text-center small">
                    {movie.year} • {movie.genre}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};