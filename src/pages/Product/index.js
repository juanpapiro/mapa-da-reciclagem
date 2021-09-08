import React, {useState, useEffect} from 'react';

import './product.css';
import '../../style.css';
import { axiosService } from '../../service/axios';
import Paginator from '../../components/Paginator';
import MessageLine from '../../components/MessageLine';

function Product(props)  {
    
    const [products, setProducts] = useState([]);
    const [stations, setStations] = useState([]);
    const [mktProducts, setMktProducts] = useState([]);
    const [sort, setSort] = useState();
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState();
    const [idProduct, setIdProduct] = useState();
    const [idStation, setIdStation] = useState();
    const [{message, typeMessage}, setMessage] = useState({});
        

    useEffect(() => {
       loadProducts();
       loadStations();
       loadMktProducts();
    },[]);


    async function loadProducts() {
        try {
            const response = await axiosService({
                url: '/stuff',
                method:'GET',
                params: {
                    idProduct: '',
                    page: 0,
                    size: '0',
                    sort: '',
                    sortDirection: ''
                }
            })
            console.log(response);
            setProducts(response.data.response);
        } catch (error) {
            console.log(error.message);
        }
    }
    async function loadStations() {
        try {
            const response = await axiosService({
                url: '/stations',
                method:'GET',
                params: {
                    idProduct: '',
                    page: 0,
                    size: '0',
                    sort: '',
                    sortDirection: ''
                }
            })
            console.log(response);
            setStations(response.data.response);
        } catch (error) {
            console.log(error.message);
        }
    }

    async function loadMktProducts(pageThis){
        debugger;
        try {
            const response = await axiosService({
                url: '/marketstuff', method:'GET',
                params: {
                    productId: idProduct,
                    stationId: idStation,
                    page: (pageThis === undefined) ? page : pageThis,//para setar o estado inicial
                    size: size,
                    sort: sort,
                    sortDirection: ''
                }
            })
            debugger;
            console.log(response)
            setMktProducts(response.data.response);
            setTotalPages(response.data.totalPages);
            setMessage({})
        } catch(error) {
            if(error.message.includes('404')){
                setMessage({message:'Nenhum registro foi localizado', typeMessage: 'warning'}) 
            } else {
                setMessage({message:'Falha ao buscar produtos.', typeMessage: 'error'}) 
            }
            debugger;
            console.log(error.message);
            console.log(error);
        }
    }

    function sortFind(e) {
        setSort(e.target.value)
    }

    function stationFind(e) {
        console.log(e.target.value)
        setIdStation(e.target.value)
    }

    function productFind(e) {
        setIdProduct(e.target.value)
    }

    function find() {
        console.log(idProduct);
        console.log(sort);
        setPage(0)
        loadMktProducts(0);
    }

    function Message(){
        if(message === null || message === '' ) return;
        return(
            <MessageLine width={'85%'} message={message} typeMessage={typeMessage}/>
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
        loadMktProducts(page);
    }

    return(
        <div id='containerPage'>
            <div id='containerPageIntern'>
                <div id='titleProducts'>Materiais por posto de coleta</div>
                
                <div id='containerInternFindProducts'>
                    
                    {(message !== '' && message !== undefined) && <Message />}

                    <div id='containerFindProducts'>
                        <div id='elementFindProducts'><label id='labelsOthers'>Produto: </label></div>
                        <div id='elementFindProducts'>
                            <select id='selectFindProducts' name='idProduct' value={idProduct} onChange={productFind}>
                                    <option id='selectFindOpt' key={0} value=''>...</option>
                                {products.map((p) => {
                                    return(
                                        <option id='selectFindOpt' key={p.id} value={p.id}>{p.product}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div id='containerFindProducts'>
                        <div id='elementFindProducts'><label id='labelsOthers'>Postos: </label></div>
                        <div id='elementFindProducts'>
                            <select id='selectFindProducts' name='idStation' value={idStation} onChange={stationFind}>
                                <option id='selectFindOpt' key={0} value=''>...</option>
                                {stations.map((s) => {
                                    return(<option id='selectFindOpt' key={s.idStation} value={s.idStation}>{s.nmFantazy}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div id='containerFindProducts'>
                        <div id='elementFindProducts'><label id='labelsOthers'>Ordem: </label></div>
                        <div id='elementFindProducts'>
                            <select id='selectFindProducts' name='sort' value={sort} onChange={sortFind}>
                                <option id='selectFindOpt' value=''>...</option>
                                <option id='selectFindOpt' value='Valor'>Valor</option> 
                                <option id='selectFindOpt' value='Produto'>Produto</option>
                                <option id='selectFindOpt' value='Posto'>Posto de coleta</option>
                            </select>
                        </div>
                    </div>
                    <div id='containerFindProducts'>
                        <div id='elementFindProducts'><button id='btnFindProducts' onClick={find}>Buscar</button></div>
                    </div>
                </div>
                <div id='containerResultFind'>
                    <table id='tbFind'>
                        <thead>
                            <tr>
                                <th id='tbFindTh'>Produto</th>
                                <th id='tbFindTh'>Valor (R$)/Kg</th>
                                <th id='tbFindTh'>Posto de Coleta</th>
                            </tr>
                        </thead>
                        <tbody>
                        {mktProducts.map((p, index) => { 
                            return(
                            <tr id='tbFindTr' style={{'backgroundColor': (index % 2 === 0) ?  '#ECF0F0' : '#FFF'}} key={p.idMktProduct}>
                                <td id='tbFindTd'>{p.product}</td>
                                <td id='tbFindTd'>{p.value.toFixed(2).replace('.', ',')}</td>
                                <td id='tbFindTd50PorCento'>{p.nmFantazy}</td>
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
export default Product;