import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Room = () => {
    const {roomCode} = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        // Tutaj możesz umieścić kod do pobrania danych o pokoju na podstawie roomCode
        // np. za pomocą fetch lub innego mechanizmu
        // Poniżej znajdziesz przykładowy kod fetch, który można dostosować do własnych potrzeb

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/get-room?code=${roomCode}`);
                const data = await response.json();
                // Aktualizacja stanu na podstawie danych z serwera
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchData();
    }, [roomCode]); // Ustawienie roomCode jako zależności useEffect

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    );
};

export default Room;
