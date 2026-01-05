# myFlix Client

A React-based frontend application for browsing movies with user authentication and favorites management. This client communicates with the myFlix REST API to provide a complete movie database experience.

## Live Demo

Check out the deployed app here: [myFlix Live Demo](https://active-ugly-jumpers.netlify.app/)

## Features

### Main View
- Returns all movies to the user
- Filtering the list of movies with a “search” feature
- Ability to select a movie for more details
- Ability to log out
- Ability to navigate to Profile view

### Single Movie View
- Returns data (description, genre, director, image) about a single movie to the user
- Allows users to add/remove a movie to/from their list of favorites

### Login View
- Allows users to log in with a username and password

### Signup View
- Allows new users to register (username, password, email, date of birth)

### Profile View
- Displays user registration details
- Allows users to update their info
- Displays favorite movies
- Allows users to remove a movie from their list of favorites
- Allows existing users to deregister

## Backend

This frontend connects to the [myFlix API](https://github.com/active-ugly-jumpers/movie_api) built with Node.js, Express.js, and MongoDB.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Tech Stack

- React 19
- React Bootstrap
- React Router