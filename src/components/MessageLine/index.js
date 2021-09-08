import React from 'react';

import './messageLine.css'

export default function MessageLine(props) {

    let color = '#DCCF71';
    if(props.typeMessage === 'error') color = '#DE7C86';
    if(props.typeMessage === 'warning') color = '#DCCF71';
    if(props.typeMessage === 'ok') color = '#009F8C';
    let width = (props.width === null) ? '100%' : props.width;

    return(
        <div id='messageContainer' style={{backgroundColor: color, width: width}}>
            {props.typeMessage === 'error' && <img src={require('../../assets/incons/icon-error.svg')} alt='icon-error' id='messageIcon'/>}
            {props.typeMessage === 'warning' && <img src={require('../../assets/incons/icon-warning.svg')} alt='icon-warning' id='messageIcon'/>}
            {props.typeMessage === 'ok' && <img src={require('../../assets/incons/icon-ok.svg')} alt='icon-ok' id='messageIcon'/>}
            <label id='messageTxt'>{props.message}</label>
        </div>
    )
}
