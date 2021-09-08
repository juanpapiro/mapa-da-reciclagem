import React, {Component} from 'react';

import './register.css';
import '../../style.css'
import { axiosService, axiosServiceZip, axiosServiceStates } from '../../service/axios';
import { cpfMask, cnpjMask, cellMask, phoneMask, numMask, zipMask } from '../../utils/masks';
import { notNull, validCpf, validCnpj } from '../../utils/ValidForm';
import Popup from '../../components/Popup';


class Register extends Component {
   
    constructor(props) {
        super();
        this.state = {
            showPopup:false,
            form: {
                nmFantazy: '',
                doc: '',
                typeDoc: 'cpf',

                idUser: '',
                emailUser: '',

                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                uf: '',
                zip: '',
 
                phone: '',
                phoneAdd: '',
                cellPhone: '',
                cellPhoneAdd: '',

                email: '',
                emailAdd: '',
                site: '',
                facebook: '',
                otherUrl: '',              
            },
            valid:{nmFantazy:'', doc:'', zip:'', street:'', number:'', neighborhood:'', city:'', state:''},
            states:[{nome:'', sigla:''}],
            typeDoc:'cpf',
            token: '',
            checkCpf:true,
            checkCnpj:false,
            errorsForms:[]
        }
        this.input = this.input.bind(this);
        this.loadStates = this.loadStates.bind(this);
        // this.loadZip = this.loadZip.bind(this);
        this.cadastrar = this.cadastrar.bind(this);
        this.processCad = this.processCad.bind(this);
        this.selectTypeDoc = this.selectTypeDoc.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        this.loadStates();
        this.setState({checCpf : true})
        let token = localStorage.getItem('token');
        this.setState({token: token});
        let form = this.state.form;
        form.emailUser = localStorage.getItem('email');
        form.idUser = localStorage.getItem('idUser');
        this.setState({form: form})
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

    cadastrar(e){
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
            valid[error[0]] = error[1]
        })
        this.setState({valid: valid})
        if(errors.length === 0) {
            this.processCad();
        }
    }

    async processCad() {
        debugger
        let url = '/stations';
        let form = this.state.form;
        const options = {
            method: 'POST',
            url: url,
            headers: { 'authorization': this.state.token },
            data: form,
        }
        try {
            const response = await axiosService(options);
            console.log(response);
            this.props.history.push('/admin')
        } catch (error) {
            if(error.message.includes('422') || error.message.includes(422)) {
                this.setState({message: error.response.data.message,
                            typeMessage:'error', showMessage: true})
            } else {
                this.setState({message:'Falha ao atualizar cadastro.',
                                typeMessage:'error', showMessage: true})
            }
        }
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
        debugger;
        let form = this.state.form;
        let errors = notNull(form);
        debugger;
        this.setState({errorsForms : errors})
        errors.map((error) => console.log(error))
    }


    render(){
        return(
            <div id='containerPage'>
            <div id='containerPageIntern'>
            <div id='formContainerRegister'>

            {this.state.showMessage ? <Popup txt={this.state.message} btn1={null} btn2={'fechar'}
                                     close={()=>this.setState({showMessage : false})} />:null}

                <div id='formTitleRegister'>Cadastrar novo posto de coleta</div> 
                <form onSubmit={this.cadastrar} id='register'>
                    <label>Nome fantazia da empresa:*</label>
                    <input type='text' autoComplete='off' autoFocus value={this.state.form.nmFantazy}
                    onChange={this.input} placeholder='Nome' name='nmFantazy' />
                    <div id='msgError'>{this.state.valid.nmFantazy}</div>
                    <div id='registerToInput'>
                        <div id='registerInputMiddleMiddleRadio'>
                            <label>Tipo documento:*</label>
                            <div id='registerBoxRadioButton'>
                                <input type="radio" value='cpf' name='typeDoc'
                                onChange={this.selectTypeDoc} checked={this.state.checkCpf} id='radio' />
                                <div id='labelRadio'><label>CPF</label></div>
                                <input type="radio" value='cnpj' name='typeDoc'
                                onChange={this.selectTypeDoc} checked={this.state.checkCnpj} id='radio' />
                                <div id='labelRadio'><label>CNPJ</label></div>
                            </div>
                        </div>
                        <div id='registerInputMiddleMiddle'>
                            <label>Documento:*</label>
                            <input type='text' autoComplete='off' value={this.state.form.doc}
                            onChange={this.input} placeholder='Cnpj / Cpf' name='doc' />
                            <div id='msgError'>{this.state.valid.doc}</div>
                        </div>
                    </div>
                    <label>Cep:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.zip}
                    onChange={this.input} onPointerOut={this.loadZip.bind(this)} placeholder='Cep' name='zip' />
                    <div id='msgError'>{this.state.valid.zip}</div>
                    <label>Rua:*</label>
                    <input type='text' autoComplete='off' value={this.state.form.street}
                    onChange={(e)=>this.input(e)} placeholder='Rua' name='street' />
                    <div id='msgError'>{this.state.valid.street}</div>
                    <div id='registerToInput'>
                        <div id='registerInputMiddle'>
                            <label>Número:*</label>
                            <input type='text' autoComplete='off' value={this.state.form.number}
                            onChange={this.input} placeholder='000' name='number' />
                            <div id='msgError'>{this.state.valid.number}</div>
                        </div>
                        <div id='registerInputMiddle'>
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
                    <select id='selectState' placeholder='Selecione um estado...' name='state' value={this.state.form.state} onChange={(e) => this.input(e)}>
                        <option placeholder='Selecione um estado...' value=''>Selecione o estado...</option>
                        {this.state.states.map((state, index) => {
                            return(<option value={state.nome} key={index}>{state.nome}</option>)
                        })}
                    </select>
                    <div id='msgError'>{this.state.valid.state}</div>
                    <div id='registerToInput'>
                        <div id='registerInputMiddle'>
                            <label>Telefone fixo:</label>
                            <input type='text' autoComplete='off' value={this.state.form.phone}
                            onChange={this.input} placeholder='(00) 0000-0000' name='phone' />
                        </div>
                        <div id='registerInputMiddle'>
                            <label>Telefone fixo adicional:</label>
                            <input type='text' autoComplete='off' value={this.state.form.phoneAdd}
                            onChange={this.input} placeholder='(00) 0000-0000' name='phoneAdd' />
                        </div>
                    </div>
                    <div id='registerToInput'>
                        <div id='registerInputMiddle'>
                            <label>Celular:</label>
                            <input type='text' autoComplete='off' value={this.state.form.cellPhone}
                            onChange={this.input} placeholder='(00) 00000-0000' name='cellPhone' />
                        </div>
                        <div id='registerInputMiddle'>
                            <label>Celular adicional:</label>
                            <input type='text' autoComplete='off' value={this.state.form.cellPhoneAdd}
                            onChange={this.input} placeholder='(00) 00000-0000' name='cellPhoneAdd' />
                        </div>
                    </div>
                    <div id='registerToInput'>
                        <div id='registerInputMiddle'>
                            <label>E-mail:</label>
                            <input type='text' autoComplete='off' value={this.state.form.email}
                            onChange={this.input} placeholder='E-mail' name='email' />
                        </div>
                        <div id='registerInputMiddle'>
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
export default Register;