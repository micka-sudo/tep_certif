import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ForwardIcon from '@material-ui/icons/Forward';

/**
 * @function ForwardIconButton
 * @param default
 * @returns {JSX.Element}
 * @constructor
 * @description Icon for DocPAge
 */
export default function ForwardIconButton() {
  return (
      <IconButton color="primary" aria-label="go DocPage">
        <ForwardIcon/>
      </IconButton>
  );
}