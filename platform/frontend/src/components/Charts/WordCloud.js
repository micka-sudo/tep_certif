import React from 'react'
import {TagCloud} from 'react-tagcloud'


// custom renderer is function which has tag, computed font size and
// color as arguments, and returns react component which represents tag
const customRenderer = (tag, size, color) => (
    <span
        key={tag.value}
        style={{
            animation: 'blinker 3s linear infinite',
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${size / 2}em`,
            border: `2px solid ${color}`,
            margin: '3px',
            padding: '3px',
            display: 'inline-block',
            color: 'withe',
        }}
    >
    {tag.value}
  </span>
)

const CloudWord = (props) => (
    <TagCloud tags={props.data.filter(tag => tag.count >= props.minCount )} minSize={2} maxSize={7} renderer={customRenderer}/>
)
export default CloudWord;