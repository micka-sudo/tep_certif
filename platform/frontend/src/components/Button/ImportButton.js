import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import {green} from '@material-ui/core/colors';
import {getContents, postContent} from '../../services/content.service'


/**
 * @const useStyles
 * @description to change style property
 */
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));

/**
 * @function UploadButtons
 * @param default
 * @returns {JSX.Element}
 * @constructor
 */
export default function UploadButtons() {
    /**
     * @const React.useState
     * @param default, null, true or false
     * @description help for use react State in various constant
     */
    const classes = useStyles();
    const [data, setData] =  React.useState (null);
    const [isLoading, setIsLoading] =  React.useState (true);

    const [projectId, setProjectId] = React.useState('')
    const [showDialog, setShowDialog] = React.useState(false);
    
    const [file, setFile] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (data)
            setIsLoading(false)
        else {
            setIsLoading(true)
            getContents('/projects/', {}, setData)
        }
    }, [data, setData, setIsLoading]);

    /**
     * @function onFileChange
     * @param event
     * @description showDialog box for uploads file on event
     */
    function onFileChange(event) {
        setShowDialog(true);
        setFile(event.target.files[0])
    }

    const handleConfirm = () => {
        if (projectId > 0) {
            setLoading(true)
            const formData = new FormData()
            formData.append("projectId", projectId);
            formData.append("csv", file, file.name);
            postContent('/upload/', formData, (data) => {
                setLoading(false);
                window.location.reload();
            }, false);
        }
        setFile(null)
        setShowDialog(false);
    }

    const handleCancel = () => {
        setFile(null)
        setShowDialog(false);
    }

    if (isLoading)
        return (<div></div>)

    return (
        <div className={classes.root}>
            <input
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={onFileChange}
                disabled={loading}
            />
            <label htmlFor="contained-button-file" className={classes.wrapper}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    component="span"
                >
                        Import
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </label>
            <Dialog onClose={handleCancel} aria-labelledby="dialog-title" open={showDialog}>
                <DialogTitle id="dialog-title">Choose Project</DialogTitle>
                <DialogContent>
                <FormControl className={classes.formControl}>
                    <InputLabel id="project-select-label">Project</InputLabel>
                    <Select
                    labelId="project-select-label"
                    id="project-select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    >
                        <MenuItem value={-1}><em>None</em></MenuItem>
                        {data.results.map((element) => <MenuItem key={"import-select-" + element.name} value={element.id}>{element.name}</MenuItem>)}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
                <Button onClick={handleCancel} color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}
