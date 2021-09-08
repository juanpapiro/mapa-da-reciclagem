import React, {Component} from 'react';

import './stationEdit.css';
import '../../style.css';
import { axiosService, axiosServiceZip, axiosServiceStates } from '../../service/axios';
import { cpfMask, cnpjMask, cellMask, phoneMask, numMask, zipMask } from '../../utils/masks';
import { notNull, validCpf, validCnpj } from '../../utils/ValidForm';
import Popup from '../../components/Popup';
import MessageLine from '../../components/MessageLine';


class StationEdit extends Component {
    constructor(props) {
        super();
        this.state = {
            id:'',
            message:'',
            typeMessage:'',
            showMessage:false,
            load:'',
            showPopup:false,
            form: {
                idStation: '', nmFantazy: '', doc: '', typeDoc:'',
                idUser: '',emailUser: '',
                street: '', number: '', complement: '', neighborhood: '', city: '', state: '', uf: '', zip: '',
                phone: '', phoneAdd: '', cellPhone: '', cellPhoneAdd: '',
                email: '', emailAdd: '', site: '', facebook: '', otherUrl: '',              
            },
            valid:{nmFantazy:'', doc:'', zip:'', street:'', number:'', neighborhood:'', city:'', state:''},
            states:[{nome:'', sigla:''}],
            token: '',
            typeDoc:'',
            checkCpf:true,
            checkCnpj:false,
            errorsForms:[]
        }
        this.loadInfoStation = this.loadInfoStation.bind(this);
        this.loadZip = this.loadZip.bind(this);
        this.loadStates = this.loadStates.bind(this);
        this.input = this.input.bind(this);
        this.updateRegister = this.updateRegister.bind(this);
        this.processRequest = this.processRequest.bind(this);
        this.selectTypeDoc = this.selectTypeDoc.bind(this);
        this.validate = this.validate.bind(this);
        this.message = this.message.bind(this);
        this.updateStateMessage = this.updateStateMessage.bind(this);
    }

    componentDidMount(){
        debugger;
        const {id} = this.props.match.params;
        this.loadStates();
        this.setState({id : id});
        this.loadInfoStation(id);
        let token = localStorage.getItem('token');
        this.setState({token: token});
        let form = this.state.form;
        form.emailUser = localStorage.getItem('email');
        form.idUser = localStorage.getItem('idUser');
        this.setState({form: form})
    }

    async loadInfoStation(idStation) {
        await axiosService({
            method: 'GET', url:'/stations',
            params: {page: 0, size: 1, idStation: idStation}
        }).then((response) => {
            const station = response.data.response;
            console.log(station)
            let {nmFantazy, doc, typeDoc, idUser,emailUser, street, number, complement, neighborhood,
                   city, state, uf, zip, phone, phoneAdd, cellPhone, cellPhoneAdd,
                   email, emailAdd, site, facebook, otherUrl} = station[0];
            let form = this.state.form;
            form.idStation = this.state.id;
            form.nmFantazy = nmFantazy;
            form.doc = doc;
            form.typeDoc = typeDoc;
            form.idUser = idUser;
            form.emailUser = emailUser;
            form.street = street;
            form.number = number;
            form.complement = (complement === null) ? '': complement;
            form.neighborhood = neighborhood;
            form.city = city;
            form.state = state
            form.uf = uf;
            form.zip = zip;
            form.phone = (phone === null) ? '' : phone;
            form.phoneAdd = (phoneAdd === null) ? '' : phoneAdd;
            form.cellPhone = (cellPhone === null) ? '' : cellPhone;
            form.cellPhoneAdd = (cellPhoneAdd === null) ? '' : cellPhoneAdd;
            form.email = (email === null) ? '': email;
            form.emailAdd = (emailAdd === null) ? '' : emailAdd;
            form.site = (site === null) ? '' : site;
            form.facebook = (facebook === null) ? '' : facebook;
            form.otherUrl = (otherUrl === null) ? '' : otherUrl;
            this.setState({form: form})
            this.setState({typeDoc: typeDoc})
            if(typeDoc === 'cnpj') {
                this.setState({checkCnpj:true, checkCpf:false, typeDoc:'cnpj'})
            } else {
                this.setState({checkCnpj:false, checkCpf:true, typeDoc:'cpf'})
            }

        }).catch((error) => {
            this.setState({message:'Informações não localizadas.',
                            typeMessage:'error', showMessage: true})
        })
    }

    async loadZip() {
        debugger;
        let form = this.state.form;
        if(form.zip !== undefined && form.zip.length === 9) {
            let zip = form.zip.replace(/\D/g, '');
            await axiosServiceZip({
                method: 'GET',
                url: `/${zip}/json/`
            }).then(response => {
                const zipResp = response.data;     
                form.street = zipResp.logradouro;
                form.neighborhood = zipResp.bairro;
                form.city = zipResp.localidade;
                form.uf = zipResp.uf;
                let stateFind = this.state.states.filter(s => s.sigla === zipResp.uf);
                form.state = (stateFind.length > 0) ? stateFind[0].nome : form.state;
                this.setState({form:form})       
            }).catch(error => {
                console.log(error)
            })
        }
    }

    async loadStates() {
        await axiosServiceStates({
            methos: 'GET', url: '/estados'
        }).then(response => {
            let states = [];
            response.data.forEach((state) => {
                const {nome, sigla} = state;
                states.push({nome, sigla});
            })
            this.setState({states:states})
            console.log(states)
        }).catch(error => {
        })
    }


    input(e){
        let form = this.state.form;
        form[e.target.name] = e.target.value;
        
        if(e.target.name === 'doc' && this.state.typeDoc === 'cpf') {
            console.log(e.target.name)
            form[e.target.name] = cpfMask(e.target.value);
        }
        if(e.target.name === 'doc' && this.state.typeDoc === 'cnpj') {
            console.log(e.target.name)
            form[e.target.name] = cnpjMask(e.target.value);
        }
        if(e.target.name === 'zip') {
            console.log(e.target.name)
            form[e.target.name] = zipMask(e.target.value);
        }
        if(e.target.name === 'number') {
            console.log(e.target.name)
            form[e.target.name] = numMask(e.target.value);
        }
        if(e.target.name === 'phone' || e.target.name === 'phoneAdd') {
            console.log(e.target.name)
            form[e.target.name] = phoneMask(e.target.value);
        }
        if(e.target.name === 'cellPhone' || e.target.name === 'cellPhoneAdd') {
            console.log(e.target.name)
            form[e.target.name] = cellMask(e.target.value);
        }
        this.setState({form:form})
    }

    updateRegister(e){
        this.setState({valid:{}})
        e.preventDefault();
        let form = this.state.form;
        let valid = {nmFantazy:'', doc:'', zip:'', street:'', number:'', neighborhood:'', city:'', state:''};
        let errors = notNull(form);
        if (form.typeDoc === 'cpf' && errors.filter((error) => error[0] === 'doc').length === 0) {
            let errorDoc = validCpf(form.doc);
            if (errorDoc.length > 0) {errors.push(errorDoc)}
        }
        if (form.typeDoc === 'cnpj' && errors.filter((error) => error[0] === 'doc').length === 0) {
            let errorDoc = validCnpj(form.doc);
            if (errorDoc.length > 0) {errors.push(errorDoc)}
        } 
        this.setState({errorsForms : errors})
        this.setState({valid:valid})
        errors.forEach((error) =>{
            valid[error[0]] = error[1];
        })
        this.setState({valid: valid})
        if(errors.length === 0) {
            this.processRequest();
        }
    }

    async processRequest() {
        debugger;     
        let url = '/stations';
        let form = this.state.form;
        const options = {
            method: 'PUT',
            url: url,
            headers: { 'authorization': this.state.token},
            data: form,
        }
        await axiosService(options).then((response) => {
            this.setState({showPopup : true});
        }).catch ((error) => {
            debugger
            if(error.message.includes('401') || error.message.includes(401)) {
                this.setState({message:'Usuário não permite alteração deste posto de coleta.',
                            typeMessage:'error', showMessage: true})
            }
            if(error.message.includes('422') || error.message.includes(422)) {
                this.setState({message: error.response.data.message,
                            typeMessage:'error', showMessage: true})
            } else {
                this.setState({message:'Falha ao atualizar cadastro.',
                                typeMessage:'error', showMessage: true})
            }
        })
    }

    selectTypeDoc(e) {
        if(e.target.value === 'cnpj') {
            this.setState({checkCnpj:true, checkCpf:false, typeDoc:'cnpj'})
        } else {
            this.setState({checkCnpj:false, checkCpf:true, typeDoc:'cpf'})
        }
        let form = this.state.form;
        form.doc = ''
        form.typeDoc = e.target.value;
        this.setState({form: form});
        console.log(e.target.value);
    }

    validate() {
        let form = this.state.form;
        let errors = notNull(form);
        this.setState({errorsForms : errors})
        errors.map((error) => console.log(error))
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
            <div id='containerPageIntern'>
            <div id='formContainerEditRegister'>
            {this.state.showPopup ? <Popup txt={`Informações atualizadas com sucesso!`} btn1='ok' btn2={null}
                                     close={()=>this.setState({showPopup : false})} />:null}

            {this.state.showMessage ? <Popup txt={this.state.message} btn1={null} btn2={'fechar'}
                                     close={()=>this.setState({showMessage : false})} />:null}

                <div id='containerBtnGoBackSeparate700px'>
                    <div  id='btnGoBack' onClick={() => this.props.history.push('/admin')}>voltar</div>
                </div>
                       
                <div id='formTitleEditRegister'>Ataulizar cadastro</div> 
                <form onSubmit={this.updateRegister} id='editRegister'>

                    <label>Nome fantazia da empresa:*</label>
                    <input type='text' autoComplete='off' autoFocus value={this.state.form.nmFantazy}
                    onChange={this.input} placeholder='Nome' name='nmFantazy' />
                    <div id='msgError'>{this.state.valid.nmFantazy}</div>
                    <div id='editRegisterToInput'>
                        <div id='editRegisterInputMiddleMiddle'>
                            <label>Tipo documento:*</label>
                            <div id='editRegisterBoxRadioButton'>
                                <input type="radio" value='cpf' name='typeDoc'
                                onChange={this.selectTypeDoc} checked={this.state.checkCpf} id='radio' />
                                <div id='editRegisterLabelRadio'><label>CPF</label></div>
                                <input type="radio" value='cnpj' name='typeDoc'
                                onChange={this.selectTypeDoc} checked={this.state.checkCnpj} id='radio' />
                                <div id='editRegisterLabelRadio'><label>CNPJ</label></div>
                            </div>
                        </div>
                        <div id='editRegisterInputMiddleMiddle'>
                            <label>Documento:*</label>
                            <input type='text' autoComplete='off' value={this.state.form.doc}
                            onChange={this.input} placeholder='Cnpj / Cpf' name='doc' />
                            <div id='msgError'>{this.state.valid.doc}</div>
                        </div>
                    </div>
                    <label>Cep:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.zip}
                    onChange={this.input} onPointerOut={()=>{this.loadZip()}} placeholder='Cep' name='zip' />
                    <div id='msgError'>{this.state.valid.zip}</div>
                    <label>Rua:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.street}
                    onChange={(e) => this.input(e)} placeholder='Rua' name='street' />
                    <div id='msgError'>{this.state.valid.street}</div>
                    <div id='editRegisterToInput'>
                        <div id='editRegisterInputMiddle'>
                            <label>Número:*</label>
                            <input type='text' autoComplete='off' value={this.state.form.number}
                            onChange={this.input} placeholder='000' name='number' />
                            <div id='msgError'>{this.state.valid.number}</div>
                        </div>
                        <div id='editRegisterInputMiddle'>
                            <label>Complemento:</label>
                            <input type='text' autoComplete='off' value={this.state.form.complement}
                            onChange={this.input} placeholder='Complemento' name='complement' />
                        </div>
                    </div>
                    <label>Bairro:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.neighborhood}
                    onChange={this.input} placeholder='Bairro' name='neighborhood' />
                    <div id='msgError'>{this.state.valid.neighborhood}</div>
                    <label>Cidade:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.city}
                    onChange={this.input} placeholder='Cidade' name='city' />
                    <div id='msgError'>{this.state.valid.city}</div>
                    <label>Estado:*</label>
                    <select id='selectStationEditState' placeholder='Selecione um estado...' name='state'
                    value={this.state.form.state || ''} onChange={(e) => this.input(e)}>
                        <option>Selecione o estado...</option>
                        {this.state.states.map((state, index) => {
                            return(<option value={state.nome} key={index}>{state.nome}</option>)
                        })}
                    </select>
                    <div id='msgError'>{this.state.valid.state}</div>
                    <div id='editRegisterToInput'>
                        <div id='editRegisterInputMiddle'>
                            <label>Telefone fixo:</label>
                            <input type='text' autoComplete='off' value={this.state.form.phone}
                            onChange={this.input} placeholder='(00) 0000-0000' name='phone' />
                        </div>
                        <div id='editRegisterInputMiddle'>
                            <label>Telefone fixo adicional:</label>
                            <input type='text' autoComplete='off' value={this.state.form.phoneAdd}
                            onChange={this.input} placeholder='(00) 0000-0000' name='phoneAdd' />
                        </div>
                    </div>
                    <div id='editRegisterToInput'>
                        <div id='editRegisterInputMiddle'>
                            <label>Celular:</label>
                            <input type='text' autoComplete='off' value={this.state.form.cellPhone}
                            onChange={this.input} placeholder='(00) 00000-0000' name='cellPhone' />
                        </div>
                        <div id='editRegisterInputMiddle'>
                            <label>Celular adicional:</label>
                            <input type='text' autoComplete='off' value={this.state.form.cellPhoneAdd}
                            onChange={this.input} placeholder='(00) 00000-0000' name='cellPhoneAdd' />
                        </div>
                    </div>
                    <div id='editRegisterToInput'>
                        <div id='editRegisterInputMiddle'>
                            <label>E-mail:</label>
                            <input type='text' autoComplete='off' value={this.state.form.email}
                            onChange={this.input} placeholder='E-mail' name='email' />
                        </div>
                        <div id='editRegisterInputMiddle'>
                            <label>E-mail adicional:</label>
                            <input type='text' autoComplete='off' value={this.state.form.emailAdd}
                            onChange={this.input} placeholder='E-mail adicional' name='emailAdd' />
                        </div>
                    </div>
                    <label>Site:</label>
                    <input type='text' autoComplete='off' value={this.state.form.site}
                    onChange={this.input} placeholder='Site' name='site' />
                    <label>Facebook:</label>
                    <input type='text' autoComplete='off' value={this.state.form.facebook}
                    onChange={this.input} placeholder='Facebook' name='facebook' />
                    <label>Outras redes sociais:</label>
                    <input type='text' autoComplete='off' value={this.state.form.otherUrl}
                    onChange={this.input} placeholder='Outras redes sociais' name='otherUrl' />
                    <button>Enviar</button>
                </form> 
            </div>
            </div>
            </div>
        )
    }
}
export default StationEdit;