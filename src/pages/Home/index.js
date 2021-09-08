import React, {useEffect, useState} from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';

import './home.css';
import { axiosService } from '../../service/axios';

function Home() {

    const [legendFormat, setLegendFormat] = useState({})
    const [scalesFormat, setScalesFormat] = useState({})
    const [tooltipsNumber, setTooltipsNumber] = useState({})
    const [tooltipsAmount, setTooltipsAmount] = useState({})
    const [dataValue, setDataValue] = useState({labels:[], datasets:[{}]})
    const [dataMaxValue, setDataMaxValue] = useState({labels:[], datasets:[{}]})
    const [dataMaxSize, setDataMaxSize] = useState({labels:[], datasets:[{}]})
    const [dataMaxUpdate, setDataMaxUpdate] = useState({labels:[], datasets:[{}]})
    const [colors] = useState(['#80A51B','#547F82', '#5B7813', '#00AB97','#B9C400'],);
    const [productMaxValue, setProductMaxValue] = useState({
        productValue: '',productName: '', stationName: '',stationState: '',stationCity: ''
    })


    
    useEffect(() => {
        loadInfoProductMaxValueAndStation();
        loadDashProductValue();
        loadDashProductSize();
        loadDashProductUpdate();
        legendFormatter();
        scalesFormatter();
    },[]);

    async function loadDashProductValue() {
        axiosService({
            method:'GET',
            url:'/recycling/mktstuffvalue',
            params:{
                page:0,
                size:3
            }
        }).then(response => {
            let resp = [];
            let maxValues = [];
            let minValues = [];
            let averageValues = [];
            let products = [];
            console.log(response)
            resp = response.data.listRecyclingProductsValue;          
            resp.forEach((p) => {
                maxValues.push(parseFloat(p.maxValue.replace(',', '.')));
                minValues.push(parseFloat(p.minValue.replace(',', '.')));
                averageValues.push(parseFloat(p.averageValue.replace(',', '.')));
                products.push(p.product.product)         
            })
            setDataMaxValue({
                labels:products,
                datasets:[{label: 'valor máximo/Kg', fillStyle: colors, backgroundColor: colors[0], data:maxValues}]
            })
            setDataValue({
                labels:products,
                datasets:[
                    {label: 'valor mínimo/Kg', backgroundColor: '#547F82',data:minValues},
                    {label: 'valor máximo/Kg', backgroundColor: '#B9C400',data:maxValues},
                    {label: 'valor médio/Kg', backgroundColor: '#00AB97',data:averageValues},
                ]
            })
            formatToolTips('amount');           
        }).catch(error => {
        })
    };

    async function loadDashProductSize() {
        axiosService({
            method:'GET',
            url:'/recycling/mktstuffsize',
            params:{
                page:0,
                size:3
            }
        }).then(response => {
            let resp = [];
            let values = [];
            let products = [];
            console.log(response)
            resp = response.data.listRecyclingProductsValue;          
            resp.forEach((p) => {
                values.push(p.countMktProducts);
                products.push(p.product.product)         
            })
            setDataMaxSize({
                labels:products,
                datasets:[{label: 'quantidade', borderWidth:0, backgroundColor: colors, data:values}]
            })
            formatToolTips('number');            
        }).catch(error => {
        })
    };


    async function loadDashProductUpdate() {
        await axiosService({
            method:'GET',
            url:'/recycling/logmktstuffupdate',
            params:{
                page:0,
                size:3
            }
        }).then(response => {
            let resp = [];
            let countLogs = [];
            let products = [];
            console.log(response)
            resp = response.data.listRecyclingProductsValue;          
            resp.forEach((p) => {
                countLogs.push(p.countLogs);
                products.push(p.product.product)         
            })
            setDataMaxUpdate({
                labels:products,
                datasets:[{order:0,label: 'alterações', borderWidth:0, backgroundColor: colors[2], data:countLogs}]
            })
            formatToolTips('number');            
        }).catch(error => {
        })
    };

    async function loadInfoProductMaxValueAndStation() {
        axiosService({
            method:'GET',
            url:'/recycling/mktstuffmaxvalueandstation',
            params:{
                page:0,
                size:1
            }
        }).then(response => {
            let resp = [];
            console.log(response)
            resp = response.data.listRecyclingProductsValue;          
            resp.forEach((p) => {
                debugger;
                setProductMaxValue({
                    productValue: p.maxValue,
                    productName: p.product.product,
                    stationName: p.station.nmFantazy,
                    stationState: p.station.state,
                    stationCity: p.station.city,    
                })
            })    
        }).catch(error => {
        })
    };


    function formatToolTips(type){
        console.log(type)
        if(type === 'amount') {
            setTooltipsAmount({
                callbacks: {            
                    label: function(tooltipItem, data) {
                        var unit = 'R$ ';
                        // var label = data.datasets[tooltipItem.datasetIndex].label;
                        // label = (label) ? label + ': ' + unit + ' ' : ''
                        var num = parseFloat(tooltipItem.value).toFixed(2);
                        return unit + num.toString().replace('.', ',');
                    }
                }
            })
        }
        if(type === 'number') {
            setTooltipsNumber({
                callbacks: {            
                    label: function(tooltipItem, data) {
                        return tooltipItem.value.toString();
                    }
                }
            })
        }
    }

    function legendFormatter() {
        setLegendFormat({display:true, position:'bottom', labels:{boxWidth:12}});
    }

    function scalesFormatter() {
        setScalesFormat({yAxes: [{ticks: { min: 0, stepSize: 0.5} }]});
    }

        
    return(
        <div id='containerPage'>
            <div id='containerPageIntern'>
                <div id='containerBannerHome'>
                    <div id='bannerHome'><img src={require('../../assets/imgs/banner-mapa-da-reciclagem.svg')} alt='banner' id='bannerImg'/></div>
                </div>
                <div id='containerMaxValue'>
                    <div id='containerMaxValueInternLeft'>
                        <div id='titleMaxValueLeft'><strong>Material em alta</strong></div>
                        <div>
                            <div id='txtValueMaxValueLeft'> R$ <strong id='maxValueLeft'>{productMaxValue.productValue.replace('.', ',')}</strong></div>
                            <div id='descProductLeft'><strong style={{fontSize: '18px', textAlign: 'center'}}>{productMaxValue.productName}</strong></div>
                        </div>
                    </div>
                    <div id='containerMaxValueInternRigth'>
                        <div><label id='txtMaxValueRight'>Posto de coleta que paga este valor pelo {productMaxValue.productName}:</label></div>
                        <div><strong id='nameStation'>{productMaxValue.stationName}</strong></div>
                    </div>
                </div>

                <div id='containerDashsLine'>
                    <div id='containerDashIntern'>
                        <div id='titleDash'><strong>Materiais com maior valor pago por Kg</strong></div>
                        <Bar
                            height={200}
                            width={250}
                            data={dataMaxValue}
                            options={{
                                title:{display:true,text:'',fontSize:14},
                                legend: legendFormat,     
                                tooltips: tooltipsAmount,
                                scales: scalesFormat   
                            }}
                        />
                    </div>
                    
                    <div id='containerDashIntern'>
                        <div id='titleDash'><strong>Materiais e valor por Kg</strong></div>
                        <Bar
                            height={200}
                            width={250}
                            data={dataValue}
                            options={{
                                title:{display:true,text:'',fontSize:14},
                                legend:legendFormat,     
                                tooltips: tooltipsAmount,
                                scales: scalesFormat,
                               
                            }}
                        />
                    </div>
                </div>

                <div id='containerDashsLine'>  
                    <div id='containerDashIntern'>
                        <div id='titleDash'><strong>Materiais mais comercializados</strong></div>
                        <Doughnut
                            height={200}
                            width={250}
                            data={dataMaxSize}
                            options={{
                                title:{display:true,text:'',fontSize:14},
                                legend:legendFormat,
                            }}
                        />
                    </div>          
                    <div id='containerDashIntern'>
                        <div id='titleDash'><strong>Mais alterações de valor no mês</strong></div>
                        {dataMaxUpdate.legend !== 0 ? <Bar
                            height={200}
                            width={250}
                            data={dataMaxUpdate}
                            options={{
                                title:{display:true,text:'',fontSize:14},
                                legend:legendFormat,     
                                tooltips: tooltipsNumber,
                                scales:scalesFormat
                            }}
                        /> : null}
                    </div>
                    
                </div>     
            </div>
        </div>
    )
    
}
export default Home;



// console.log(resp)
// resp.map(p => {
//     products.push([
//         p.product.product,
//         parseFloat(p.averageValue.replace(',', '.'))
//     ]);          
// })

// function googleChart() {
//     return(
//             <Chart
//                             width='300px'
//                             height='200px'
//                             chartType="BarChart"
//                             data={data}
//                             options={options, {
//                                 // chartArea: { width: '100%' },
//                                 // chartArea: { width: '50%', height: '70%' },
//                                 title: 'Produtos com maior valor ofertado.',
//                                 width: '200px',
//                                 height: '200px',
//                                 // responsive: true,
//                                 bar: { groupWidth: '50%' },
//                                 colors: ['#DDDF4B', '#2B4748'],
//                                 // titlePosition: 'in',
//                                 // axisTitlesPosition: 'in',
//                                 // hAxis: {textPosition: 'in'}, vAxis: {textPosition: 'in'},    
//                                 legend: {position: 'bottom', textStyle: {color: '#2B4748', fontSize: 10}},
//                                 hAxis: {format: 'currency'},
//                                 // hAxis: {format: 'R$#,##',},
//                                 // legend: {display: false}
//                                 // legend: { width: '10%' },
//                                 // isStacked: true,
                                
//                             }}
//                             rootProps={{ 'data-testid': '3' }}
//                         />
//     )
// }