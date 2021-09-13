import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {logout} from '../../services/auth.service';

/**
 * @const useStyles
 * @description for change button margin
 */
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

/**
 * @function IconLabelButtons
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description Icon for logout app
 */
export default function IconLabelButtons() {
    const classes = useStyles();

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<ExitToAppIcon/>}
                onClick={logout}
            >
                LogOut
            </Button>

        </div>
    );
}