# BeatMaster

This project enables users to collectively listen to music in real-time. The application is built using Django (backend) with React (frontend) and integrates with the Spotify API.

## Features

- **Create and Join Rooms:**
  - Users can create new rooms or join existing ones using a unique code.

- **Playback Control:**
  - Room owners have full control over music playback, including changing tracks, pausing and resuming.

- **Room Settings:**
  - Customization options for room settings, such as users permisions or the number of votes needed to skip a song.

- **User Permissions:**
  - Owners have full permissions, while other users can pause/resume playback (if they have permissions).

- **Spotify API Integration:**
  - Integration with the Spotify API for playing and managing songs.

- **Vote on Songs:**
  - Users can vote to skip a song; the track changes after reaching the required number of votes.

- **Unique Joining Code:**
  - Visible to owners and guests, making it easy for new users to join the room.

- **Integration with Computer Program:**
  - Remote control of the computer's music player using the appropriate API.

## Technologies

- Backend: Django
- Frontend: React
- Database: PostgreSQL
- Spotify API Integration
- Django Channels for real-time communication
- Django REST Framework Token Authentication

## Running the Project

1. Create your spotify applictaion at: https://developer.spotify.com/
2. Install the required dependencies: `pip install -r requirements.txt`
3. Apply database migrations: `python manage.py migrate`
4. Set environment variables:
    ```
    CLIENT_ID = "Your spotify client id (after creating spotify aplication)"
    CLIENT_SECRET = "Your spotify client secret key (after creating spotify aplication)"
    REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"
    ```
5. Start the server: `python manage.py runserver`

## Images
![beat_master0](https://github.com/Szaneron/BeatMaster/assets/58951668/448f17b4-b930-47b9-8086-80a1ff9d1364)
![beat_master1](https://github.com/Szaneron/BeatMaster/assets/58951668/46efd647-669d-41bb-86ff-062fb5197435)
![beat_master3](https://github.com/Szaneron/BeatMaster/assets/58951668/85585258-dfe3-4b2f-a7c7-50a35b11fe0a)


