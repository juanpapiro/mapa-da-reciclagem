import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './menu.css';
import {auth, logout} from '../../utils/Auth';

class Menu extends Component {
    render(){
        return(
            <div id='menu'>
                <div id='mPages'>
                    <Link to='/'>
                    <img src={require('../../assets/imgs/logo-mapadareciclagem.svg')} alt='logo'/>
                    </Link>
                    <Link to='/materiais'>Produtos</Link>
                    <Link to='/postos'>Postos</Link>
                    {auth() && <Link to='/admin'>Admin</Link>}
                </div>
                <div id='mEntrar'>
                    {!auth() ? <Link to='./login'><strong>Entrar</strong></Link>
                     : <Link to='./'><strong onClick={()=>{logout()}}>Sair</strong></Link>}
                </div>
            </div>
        )
    }
}
export default Menu;