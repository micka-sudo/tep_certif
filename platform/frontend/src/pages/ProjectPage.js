import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ProjectEditor from "../components/ProjectEditor";
import FormGroup from '@material-ui/core/FormGroup';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Progress from "../components/CircularProgress/CircularProgress";
import {getContents, postContent} from "../services/content.service";


const useStyles = makeStyles((theme) => ({
    
    appBarSpacer: theme.mixins.toolbar,
   
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
}));

export default function Dashboard() {
    const classes = useStyles();

    const [selectedProject, setSelectedProject] =  React.useState (-1)
    const [newProject, setNewProject] =  React.useState (false)
    const [projectName, setProjectName] =  React.useState ('')
    const [data, setData] =  React.useState (null)
    const [isLoading, setIsLoading] =  React.useState (true)

    React.useEffect(() => {
        if (data)
            setIsLoading(false)
        else {
            setIsLoading(true)
            getContents('/projects/', {depth: 3}, setData)
        }
    }, [data, setData, setIsLoading]);


    const handleConfirm = () => {
        if (projectName==='')
            return;
        postContent('/projects/', {name: projectName, active_models: []}, (data) => window.location.reload())
        
        setNewProject(false)
    }

    const handleCancel = () => {
        setNewProject(false)
    }

    const handleOpen = () => {
        setProjectName('')
        setNewProject(true)
    }
        
    if (isLoading)
        return (<div><Progress/></div>)

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <main className={classes.content}>
                <Container maxWidth="xl" className={classes.container}>
                    <form className={classes.form} noValidate>
                        <FormGroup row>
                            <FormControl className={classes.formControl}> 
                                <Button variant="contained" color="primary" onClick= {handleOpen}>
                                    New project
                                </Button>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <Select
                                    labelId="projet-select-label"
                                    value={selectedProject}
                                    onChange={(e) => {
                                        setSelectedProject(e.target.value)
                                        getContents('/projects/', {depth: 3}, setData)
                                    }}
                                    >
                                    <MenuItem value={-1}>
                                        <em>Projects</em>
                                    </MenuItem>
                                    {data.results.map((element, i) => <MenuItem key={"projects-name" + element.name} value={i}>{element.name  }</MenuItem>)}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        {selectedProject !== -1 && <ProjectEditor projectData={data.results[selectedProject]}/>}
                    </form>
                </Container>
            </main>
            <div className={classes.appBarSpacer}/>
            <Dialog onClose={handleCancel} aria-labelledby="dialog-title" open={newProject}>
                <DialogTitle id="dialog-title">Add Project</DialogTitle>
                <DialogContent>
                    <TextField value={projectName} onChange={(e) => setProjectName(e.target.value)} required label="Project name"/>
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