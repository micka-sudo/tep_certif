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
 * @description redirect to projects page
 * @param e
 */
function redirection(e) {
    e.preventDefault()
    window.location = "/projects"
}

/**
 * @function ProjectButton
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description ProjectButton redirect to project page onClick
 */
export default function ProjectButton() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={redirection}>
                Projects
            </Button>
        </div>
    );
}