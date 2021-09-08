import axios from 'axios';

// const urlBase = 'http://localhost:9000'
const urlBase = 'https://api-coleta.herokuapp.com'

export const axiosService = axios.create({
    baseURL: urlBase,
});

export const axiosServiceZip = axios.create({
    baseURL: 'https://viacep.com.br/ws'
});

export const axiosServiceStates = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})