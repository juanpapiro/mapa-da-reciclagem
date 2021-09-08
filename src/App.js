import React, {Component} from 'react';

import Routes from './Routes';
import Footer from './components/Footer';
import './style.css';

class App extends Component {

  render(){
    return(
      <div id='pageContainer'>
        <div id='contentWrap'>
          
        <Routes />
        <Footer />
        </div>
        
      </div>
    )
  }
}
export default App;
