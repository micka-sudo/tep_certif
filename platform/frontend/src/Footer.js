import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from "@material-ui/core/Link";
import WebIcon from '@material-ui/icons/Web';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                ...
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height:'100%',
        margin:'0px',
        padding:'0px'
    },
    WebButton: {
        marginRight: theme.spacing(2),
    },
    appbar: {
        alignItems: 'center',
    }
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <AppBar className={classes.appbar} position="static">
                <Toolbar>
                    <Button
                        target="_blank"
                        href="https://nancyclotep.com/fr/accueil/"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.WebButton}
                        startIcon={<WebIcon/>}
                    >
                        Nancyclotep
                    </Button>
                    <Button
                        target="_blank"
                        href="https://github.com/Nancyclotep/devia"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.WebButton}
                        startIcon={<GitHubIcon/>}
                    >
                        Git
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.WebButton}
                        startIcon={<EmailIcon/>}
                    >
                        xxxx@chru-nancy.fr
                    </Button>
                </Toolbar>
                <Copyright/>
            </AppBar>
        </footer>
    );
}
