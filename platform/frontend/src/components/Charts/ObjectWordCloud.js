import React from 'react'
import { TagCloud } from 'react-tagcloud'

const ObjectWordCloud = (props) => {
  return (
    <TagCloud
      minSize={12}
      maxSize={35}
      tags={props.data}
    />
  );
};

export default ObjectWordCloud;