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
 * @description redirect to HomePage
 * @param e
 */
function redirection(e) {
    e.preventDefault()
    window.location = "/HomePage"
}
/**
 * @function DocsButton
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description DocsButtons redirect to HomePage onClick
 */

export default function DocsButton() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={redirection}>
                Documents
            </Button>
        </div>
    );
}