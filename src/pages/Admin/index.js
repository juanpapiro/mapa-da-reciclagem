import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import './admin.css';
import '../../style.css';
import { axiosService } from '../../service/axios';
import { existParam } from '../../utils/ValidInfo';
import MessageLine from '../../components/MessageLine';

function Admin(props) {

    const [stationNotFound, setStationNotFound] = useState();
    const [user, setUser] = useState({idUser:'', email:'', token:''});
    const [stationsFormat, setStationsFormat] = useState([]);
    const [message, setMessage] = useState();
    const [typeMessage, setTypeMessage] = useState();
    const [load, setLoad] = useState();


    useEffect(() => {
        debugger;
        findUser();
    }, [])


    function findUser() {
        let userToken = {
            idUser: localStorage.getItem('idUser'),
            email: localStorage.getItem('email'),
            token: localStorage.getItem('token')
        }
        setUser(userToken);
        findStationToUser(userToken);
    }

    async function findStationToUser(user) {
        await axiosService({
            method: 'GET',
            url:'/stations/admin',
            headers:{authorization: user.token},
            params:{email: user.email, page: 0, size:0}
        }).then(response => {
            console.log(response)
            debugger
            if(response.status === 204 || response.status === '204'){
                setStationNotFound(true);
            } else {
                let stationsFormat = [];
                response.data.response.forEach(station => {
                    let products = station.mktProducts;
                    let phones = formatPhones(station);
                    let emails = formatEmails(station);
                    let webContacts = formatWebContacts(station);
                    let stationFormat = {station, phones, emails, webContacts, products}
                    stationsFormat.push(stationFormat);
                });
                setStationsFormat(stationsFormat);
                setStationNotFound(false);
                setLoad(true);
            }
        }).catch(error => {   
            setMessage('Falha ao consultar informações do posto de coleta.');
            setTypeMessage('error')   
            setLoad(false)      
        })
    }

    function messageRegister() {
        return(
            <div id='stationNotFound'>
                <div id='txtStationNotFound'>Legal, agora você já tem um usuário de administrador
                que te permite cadastrar um ou mais postos de coleta e divulgar localização e
                valores ofertados pelos diveros materiais, deseja cadastrar um posto de coleta agora?</div>
                <div id='btnsContainerNotFound'>
                    <Link to='/cadastrar' id='btnGenericYes'><div>Sim</div></Link>
                    <Link to='/' id='btnGenericNot'><div>Não</div></Link>
                </div>
            </div>
        )
    }



    function formatPhones(station) {
        let phones = [];
        existParam(station.phone) && phones.push(station.phone);  
        existParam(station.phoneAdd) && phones.push(station.phoneAdd);
        existParam(station.cellPhone) && phones.push(station.cellPhone);
        existParam(station.cellPhoneAdd) && phones.push(station.cellPhoneAdd);
        return phones;
    }

    function formatEmails(station) {
        let emails = [];        
        existParam(station.email) && emails.push(station.email);   
        existParam(station.emailAdd) && emails.push(station.emailAdd);
        return emails;
    }

    function formatWebContacts(station) {
        let webContacts = [];   
        existParam(station.site) && webContacts.push(station.site);    
        existParam(station.facebook) && webContacts.push(station.facebook);
        existParam(station.otherUrl) && webContacts.push(station.otherUrl);
        return webContacts;
    }



    return(
        <div id='containerPage'>               
            <div id='containerPageIntern'>
            <div id='titlePage'>Administrar posto(s) de coleta</div>
                <div>{stationNotFound === true && messageRegister()}</div>
                {load === false ?
                    <MessageLine message={message} typeMessage={typeMessage} /> :
                    <div id='containerResultFindAdmin'>
                        
                        {stationNotFound === false ?
                            <div id='containerImgAddStation'>
                                <Link to='/cadastrar' id='linkAddStation'>
                                    <img id='imgAddStation' src={require('../../assets/incons/icon-add.svg')} alt='adicionar posto' />
                                    <strong id='txtAddStation'>Adicionar posto</strong>
                                </Link>
                            </div> : null     
                        }
                        
                        {stationsFormat.map((station) => {
                              return(
                                <div id='stationAdmin' key={station.station.idStation}>
                                    <div id='containerBtnGoBackStationAdmin'>
                                    <Link to={`/editarposto/${station.station.idStation}`} id='btnStationEdit'>
                                        <div>editar cadastro</div>
                                    </Link>
                                    </div>
                                    <div id='titleNameStation'><strong>{station.station.nmFantazy}</strong></div>
                                    <div id='lineMiddle'></div>
                                    <div id='detailInfo'>
                                        <strong id='subtitleInfo'>Administrador: </strong>
                                        <label>{user.email.slice(0, user.email.indexOf('@'))}</label><br/>
                                    </div>
                                    <div id='detailInfo'>
                                        <strong id='subtitleInfo'>Endereço:</strong><br/>
                                        <label>{station.station.street}, {station.station.number} {station.station.complement}</label><br/>
                                        <label>{station.station.neighborhood} - {station.station.city} - 
                                        {station.station.state}/{station.station.uf} - {station.station.zip}</label><br/>
                                    </div>
                                    <div id='detailInfo'>
                                        <strong>Contatos:</strong><br/>
                                        <label>Telefone: </label>
                                        {station.phones.size !== 0 && station.phones.map((phone, index) => {
                                            return(<label key={index}>{phone} </label>)
                                        })}
                                        <br/><label>E-mail: </label>
                                        {station.emails.size !== 0 && station.emails.map((email, index) => {
                                            return(<label key={index}>{email} </label>)
                                        })}      
                                        <br/><label>Website e redes sociais: </label>
                                        {station.webContacts.size !== 0 && station.webContacts.map((web, index) => {
                                            return(<label key={index}>{web} </label>)
                                        })}      
                                    </div>
                                    <div id='lineMiddle'></div>
                                    <div id='containerBtnGoBackStationAdmin'>
                                        <Link to={`/editarmateriais/${station.station.idStation}`} id='btnStationEdit'>
                                            <div>Incluir ou editar</div>
                                        </Link>
                                    </div>
                                    <div id='titleProductStation'><strong>Materiais</strong></div>
                                </div>
                            )    
                        })}
                    </div>
                }                
             </div>   
        </div>
    )

}
export default Admin;


