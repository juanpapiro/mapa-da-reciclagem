import React, {Component} from 'react';

import './account.css';
import { axiosService } from '../../service/axios';
import { notNullLabels, length, equalsCredentials, isEmail } from '../../utils/ValidForm';

class Account extends Component {
    constructor(props) {
        super();
        this.state = {
            form: {email: '', password: '', confirm:''},
            callback:{user:'', email: '', password: '', confirm:''}
        }
        this.logar = this.logar.bind(this);
        this.createAccount = this.createAccount.bind(this);
        // this.valid = this.valid.bind(this);
    }

    logar(e) {
        let form = this.state.form;
        form[e.target.name] = e.target.value;
        this.setState({form: form});
    }

    async createAccount(e){
        debugger;
        e.preventDefault();
        let form = this.state.form;
        let labels = ['email', 'password', 'confirm'];
        let callback = {user:'', email: '', password: '', confirm:''}
        let valid = [];
        labels.forEach((label) => {valid.push([label, form[label]])});
        let errors = notNullLabels(valid);
        errors.forEach((error) => {callback[error[0]] = error[1]});
        if(callback.email === null || callback.email === '') {
            let error = isEmail([['email', form.email]]);
            if(error.length > 0) { errors.push([error[0][0], error[0][1]])}
        }
        if(callback.password === null || callback.password === '') {
            let error = length([['password', form.password, 6]]);
            if(error.length > 0) { errors.push([error[0][0], error[0][1]])}
        }
        if(callback.confirm === null || callback.confirm === '') {
            let error = length([['confirm', form.confirm, 6]]);
            if(error.length > 0) {errors.push([error[0][0], error[0][1]])}
        }
        errors.forEach((error) => {callback[error[0]] = error[1]});
        if((callback.password === null || callback.password === '') &&
           (callback.confirm === null || callback.confirm === '')) {
            debugger;
            let validEquals = equalsCredentials([
                ['confirm', form.confirm, 'Os campos senha e confirmação de senha devem ser iguais.'],
                ['password', form.password, 'Os campos senha e confirmação de senha devem ser iguais.']
            ]);
            if(validEquals.length > 0) {validEquals.forEach((v) => {callback[v[0]] = v[1]})}
        }
        debugger;
        this.setState({callback : callback});
        if(callback.user === '' && callback.email === '' && callback.password === '' && callback.confirm === '') {
            try {
                const response = await axiosService({
                    method: 'POST',
                    url: '/user',
                    data: {email: form.email, password: form.password},
                });
                console.log(response);
                this.props.history.push('/login');
            } catch (error) {
                debugger;
                if(error.message.includes(422) || error.message.includes('422')) {
                    callback.user = 'Existe um usário cadastrado com este e-mail.'
                    this.setState({callback: callback})
                } else {
                    callback.user = 'Ops.. desculpe, houve uma falha no servidor, por favor tente novamente mais tarde.'
                    this.setState({callback: callback})
                }
                console.log(error.message)
            }
        }
    }
    
    render(){
        return(
            <div id='containerPage'>
                <div id='containerPageIntern'>
                    <div id='formContainerAccount'>
                        <div id='formTitleAccount'>Criar conta gratuita</div>
                        <form onSubmit={this.createAccount} id='account'>
                            {this.state.callback.user !== '' ? <div id='msgErrorUser'>{this.state.callback.user}</div> : null}
                            <label>E-mail:</label>
                            <input type='text' autoComplete='off' autoFocus value={this.state.form.email}
                            onChange={this.logar} placeholder='email@email.com.br' name='email' />
                            <div id='msgError'>{this.state.callback.email}</div>
                            <label>Senha:</label>
                            <input type='password' autoComplete='off' value={this.state.form.password}
                            onChange={this.logar} placeholder='Sua senha' name='password'/>
                            <div id='msgError'>{this.state.callback.password}</div>
                            <label>Confirme a senha:</label>
                            <input type='password' autoComplete='off' value={this.state.form.confirm}
                            onChange={this.logar} placeholder='Confirme sua senha' name='confirm'/>
                            <div id='msgError'>{this.state.callback.confirm}</div>
                            <button>Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;