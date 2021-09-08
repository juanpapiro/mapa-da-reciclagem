import React, {Component} from 'react';

// import Menu from '../Menu';
import Navbar from '../Navbar/Navbar';
import './header.css';

class Header extends Component {
    render(){
        return(
            <div id='header'>
                <Navbar />
            </div>
        )
    }
}
export default Header;