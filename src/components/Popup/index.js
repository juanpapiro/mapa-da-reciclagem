import React,{Component} from 'react';

import './popup.css';

class Popup extends Component {

    render(){
        return(
            <div id='containerPopup'>
                <div id='internPopup'>
                    <p id='txtPopup'>{this.props.txt}</p>
                    <div id='buttonsPopup'>
                        {this.props.btn1 !== null &&
                            <button id='btnPopupYes' onClick={this.props.close} name={this.props.btn1}>{this.props.btn1}</button>
                        }
                        {this.props.btn2 !== null &&
                            <button id='btnPopupNot' onClick={this.props.close} name={this.props.btn2}>{this.props.btn2}</button>
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default Popup