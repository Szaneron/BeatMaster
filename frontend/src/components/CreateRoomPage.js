import React, {useState, useEffect} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import {Link, useNavigate} from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Collapse} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = (props) => {
    const [guestCanPause, setGuestCanPause] = useState(
        props.guestCanPause || true
    );
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || 2);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setGuestCanPause(props.guestCanPause || true);
        setVotesToSkip(props.votesToSkip || 2);
    }, [props]);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => navigate(`/room/${data.code}`))
            .catch((error) => console.error("Error creating room:", error));
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions)
            .then(async (response) => {
                if (response.ok) {
                    setSuccessMsg("Room updated successfully!");
                } else {
                    setErrorMsg("Error updating room...");
                }

                // Include the updateCallback function directly here
                if (props.updateCallback) {
                    await props.updateCallback();
                }
            })
            .catch((error) => {
                console.error("Error updating room:", error);
                if (props.updateCallback) {
                    props.updateCallback(); // call the updateCallback without awaiting
                }
            });
    };

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleRoomButtonPressed}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateButtonPressed}
                >
                    Update Room
                </Button>
            </Grid>
        );
    };

    const title = props.update ? "Update Room" : "Create a Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={errorMsg !== "" || successMsg !== ""}>
                    {successMsg !== "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                                setSuccessMsg("");
                            }}
                        >
                            {successMsg}
                        </Alert>
                    ) : (
                        <Alert
                            severity="error"
                            onClose={() => {
                                setErrorMsg("");
                            }}
                        >
                            {errorMsg}
                        </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <span align="center">Guest Control of Playback State</span>
                    </FormHelperText>
                    <RadioGroup
                        row
                        value={guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary"/>}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary"/>}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign: "center"},
                        }}
                    />
                    <FormHelperText>
                        <span align="center">Votes Required To Skip Song</span>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
};

export default CreateRoomPage;
