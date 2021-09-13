import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

/**
 * @const useStyles
 * @description for change root margin
 */
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

/**
 * @function redirection
 * @description redirect to StatPage
 * @param e
 */
function redirection(e) {
    e.preventDefault()
    window.location = "/StatPage"
}

/**
 * @function ContainedButtons
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description ContainedButtons redirect to StatPage onClick
 */
export default function ContainedButtons() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={redirection}>
                Statistiques
            </Button>
        </div>
    );
}