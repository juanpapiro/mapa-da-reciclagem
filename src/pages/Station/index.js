import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './station.css';
import '../../style.css';
import { axiosService } from '../../service/axios';
import Paginator from '../../components/Paginator';
import MessageLine from '../../components/MessageLine';
 
export default function Station(props) {

    const [stations, setStations] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [stationId] = useState([])
    const [state, setState] = useState([])
    const [city, setCity] = useState([])
    const [neighborhood, setNeighborhood] = useState([])
    const [sort] = useState();
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState();
    const [{message, typeMessage}, setMessage] = useState({});


    useEffect(() => {
        loadStations();
        loadStates();
        loadCities();
    },[]);

    async function loadStations(thisPage){
        console.log(page);     
        try{
            const response = await axiosService({
                url: '/stations',
                method: 'GET',
                params: {
                    page: (thisPage === undefined) ? page : thisPage, //para setar o estado inicial
                    size: size,
                    sort: sort,
                    stationId: stationId,
                    state: state,
                    city: city,
                    neighborhood: neighborhood,
                }
            })
            debugger;
            setStations(response.data.response);
            setTotalPages(response.data.totalPages);
            setMessage({});
            if(response.data.response.length === 0) {
                setMessage({message: 'Nenhum posto de coleta foi encontrado.',
                typeMessage: 'warning'})
            }
        } catch(error) {
            if (error.message.includes('404')) {
                setMessage({message: 'Nenhum posto de coleta foi encontrado.',
                typeMessage: 'warning'})
            } else {
                setMessage({message: 'Falha ao consultar postos de coleta.',
                typeMessage: 'error'})
            }   
        }
    }

    async function loadStates() {
        try{
            const response = await axiosService({url: '/stations/states', method: 'GET'})
            setStates(response.data);
        } catch(error) {
        }
    }

    async function loadCities() {
        try{
            const response = await axiosService({url: '/stations/cities', method: 'GET'})
            setCities(response.data);
        } catch(error) {
        }
    }

    function Message(){
        if(message === null || message === '' ) return;
        return(
            <MessageLine width={'75%'} message={message} typeMessage={typeMessage}/>
        )
    }

    function Paginar() {    
        return(
            <Paginator id='paginator' page={page} totalPages={totalPages}
            lengthPages={4} callbackParent={(page) => onPaginatorChanged(page)} />
        )
    }

    function onPaginatorChanged(page) {
        setPage(page)
        loadStations(page);
    }


    function inputFind(e) {
        setNeighborhood(e.target.value)
        e.preventDefault();
    }

    return(
        <div id='containerPage'>
            <div id='containerPageIntern'>
                <div id='titlePage'>Postos de coleta</div>
                {(message !== '' && message !== undefined) && <Message />}
            
                    <div id='containerInternFindStation'>
                        <div id='containerFindStation'>
                            <div id='elementFindStation'><label id='labelsOthers'>Estado: </label></div>
                            <div id='elementFindStation'>
                                <select id='selectFindStation' name='state' onChange={(e) => {setState(e.target.value)}}>
                                        <option id='selectFindOpt' key={0} value=''>...</option>
                                    {states.map((state, index) => {
                                        return(<option id='selectFindOpt' key={index} value={state}>{state}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                        <div id='containerFindStation'>
                            <div id='elementFindStation'><label id='labelsOthers'>Cidade: </label></div>
                            <div id='elementFindStation'>
                                <select id='selectFindStation' name='city' onChange={(e) => {setCity(e.target.value)}}>
                                        <option id='selectFindOpt' key={0} value=''>...</option>
                                    {cities.map((city, index) => {
                                        return(
                                            <option id='selectFindOpt' key={index} value={city}>{city}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div id='containerInputFindStation'>
                            <div id='elementFindStation'><label id='labelsOthers'>Bairro: </label></div>
                            <div id='elementFindStation'>
                                <input id='inputFindStation' type='text' autoComplete='off' value={neighborhood}
                                onChange={(e) => inputFind(e)} placeholder='Bairro...' name='neighborhood' />
                            </div>
                        </div>
                        <div id='containerInputFindStation'>
                            <div id='elementFindStation'>
                                <button id='btnFindStation' onClick={() => {loadStations(page)}}>Buscar</button>
                            </div>
                        </div>
                    </div>

                    <div id='containerResultFind'>
                        <table id='tbFind'>
                            <thead>
                                <tr>
                                    <th id='tbFindTh'>Posto</th>
                                    <th id='tbFindTh'>Estado</th>
                                    <th id='tbFindTh'>Cidade</th>
                                    <th id='tbFindTh'>Bairro</th>
                                    <th id='tbFindTh'>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                            {stations.map((station, index) => { 
                                return(
                                <tr id='tbFindTr' style={{'backgroundColor': (index % 2 === 0) ?  '#ECF0F0' : '#FFF'}} key={station.idStation}>
                                    <td id='tbFindTd25PorCento'>{station.nmFantazy}</td>
                                    <td id='tbFindTd'>{station.state}</td>
                                    <td id='tbFindTd'>{station.city}</td>
                                    <td id='tbFindTd25PorCento'>{station.neighborhood}</td>
                                    <td id='tbFindTd'><Link to={`/postos/${station.idStation}`}><img id='tbIcon' style={{cursor: 'pointer'}}
                                        src={require('../../assets/incons/icon-search.svg')} alt='icon-seach'/></Link></td>
                                </tr>
                                ); 
                            },)}
                            </tbody>
                        </table>
                        {(totalPages !== undefined && totalPages !== 0) && <Paginar />} 
                    </div>
                </div>
        </div>
    )
    
}