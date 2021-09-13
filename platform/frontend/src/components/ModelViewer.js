import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';  
import FormControlLabel from '@material-ui/core/FormControlLabel'; 
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
     paper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2)
    }
}));

export default function ModelViewer(props) {
    const classes = useStyles();
    const {modelData, onModelStateChange} = props;
    // const [modelState, setModelState] = React.useState(modelData.state);
    
    return (
        <Paper className= {classes.paper}>
            <Grid container direction= "row">
                <Grid item xs={2}>
                    <FormGroup>
                        <Typography variant="h6">
                            {modelData.name}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={modelData.state}
                                    onChange={(e) => onModelStateChange(e.target.checked)}
                                    name="modelState"
                                    color="primary"
                                    />
                            }
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs={10}>
                    <Typography>
                        {modelData.desc}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
        )
}