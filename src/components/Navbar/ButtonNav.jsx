import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {auth, logout} from '../../utils/Auth';

// import ListMenu from './ListNav';

const ButtonBurger = () => {
    const [open, setOpen] = useState(false);

    return(
        <>
            <StyledBurger open={open} onClick={() => setOpen(!open)}>
                <div />
                <div />
                <div />
            </StyledBurger>
            <Ul open={open}>
                <Link to='/materiais' className='link' onClick={() => setOpen(!open)}><li>Materiais</li></Link>
                <Link to='/postos' className='link' onClick={() => setOpen(!open)}><li>Postos</li></Link>
                {auth() && <Link to='/admin' className='link' onClick={() => setOpen(!open)}><li>Admin</li></Link>}
                {!auth() ? <Link to='/login' className='link' onClick={() => setOpen(!open)}><li id='logged'>Entrar</li></Link>
                        : <Link to='/' className='link' onClick={() => setOpen(!open)}><li onClick={()=>{logout()}} id='logged'>Sair</li></Link>}
            </Ul>
            {/* <ListMenu open={open} /> */}
        </>
    )
}
export default ButtonBurger;

const StyledBurger = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    position: fixed;
    top: 20px;
    right: 2rem;
    z-index: 20;
    display: none;

    @media (max-width: 600px) {
        display: flex;
        justify-content: space-around;
        flex-flow: column nowrap;
    }

    div {
        width: 1.5rem;
        height: 0.25rem;
        background-color: ${({open}) => open ? '#ccc' : '#CCCE47'};
        border-radius: 10px;
        transform-origin: 1px;
        transition: all 0.3s linear;

        &:nth-child(1) {
            transform: ${({open}) => open ? 'rotate(45deg)' : 'rotate(0)'}
        }
        &:nth-child(2) {
            transform: ${({open}) => open ? 'translateX(100%)' : 'translateX(0)'};
            opacity: ${({open}) => open ? 0 : 1}
        }
        &:nth-child(3) {
            transform: ${({open}) => open ? 'rotate(-45deg)' : 'rotate(0)'}
        }
    }
`;


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
        color: ${({ open }) => open && !auth() ? '#FFF' : '#F1E74E'};
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