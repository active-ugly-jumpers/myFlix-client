import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';

export const ProfileView = ({ user, token, movies, onUserUpdate, onUserDelete }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        birthday: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, [user, token]);

    const fetchUserInfo = async () => {
        const response = await fetch('https://arcane-movies-f00164225bec.herokuapp.com/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
            const users = await response.json();
            const currentUser = users.find(u => u.username === user.username);
            
            if (currentUser) {
                setUserInfo(currentUser);
                setFormData({
                    username: currentUser.username,
                    email: currentUser.email,
                    password: '',
                    birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : ''
                });
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const updateData = {
            username: formData.username,
            email: formData.email,
            birthday: formData.birthday
        };

        if (formData.password) {
            updateData.password = formData.password;
        }

        const response = await fetch(`https://arcane-movies-f00164225bec.herokuapp.com/users/${user.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setMessage('Profile updated successfully!');
            setMessageType('success');
            
            if (updatedUser.username !== user.username) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                onUserUpdate(updatedUser);
            }
            
            setFormData({ ...formData, password: '' });
            fetchUserInfo();
        }
    };

    const handleDeleteUser = async () => {
        const response = await fetch(`https://arcane-movies-f00164225bec.herokuapp.com/users/${user.username}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            onUserDelete();
        }
    };

    if (!userInfo) {
        return <Container className="mt-4"><div>Loading...</div></Container>;
    }

    const favoriteMovies = movies.filter(movie => 
        userInfo.favoriteMovies && userInfo.favoriteMovies.includes(movie.id)
    );

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h1>My Profile</h1>
                    
                    {message && (
                        <Alert variant={messageType} onClose={() => setMessage('')} dismissible>
                            {message}
                        </Alert>
                    )}

                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Profile Information</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpdateUser}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password (leave blank to keep current)</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between">
                                    <Button type="submit" variant="primary">
                                        Update Profile
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteUser}>
                                        Delete Account
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <h4>My Favorite Movies ({favoriteMovies.length})</h4>
                        </Card.Header>
                        <Card.Body>
                            {favoriteMovies.length === 0 ? (
                                <p className="text-muted">No favorite movies yet.</p>
                            ) : (
                                <Row>
                                    {favoriteMovies.map((movie) => (
                                        <Col xs={6} sm={6} md={4} lg={3} key={movie.id} className="mb-4">
                                            <MovieCard movie={movie} />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};