import React, {useState, useEffect} from 'react';

import './paginator.css';


function Paginator(props){

    const [page, setPage] = useState(props.page)
    const [totalPages] = useState(props.totalPages)
    const [lengthPages] = useState(props.lengthPages)
    // const [pages, setPages] = useState([])
    const [pagesSegment, setPagesSegment] = useState([])


  useEffect(() => {
    loadPages(props.page, props.totalPages);
  },[])


    async function loadPages(page, totalPages) {
        debugger;
        let pages = [];
        let segment = [];
        let pg = page + 1;
        let length = lengthPages - 1;
        for(let i = 1; i < totalPages + 1; i++) {
            pages.push(i);
        }
        
        segment = pages.slice(pg-length >= 0 ? pg-length : 0, pg+length <= pages.length ? pg+length : pages.length);    
        
        if(segment.length >= props.lengthPages) {
            segment = segment.slice(0,lengthPages);
        }
        // setPages(pages);     
        setPagesSegment(segment);
        console.log(segment);
    }

    function changePage(page){
        debugger;
        let segment = [];
        let pages = [];
        for(let i = 1; i < props.totalPages + 1; i++) {
            pages.push(i);
        }
        let quantExibPages = lengthPages;
        let init = (page - (quantExibPages-1) >= 0) ? page - (quantExibPages-1) : 0;
        let limit = (init + quantExibPages < pages.length) ? init + quantExibPages : pages.length;
        page = page - 1;
        page = (page > totalPages) ? totalPages-1 : page;
        page = (page <= 0) ? 0 : page;
        segment = pages.slice(init, limit);
        if(limit === pages.length && (limit - quantExibPages) >= 0) {
            segment = pages.slice(limit-quantExibPages, limit);
        }
        setPage(page);     
        setPagesSegment(segment);
        props.callbackParent(page)

    }

    function leftPage(page) {
        console.log(page);
        if(page - 1 >= 0) {
            let nextPage = page;
            changePage(nextPage)
        }
    }

    function rightPage(page) {
        console.log(page);
        console.log(totalPages);
        debugger;
        let pages = [];
        for(let i = 1; i < props.totalPages + 1; i++) {
            pages.push(i);
        }
        if(page + 2 > 0 && page + 2 < pages.length+1) {
            let nextPage = page + 2;
            changePage(nextPage)
        }
    }

    return(
        <div id='paginator'>
        <div id='div-arrow-left'> {(page <= 0) ?
            <img src={require('../../assets/imgs/seta-left-opac.svg')} alt='seta-left' /> :
            <img src={require('../../assets/imgs/seta-left.svg')} alt='seta-left'
                        onClick={() => leftPage(page)}/>}
        </div>
            <div id='numbersPages'>{pagesSegment.map((p) => {
                return(<div key={p} id='numPage' onClick={() => changePage(p)}
                    style={{backgroundColor: (p === page + 1) ?
                    '#DDD': 'transparent'}}>{p}
                    </div>)})}
            </div>      
        <div id='div-arrow-right'>{(page + 1 >= props.totalPages) ?
            <img src={require('../../assets/imgs/seta-right-opac.svg')} alt='seta-right' /> :
            <img src={require('../../assets/imgs/seta-right.svg')} alt='seta-right'
                        onClick={() => rightPage(page)}/>}
        </div>
    </div>
    )
    
   
}
export default Paginator;
