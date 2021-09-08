import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './login.css';
import { axiosService } from '../../service/axios';
import { existParam, length, isEmail } from '../../utils/ValidInfo';

class Login extends Component {
    constructor(props) {
        super();
        this.state = {
            form: {email: '',password: ''},
            callback:{login:''}
        }
        this.insert = this.insert.bind(this);
        this.logar = this.logar.bind(this);
    }

    insert(e) {
        let form = this.state.form;
        form[e.target.name] = e.target.value;
        this.setState({form: form});
    }

    logar = async(e) => {
        e.preventDefault();
        let form = this.state.form;
        debugger
        if(existParam(form.email) && existParam(form.password) &&
           isEmail(form.email) && length(form.password, 6)){
            try{
                const response = await axiosService({method:'POST', url:'/auth', data: form});
                localStorage.setItem('token', response.data.type + " " + response.data.token);
                localStorage.setItem('idUser', response.data.idUser)
                localStorage.setItem('email', response.data.email)
                window.location.replace('/admin');
                // this.props.history.replace('/admin');
            } catch (error) {
                if(error.message.includes('401')||error.message.includes(401)) {
                    let callback={login:'Usuário ou senha incorretos.'};
                    this.setState({callback: callback})
                } else {
                    let callback={login:'Falha na comunicação com o servidor.'};
                    this.setState({callback: callback})
                }
            }
        } else {
            let callback={login:'E-mail e senha devem ser preenchidos corretamente.'};
            this.setState({callback: callback})
        }
    }


    
    render(){
        return(
            <div id='containerPage'>
                <div id='containerPageIntern'>            
                    <div id='formContainer'>
                        <div id='formTitleLogin'>Login</div> 
                        <form onSubmit={this.logar} id='login'>
                            {this.state.callback.login !== '' ? <div id='msgErrorUserLogin'>{this.state.callback.login}</div> : null}
                            <label>E-mail:</label>
                            <input type='text' autoComplete='off' autoFocus autoCapitalize='none' value={this.state.form.email}
                            onChange={this.insert} placeholder='email@email.com.br' name='email' />
                            <label>Senha:</label>
                            <input type='password' autoComplete='off' value={this.state.form.password}
                            onChange={this.insert} placeholder='Sua senha'  name='password'/>
                            <button>Entrar</button>
                            <div id='formCriarConta'>
                                <Link to='/conta'>Criar conta gratuita</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;