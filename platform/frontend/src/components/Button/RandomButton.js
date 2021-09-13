import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {getContents} from "../../services/content.service";

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
 * @function DocsButton
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description allows you to display a document randomly
 */
export default function ContainedButtons() {
  const classes = useStyles();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (data)
      window.location = "/document/" + data.id;
    }, [data]);


  const handleClick = () => {
    getContents('/random/', {}, setData)
  }

  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick = {handleClick}>
        Random
      </Button>
    </div>
  );
}
