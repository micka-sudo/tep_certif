import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {putContent} from '../services/content.service';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
      },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
}));

export default function FeatureForm(props) {
    const classes = useStyles();
    const { newFeatureValue, onAddFeatureEnd, features, examId } = props;

    const [selectedFeatureName, setSelectedFeatureName] = React.useState('');
    const [labelValue, setLabelValue] = React.useState('');
    const [featureNameValue, setFeatureNameValue] = React.useState('');

    const validFeatureName = (value) => {
        if (value === "")
            return false
        return true
    } 
    const validLabel = (value) => {
        if (value === "")
            return false
        return true
    } 
    
    const isOpen = () => {
        return Boolean(newFeatureValue)
    }
    const close = (data) => {
        onAddFeatureEnd(data);
        setSelectedFeatureName('')
        setLabelValue('')
        setFeatureNameValue('')
    }

    const updateFeatures = (featureName, label) => {

        const user = JSON.parse(localStorage.getItem("currentUser"))

        let newFeatures = features
        if (!newFeatures)
            newFeatures = []

        let feature = newFeatures.find(element => element.name === featureName);
        if (!feature) {
            feature = {name:featureName, sources:[]}
            newFeatures.push(feature)
        }
        
        let source = feature.sources.find(element => element.name === user.userName)
        if (!source) {
            source = {name:user.userName, type:'user', items:[]}
            feature.sources.push(source)
        }

        const newFeature = {label}
        if (newFeatureValue instanceof Object) {
            newFeature.start = newFeatureValue.start
            newFeature.end = newFeatureValue.end
        }
        source.items.push(newFeature)

        putContent('/documents/' + examId + '/', {features:newFeatures}, 
            (data) => {
                close(data);
            }
        )
    }

    const handleConfirm = () => {
        const featureName = selectedFeatureName === "" ? featureNameValue : selectedFeatureName
        if (!validFeatureName(featureName))
            return

        const label = labelValue        
        if (!validLabel(label))
            return
        
        updateFeatures(featureName, label)
    };

    const handleCancel = () => {
        close();
    };

    
    return (
      <Dialog onClose={() => close()} aria-labelledby="simple-dialog-title" open={isOpen()}>
        <DialogTitle id="simple-dialog-title">Add Feature</DialogTitle>
        <DialogContent>
            <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}> 
                    <InputLabel id="featurename-select-label">Feature Name</InputLabel>
                    <Select
                        labelId="featurename-select-label"
                        value={selectedFeatureName}
                        onChange={(e) => setSelectedFeatureName(e.target.value)}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {features.map((element) => <MenuItem key={element.name} value={element.name}>{element.name  }</MenuItem>)}
                    </Select>
                    {selectedFeatureName === '' && <TextField value={featureNameValue} onChange={(e) => setFeatureNameValue(e.target.value)} required />}
                </FormControl>
                <FormControl className={classes.formControl}> 
                    <TextField value={labelValue} onChange={(e) => setLabelValue(e.target.value)} required label="Label"/>
                </FormControl>
            </form>
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
    );
}
