import React, {Component} from 'react';

import './notfound.css';

class NotFound extends Component {
    render(){
        return(
            <div id='containerPage'>
                <div id='containerPageIntern'>
                    <div id='containerNotFound'>
                        <img id='imgNotFound' src={require('../../assets/incons/icon-notfound.svg')} alt='notfound' />
                        <strong id='titleNotFound'>Ops! Essa página não foi encontrada.</strong>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;