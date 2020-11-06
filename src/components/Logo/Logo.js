import React from 'react';
import classes from './Logo.css';

const logo = (props)=> (
    <div className={classes.Logo} style={{fontSize: props.height}}><b><span>B</span>ur<span>g</span>erBarr<span>on</span></b></div>
);

export default logo;