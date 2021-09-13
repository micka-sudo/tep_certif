import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {putContent} from '../services/content.service';


export default function FeatureDeleteDialog(props) {
    
    const {examId, features, toDelete, onClose} = props

    const isOpen = () => {
        return Boolean(toDelete);
    }

    const handleClose = (event) => {
        onClose();
    }

    const handleConfirm = (event) => {
        let newFeatures = features
        toDelete.forEach((element) => {
            newFeatures = element.onDelete(newFeatures)
        })

        putContent('/documents/' + examId + '/', {features:newFeatures}, 
            (data) => {
                onClose(data);
            }
        )
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="delete-feature-dialog-title" open={isOpen()}>
            <DialogTitle id="delete-feature-dialog-title">Delete Feature</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want delete this features ?</DialogContentText>
                <DialogContentText><em>this will only delete user source features*</em></DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

