import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    whiteSpace:"pre-wrap",
    padding:"24px"
  },
  highlight: {
    backgroundColor:"red"
  }
}));

export default function MaxHeightTextarea(props) {

  const classes = useStyles();
  const { text, highlight, onSelectText } = props;

  const [selectionSpan, setSelectionSpan] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null)
  const anchorRef = React.useRef();

  React.useEffect(() => {
    if (anchorRef.current)
      setAnchorEl(anchorRef.current)
  }, [selectionSpan, setAnchorEl])

  const isSelectionPanelOpen = () => {
    return Boolean(anchorEl);
  }

  const handleClose = () => {
    setSelectionSpan(null)
    setAnchorEl(null);;
  };

  const parseText = (text) => {
    if (highlight) {
      const start = highlight[0]
      const end = highlight[1]
      return (
        <div>
          <span>{text.substring(0, start)}</span>
          <span className={classes.highlight}>{text.substring(start, end)}</span>
          <span>{text.substring(end, text.length)}</span>
        </div>
      )
    } 
    else if (selectionSpan) {
      let {start, end} = selectionSpan
      if (start > end)
        [start, end] = [end, start];

      return (
        <div>
          <span>{text.substring(0, start)}</span>
          <span ref={anchorRef} className={classes.highlight}>{text.substring(start, end)}</span>
          <span>{text.substring(end, text.length)}</span>
        </div>
      )
    }
    else 
      return <div><span>{text}</span></div>

  }
  
  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    const value = selection.toString();

    if (value === '') 
      return

    setSelectionSpan({start:selection.anchorOffset, end:selection.focusOffset})
  }

  return (
    <div>
      <Paper className={classes.root} onClick={handleTextSelection} >
        {parseText(text)}
      </Paper>
      <Popover         
        onClose={handleClose}
        open={isSelectionPanelOpen()}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}>
          <Button onClick={() => onSelectText(selectionSpan, handleClose)} variant="contained" color="primary">
            Create Span Feature
          </Button>
        </Popover>
    </div>
  );
}