import React, {Component} from 'react';

import './stationDetail.css';
import { axiosService } from '../../service/axios';
import { existParam } from '../../utils/ValidInfo';
import MessageLine from '../../components/MessageLine';


class StationDetail extends Component{

    constructor(props) {
        super();
        this.state = {
            id:'',
            station: {},
            phones: [],
            emails: [],
            webContacts: [],
            products: [],
            message:'',
            typeMessage:'',
            load: '',
        }
        this.loadInfoStation = this.loadInfoStation.bind(this);
        this.formatContacts = this.formatContacts.bind(this);
        this.loadProductsStation = this.loadProductsStation.bind(this);
    }

    componentDidMount(){
        const { id } = this.props.match.params;
        this.setState({id: id});
        this.loadInfoStation(id);
        this.loadProductsStation(id);
    }

    async loadInfoStation(id) { 
        try {
            const response = await axiosService({
                url: '/stations',
                method: 'GET',
                params: {
                    page: 0,
                    size: 1,
                    idStation: id
                }
            })     
            response.data.response.forEach((s) => {
                this.setState({station: s})
                this.formatContacts(s);
            },)
            this.setState({load: true})
        } catch(error) {
            this.setState({message: 'Falha ao consultar informações do posto de coleta.'});
            this.setState({typeMessage: 'error'})   
            this.setState({load: false})
        }
    }

    async loadProductsStation(id) {
        try {
            const response = await axiosService({
                url: '/marketstuff',
                method: 'GET',
                params: {
                    page: 0,
                    size: 0,
                    stationId: id
                }
            })
            console.log(response.data.response)
            this.setState({products: response.data.response})
        } catch(error) {
           
        }
    }

    formatContacts(station) {
        let phones = [];
        let emails = [];
        let webContacts = [];
        existParam(this.state.station.phone) && phones.push(this.state.station.phone);  
        existParam(this.state.station.phoneAdd) && phones.push(this.state.station.phoneAdd);
        existParam(this.state.station.cellPhone) && phones.push(this.state.station.cellPhone);
        existParam(this.state.station.cellPhoneAdd) && phones.push(this.state.station.cellPhoneAdd);
        existParam(this.state.station.email) && emails.push(this.state.station.email);   
        existParam(this.state.station.emailAdd) && emails.push(this.state.station.emailAdd); 
        existParam(this.state.station.site) && webContacts.push(this.state.station.site);    
        existParam(this.state.station.facebook) && webContacts.push(this.state.station.facebook);
        existParam(this.state.station.otherUrl) && webContacts.push(this.state.station.otherUrl);
        this.setState({phones: phones});
        this.setState({emails: emails});
        this.setState({webContacts: webContacts});
    }


    render(){
        return(
            <div id='containerPage'>
                <div id='containerPageIntern'>
                    <div id='titlePage'>{this.state.station.nmFantazy}</div>
    
                    {this.state.load === false &&
                    <MessageLine width={'90%'} message={this.state.message} typeMessage={this.state.typeMessage} />}
                    {this.state.load === true &&
                    <div id='ContainerFindResultColorAdmin'>
                        <div id='containerBtnGoBack'>
                            <div  id='btnGoBack' onClick={() => this.props.history.push('/postos')}>voltar</div>
                        </div>
                        <div id='stationDetail'>
                            <div id='titleInfo'><strong>Informações gerais</strong></div>
                            <div id='detailInfo'>
                                <strong id='subtitleInfo'>Endereço:</strong><br/>
                                <label>{this.state.station.street}, {this.state.station.number} {this.state.station.complement}</label><br/>
                                <label>{this.state.station.neighborhood} - {this.state.station.city} - {this.state.station.state}/{this.state.station.uf} - {this.state.station.zip}</label><br/>
                            </div>
                            <div id='detailInfo'>
                                <strong>Contatos:</strong><br/>
                                <label>Telefone: </label>
                                {this.state.phones.size !== 0 && this.state.phones.map((phone, index) => {
                                    return(<label key={index}>{phone} </label>)
                                })}
                                <br/><label>E-mail: </label>
                                {this.state.emails.size !== 0 && this.state.emails.map((email, index) => {
                                    return(<label key={index}>{email} </label>)
                                })}      
                                <br/><label>Website e redes sociais: </label>
                                {this.state.webContacts.size !== 0 && this.state.webContacts.map((web, index) => {
                                    return(<label key={index}>{web} </label>)
                                })}      
                            </div>
                            <div id='line'></div>
                        </div>
                        <div id='stationDetail'>       
                            <div id='titleInfo'><strong>Produtos</strong></div>
                            <table id='tbFind'>
                                <thead>
                                    <tr>
                                        <th id='tbFindTh'>Produto</th>
                                        <th id='tbFindTh'>{`Valor (R$)/Kg`}</th>
                                        <th id='tbFindTh'>Data de autialização</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.products.map((product, index) => { 
                                    return(
                                    <tr id='tbFindTr' style={{'backgroundColor': (index % 2 === 0) ?  '#FFF' : '#E5F1EE'}} key={product.idMktProduct}>
                                        <td id='tbFindTd50PorCento'>{product.product}</td>
                                        <td id='tbFindTd'>{product.value.toFixed(2).replace('.', ',')}</td>
                                        <td id='tbFindTd'>{product.updateDate}</td>
                                    </tr>
                                    ); 
                                },)}
                                </tbody>
                            </table>    
                        </div>
                    </div>
                    }               
                </div>
            </div>
                        
        )
    }

}

export default StationDetail;

    
    
    
   
