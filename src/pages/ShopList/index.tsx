import React, { useEffect, useState } from 'react'

import './styles.css'

import ShopItem from '../../components/ShopItem'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import api from '../../services/api'
import { useParams } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/SearchOutlined';

interface ParamProps {
    shop_id: string
}

interface itemProps{
    item: {
        name: string;
        price: number;
        avatar: string;
        info: string;
        category: string;
        id: string;
        shop_id: number;
    }
}

function ShopList() {
    const { shop_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [whatsapp, setWhatsapp] = useState('')
    const [category, setCategory] = useState('');
    const [arrayCategory, setArrayCategory] = useState(['Produto', 'Serviço']);
    const [totalItens, setTotalItens] = useState(0);
    const [limit, setLimit] = useState(8);
    const [pages, setPages] = useState([0]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function searchAllItems(){
            const item = await api.get('/items', {
                params: {
                    shop_id,
                    name,
                    category,
                    price,
                    page: currentPage,
                    limit: limit,
                }
            })
            setTotalItens(parseInt(item.headers["x-content-length"]));
            setArrayCategory(item.data.categories)
            setItems(item.data.items)

            const totalPages = Math.ceil(totalItens / limit);
            
            var arrayPages: number[] = [];
            for(let i = 1; i <= totalPages; i++ ){
                arrayPages.push(i);
            }
            setPages(arrayPages)

            const shop = await api.get('/shopbyid', {
                params: {
                    shop_id,
                }
            })

            setShopName(shop.data[0].name)
            setWhatsapp(shop.data[0].whatsapp)
        }
        searchAllItems();
    }, [currentPage, limit, shop_id, totalItens, category, name, price]);
    
    return (
        <div id="page-shop-list">
            <PageHeader title={shop_name}>
                <h4>Pesquisar {<SearchIcon/>}</h4>
                <form id="search-itens">
                    <Input 
                        name="name" 
                        label="Nome" 
                        type="text"
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                    <div className="selects">
                        <Select 
                            name="category" 
                            label="Categoria" 
                            value={category}
                            onChange={(e) => { setCategory(e.target.value)}}
                            options={[
                                {value: 'all', label: 'Todas'},
                                {value: 'Produto', label: 'Produto'},
                                {value: 'Serviço', label: 'Serviço'},
                            ]} 
                        />
                        <Select 
                            name="price" 
                            label="Preço" 
                            value={price}
                            onChange={(e) => {setPrice(e.target.value)}}
                            options={[
                                {value: 'desc', label: 'Maior para Menor'},
                                {value: 'cres', label: 'Menor para Maior'},
                            ]} 
                        />
                    </div>
                </form>

            </PageHeader>
            <main>
                {arrayCategory.map((category: string) => {
                    return(
                        <div key={category}>
                            <h2 className="categoria">{category}</h2>
                            <div className="container">
                                {items.map((item: itemProps["item"]) => {
                                    if(item.category ===  category)
                                        return ( <ShopItem key={item.id} path="shopList" whatsapp={whatsapp} item={item}/> )
                                    else return ''
                                }) }

                            </div>
                        </div>
                    )
                }) }

                <div className="pagination">
                    Mostrando {limit} itens de {totalItens} 
                    
                    <div className="pagination-button">
                        {currentPage > 1 && (
                            <button onClick={() => setCurrentPage(currentPage - 1)} className="prev">Anterior</button>
                        )}
                    
                        {pages.map(page => (
                            page === currentPage ? 
                            <div key={page} onClick={() => setCurrentPage(page)} className="pagination-item-selected">
                                {page}
                            </div>
                            : 
                            <div key={page} onClick={() => setCurrentPage(page)} className="pagination-item">
                                {page}
                            </div>
                        ))
                        }     
                        {currentPage < pages.length && (
                            <button onClick={() => setCurrentPage(currentPage + 1)} className="next">Próxima</button> 
                        )}      
                    </div>
                </div>
               
            </main>
        </div>
    )
}

export default ShopList;