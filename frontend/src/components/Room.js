import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Grid,
    Typography,
    Button,
} from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = (props) => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});
    const [roomCode, setRoomCode] = useState(useParams().roomCode);
    const navigate = useNavigate();

    const getRoomDetails = async () => {
        try {
            const response = await fetch(`/api/get-room?code=${roomCode}`);
            if (!response.ok) {
                props.leaveRoomCallback();
                navigate("/");
                return;
            }
            const data = await response.json();
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
            if (data.is_host) {
                authenticateSpotify();
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };

    useEffect(() => {
        getRoomDetails();
        const interval = setInterval(getCurrentSong, 1000);

        return () => clearInterval(interval);
    }, [roomCode, props, navigate]);

    const authenticateSpotify = async () => {
        try {
            const response = await fetch("/spotify/is-authenticated");
            const data = await response.json();
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                const authUrlResponse = await fetch("/spotify/get-auth-url");
                const authUrlData = await authUrlResponse.json();
                window.location.replace(authUrlData.url);
            }
        } catch (error) {
            console.error("Error authenticating Spotify:", error);
        }
    };

    const getCurrentSong = async () => {
        try {
            const response = await fetch("/spotify/current-song");
            const data = response.ok ? await response.json() : {};
            setSong(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching current song:", error);
        }
    };

    const leaveButtonPressed = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            };
            await fetch("/api/leave-room", requestOptions);
            props.leaveRoomCallback();
            navigate("/");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    const updateShowSettings = (value) => {
        setShowSettings(value);
    };

    const renderSettings = () => (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                    updateCallback={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => updateShowSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
    );

    const renderSettingsButton = () => (
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                color="primary"
                onClick={() => updateShowSettings(true)}
            >
                Settings
            </Button>
        </Grid>
    );

    if (showSettings) {
        return renderSettings();
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...song} />
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveButtonPressed}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
};

export default Room;
