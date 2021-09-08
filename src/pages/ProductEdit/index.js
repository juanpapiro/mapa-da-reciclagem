import React, {Component} from 'react';

import '../../style.css';
import './productEdit.css'
import { axiosService } from '../../service/axios';
import MessageLine from '../../components/MessageLine';
import Popup from '../../components/Popup';
import { moneyMask } from '../../utils/masks';

class ProductEdit extends Component {
    constructor(props) {
        super();
        this.state = {
            id:'',
            products:[],
            productInsert: '',
            valueInsert: '',
            mktProducts:[],
            stationNotFound:'',
            load:'',
            message:'',
            typeMessage:'',
            showMessage: false,
            edit: false,
            line: '',
            newValue: '',
            oldValue:'',
            idMktProduct:'',
            token: '',
            showPopup: false,
        }

        this.loadProducts = this.loadProducts.bind(this);
        this.loadMktProducts = this.loadMktProducts.bind(this);
        this.insertProduct = this.insertProduct.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
        this.setNewValue = this.setNewValue.bind(this);
        this.confirmUpdate = this.confirmUpdate.bind(this);
        this.rejectUpdate = this.rejectUpdate.bind(this);
        this.requestDeleteProduct = this.requestDeleteProduct.bind(this);
        this.formatValueIn = this.formatValueIn.bind(this);
        this.message = this.message.bind(this);
        this.updateStateMessage = this.updateStateMessage.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({id: id});
        this.setState({token: localStorage.getItem('token')});
        this.loadMktProducts(id);
        this.loadProducts();
    }

    async loadProducts() {
        await axiosService({
            method: 'GET', url: 'stuff',
            params: {page: 0, size: 0}
        }).then((response) => {
            this.setState({products: response.data.response})
        }).catch((error) => {
        })
    }

    async loadMktProducts(id) {
        await axiosService({
            method: 'GET', url:'/marketstuff',
            params:{stationId: id, page:0, size:0, sort:'DATEUPDATE'}
        }).then((response) => {
            console.log(response.data.response)
            this.setState({mktProducts: response.data.response});
            this.setState({load: true});
        }).catch((error) => {
            this.setState({load: false});
            this.setState({message: 'falha ao resgatar produtos.',
            typeMessage: 'error'})
        })
    }

    async insertProduct(e) {
        e.preventDefault();
        debugger;
        let value = this.state.valueInsert.replace(',','.')
        await axiosService({
            method: 'POST', url:'/marketstuff',
            data: {
                idProduct: this.state.productInsert,
                value: value,
                idStations: this.state.id
            },
            headers: {authorization: this.state.token}
        }).then((response) => {
            let products = [response.data.response, ...this.state.mktProducts];
            this.setState({mktProducts: products, showMessage: true,
                           typeMessage: 'ok', message:'Produto inserido com sucesso!'})
            this.updateStateMessage();
            this.setState({load: true});
        }).catch((error) => {
            this.setState({showMessage: true, typeMessage: 'error',
                message:'Falha ao inserir produto!'})
            this.updateStateMessage();
        })
    }

    requestDeleteProduct(idMktProduct, e) {
        this.setState({showPopup:!this.state.showPopup});
        if(idMktProduct !== null) {
            this.setState({idMktProduct: idMktProduct});
        }
        if(e !== null) {
            if(e.currentTarget.name === 'sim') {
                console.log(this.state.mktProducts);
                this.delete(this.state.idMktProduct);
            }
        }
    }


    async delete(idMktProduct) {
        console.log(idMktProduct)
        await axiosService({
            method: 'DELETE', url:'/marketstuff',
            params:{idMktProduct: idMktProduct},
            headers:{authorization: this.state.token}
        }).then((response) => {
            console.log(response.data.response)
            this.setState({load: true});
            let products = [];
            this.state.mktProducts.forEach((p) => {
                if(p.idMktProduct !== this.state.idMktProduct) {
                    products.push(p)
                }
            })
            this.setState({mktProducts: products, showMessage: true,
                typeMessage: 'ok', message:'Produto excluído com sucesso!'})
            this.updateStateMessage();
        }).catch((error) => {
            // this.setState({load: false});
            this.setState({showMessage: true, typeMessage: 'error',
                message:'Falha ao excluir produto!'})
            this.updateStateMessage();
        })
         
    }

    edit(idMktProduct, line){
        this.setState({edit:true})
        this.setState({line:line})
        this.setState({idMktProduct: idMktProduct})
    }

    setNewValue(e) {
        this.setState({newValue:moneyMask(e.target.value)})
        e.preventDefault();
    }

    async confirmUpdate() {
        debugger;
        let value = this.state.newValue.replace(',', '.')
        if(!value.includes('.')) {
            value = value.concat('.00');
        }
        debugger;
        await axiosService({
            method: 'PUT', url:'/marketstuff',
            params:{idMktProduct: this.state.idMktProduct, value: value},
            headers:{authorization: this.state.token}
        }).then((response) => {
            this.setState({load: true});
            this.setState({edit:false});
            this.setState({showMessage: true,
                typeMessage: 'ok', message:'Produto alterado com sucesso!'})
            this.updateStateMessage();
            debugger; 
            let products = this.state.mktProducts;
            let productsUpdate = [response.data.response];
            products.forEach((p) => {
                if(p.idMktProduct !== this.state.idMktProduct) {
                    debugger
                    productsUpdate.push(p)
                }
            })
            this.setState({ mktProducts : productsUpdate, newValue:''})
        }).catch((error) => {
            this.setState({load: false});
            this.setState({message: 'falha ao alterar produto.',
            typeMessage: 'error'})
        })
    }

    rejectUpdate(){
        this.setState({newValue:'', edit:false})
    }

    formatValueIn(e) {
        moneyMask(e.target.value)
        this.setState({valueInsert: moneyMask(e.target.value)})
    }

    message(){
        return(
            <MessageLine message={this.state.message} typeMessage={this.state.typeMessage} /> 
        );      
    }

    updateStateMessage() {
        const interval = setInterval(() => {
            this.setState({showMessage: false})
        }, 3000);
        return () => clearInterval(interval);
    }
 



    render(){
        return(
            <div id='containerPage'>
                <div id='containerPageInternProductEdit'>
                    <div id='containerBtnGoBackSeparate'>
                        <div  id='btnGoBack' onClick={() => this.props.history.push('/admin')}>voltar</div>
                    </div>

                    <div id='titlePage'>Adicionar materiais comercializados</div>
                            
                    {this.state.showPopup ? <Popup txt={`Deseja excluir o produto?`} btn1='sim' btn2='não'
                                            close={(e)=>this.requestDeleteProduct(null, e)} />:null}
                        <form  id='containerInsertProduct'>
                    
                            <div id='containerInternInsertProduct'>
                                <div id='containerSelectProduct'>
                                    <div id='elementSelect'><label id='labelsOthers'>Produto:</label></div>
                                    <div id='elementSelect'>
                                        <select id='selectProductEdit' name='productInsert' value={this.state.productInsert} onChange={(e)=>{this.setState({productInsert: e.target.value})}}>
                                        <option id='selectFindOpt' key={0} value=''>...</option>
                                        {this.state.products.map((p) => {              
                                            return(<option id='selectFindOpt' key={p.id} value={p.id}>{p.product}</option>)
                                        })}
                                    </select>
                                    </div>
                                </div>
                                <div id='containerInputProduct'>
                                    <div id='elementSelect'><label id='labelsOthers'>Valor:</label></div>
                                    <div id='elementSelect'>
                                        <input id='inputProductEdit' type='text' name='value' value={this.state.valueInsert}
                                        placeholder='0,00' onChange={(e) => {this.formatValueIn(e)}}/>
                                        </div>
                                    </div>
                                <div id='containerBtnProduct'>
                                    <div id='elementSelect'><button id='btnProductEdit' onClick={(e) => this.insertProduct(e)}>Inserir</button></div>
                                </div>
                            </div>
                        </form>
                    

                    <div id='titlePage'>Atualizar ou excluir produtos</div>

                    <div id='containerResultFind'>
                        {this.state.showMessage !== false && this.message()}
                        {this.state.load === false ?
                            <MessageLine message={this.state.message} typeMessage={this.state.typeMessage} /> :

                            <table id='tbFind'>
                                <thead>
                                    <tr>
                                        <th id='tbFindTh'>Produto</th>
                                        <th id='tbFindTh'>Valor (R$) /Kg</th>
                                        <th id='tbFindTh'>Última atualização</th>
                                        <th id='tbFindTh'>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.mktProducts.map((p, index) => { 
                                    return(
                                    <tr id='tbFindTrNoHover' style={{'backgroundColor': (index % 2 === 0) ?  '#ECF0F0' : '#FFF'}} key={p.idMktProduct}>
                                        <td id='tbFindTd'>{p.product}</td>
                                        {this.state.edit === true && this.state.showPopup !== true && this.state.line === index ?
                                            <td id='tbFindTdNotPadding'>         
                                                <div id='inputValueContainer'>
                                                    <input id='inputValueTxt' type='text' name='value' value={this.state.newValue}
                                                        placeholder='0,00' onChange={(e) => {this.setNewValue(e)}}/>
                                                    <img id='tbIconEditValue' src={require('../../assets/incons/icon-confirm-fill.svg')}
                                                        onClick={()=>{this.confirmUpdate(p.idMktProduct)}} alt='excluir'/>
                                                    <img id='tbIconEditValue' src={require('../../assets/incons/icon-delete-fill.svg')}
                                                        onClick={()=>{this.rejectUpdate(p.idMktProduct)}} alt='excluir'/>
                                                </div>
                                            </td>:
                                            <td id='tbFindTd'>{p.value.toFixed(2).replace('.',',')}</td>
                                        }
                                        <td id='tbFindTd'>{p.updateDate}</td>
                                        <td id='tbFindTdBtns'>
                                            <img id='tbIconDuo' src={require('../../assets/incons/icon-delete.svg')}
                                                //  onClick={()=>{this.delete(p.idMktProduct)}} alt='excluir'/>
                                                onClick={()=>this.requestDeleteProduct(p.idMktProduct, null)} alt='excluir'/>
                                            <img id='tbIconDuo' src={require('../../assets/incons/icon-edit.svg')}
                                                onClick={()=>{this.edit(p.idMktProduct, index)}} alt='editar'/>
                                        </td>
                                    </tr>
                                    ); 
                                },)}
                                </tbody>
                            </table>
                        
                        }
                    </div>
                </div>
            </div>
   
        )
    }
}
export default ProductEdit;