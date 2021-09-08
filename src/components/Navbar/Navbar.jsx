import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import ButtonBurger from './ButtonNav';


const Navbar = () => {
    return (
        
        <Nav>
            <NavInter>
                <div className="logo">
                    <Link to='/'>
                    <img src={require('../../assets/imgs/logo-mapadareciclagem.svg')} alt='logo' />
                    </Link>
                </div>
                <ButtonBurger />
            </NavInter>
        </Nav>
    )
}
export default Navbar;

const Nav = styled.nav`
    width: 100%;
    height: 75px;
    padding: 0 0;
    display: flex;
    /* justify-content: space-between; */
    justify-content: center;
    background-color: #009F8C;

    .logo {
        width: 100%;
        padding: 15px 0;
        
    }
    img {
        width: 140px;
        max-width: 170px;
    } 
`;
const NavInter = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 0 30px 0 30px;
    display: flex;
    justify-content: 'center';
`;