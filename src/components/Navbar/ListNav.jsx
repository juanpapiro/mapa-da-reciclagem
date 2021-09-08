import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {auth, logout} from '../../utils/Auth';

const ListMenu = ({open, onOpenChanged}) => {
    // function onOpenChanged(open) {
    //     callbackParent(open = false);
    // }
    return(
        <Ul open={open}>
            {/* <Link to='/materiais' className='link'><li>Materiais</li></Link>
            <Link to='/postos' className='link'><li>Postos</li></Link>
            {auth() && <Link to='/admin' className='link'><li>Admin</li></Link>}
            {!auth() ? <Link to='/login' className='link'><li id='logged'>Entrar</li></Link>
                     : <Link to='/' className='link'><li onClick={()=>{logout()}} id='logged'>Sair</li></Link>} */}
        </Ul>
    )
}
export default ListMenu;


const Ul = styled.ul`
    list-style: none;
    display: flex;
    flex-flow: row nowrap;
    
    li {
        padding: 25px 10px;
        color: #FFF;
    }
    li:hover {
        color:#CCC;
        transition: all 0.8s;
    }
    #logged {
        color: ${({ open }) => open ? '#FFF' : '#003B33'};
        font-weight: 700;
    }
    #logged:hover{
        color: ${({ open }) => open ? '#CCC' : '#000'};
    }
    /*força a lista horizontal voltar a ser vertical*/
    @media (max-width: 600px) {
        flex-flow: column nowrap;
        background-color: #003B33;
        position: fixed;
        transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
        top: 0;
        right: 0;
        height: 100vh;
        width: 150px;
        padding-top: 3.5rem;
        padding-left: 1rem;
        transition: transform 0.3s ease-in-out;

        li {
            color: #FFF;
        }
    }
    .link {
        margin-right: 15px;
        font-size: 15px;
        text-decoration: none;
        color: #FFF;   
    }
`;

