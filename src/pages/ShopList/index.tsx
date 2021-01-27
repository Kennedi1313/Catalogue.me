import React, { useEffect, useState } from 'react'

import './styles.css'
import Helmet from 'react-helmet'
import ShopItem from '../../components/ShopItem'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import api from '../../services/api'
import { Link, useParams } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/SearchOutlined';
import whatsappIcon from '../../assets/images/whatsappIcon.png'

interface ParamProps {
    shop_tag: string
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
    const { shop_tag } = useParams<ParamProps>();
    const [shopId, setShopId] = useState('');
    const [shop_name, setShopName] = useState('');
    const [shopBio, setShopBio] = useState('');
    const [shopLogo, setShopLogo] = useState('');
    const [shopColor, setShopColor] = useState('');
    const [shopTextColor, setShopTextColor] = useState('');
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [whatsapp, setWhatsapp] = useState('')
    const [category, setCategory] = useState('all');
    const [arrayCategory, setArrayCategory] = useState(['Produto', 'Serviço']);
    const [totalItens, setTotalItens] = useState(0);
    const [limit, setLimit] = useState(8);
    const [pages, setPages] = useState([0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function searchShop(){
            const shop = await api.get('/shopbytag', {
                params: {
                    shop_tag,
                }
            });
            setShopId(shop.data[0].id);
            setShopName(shop.data[0].name);
            setWhatsapp(shop.data[0].whatsapp);
            setShopBio(shop.data[0].bio);
            setShopLogo(shop.data[0].logo);
            setShopColor(shop.data[0].color);
            setShopTextColor(shop.data[0].color_text);
        }
        
        setLimit(8);
        
        searchShop();
    }, [shop_tag]);

    useEffect(() => {
        async function searchAllItems(){

            const categories = await api.get('/categories', {params: {shop_id: shopId}})

            setArrayCategory(categories.data)

            const item = await api.get('/items', {
                params: {
                    shop_id: shopId,
                    name,
                    category,
                    price,
                    page: currentPage,
                    limit: limit,
                }
            })
            setTotalItens(parseInt(item.headers["x-content-length"]));
            setItems(item.data.items)

            const totalPages = Math.ceil(totalItens / limit);
            var arrayPages: number[] = [];
            for(let i = 1; i <= totalPages; i++ ){
                arrayPages.push(i);
            }
            setPages(arrayPages)
            setLoading(false);
        }
        searchAllItems();
    }, [currentPage, limit, totalItens, category, name, price, shopId]);
    
    return (
        <div id="page-shop-list">
            <Helmet>
                <title>{shop_name} - Catálogo virtual by Catalogue.me</title>
                <link rel="canonical" href={'http://catalogueme.store/'+shopId} />
                <meta name="description" content="Bem vindo(a) a minha loja virtual!" />
            </Helmet>
            <PageHeader title={shop_name} description={shopBio} color={shopColor} colorText={shopTextColor} logo={shopLogo && shopLogo}>
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
                
                {!loading ? 
                    <>
                        {arrayCategory.length > 1 ?
                        <div className="category">
                            <a onClick={() => {setCategory('all'); setCurrentPage(1)}} style={category === 'all' ? {backgroundColor: 'grey'} : {}} >Todas</a>
                            {arrayCategory.map((categoryButton) => {
                                return(
                                    <a key={categoryButton} onClick={() => {setCategory(categoryButton); setCurrentPage(1)}} style={categoryButton === category ? {backgroundColor: 'grey'} : {}} >{categoryButton}</a>  
                                )
                            })}
                        </div> : ''}
                        <h2 className="categoria">{category !== 'all' ? category : ''}</h2>
                        <div className="container">
                            {items.map((item: itemProps["item"]) => {
                                return ( <ShopItem key={item.id} shop_tag={shop_tag} path="shopList" whatsapp={whatsapp} item={item}/> )
                            }) }

                        </div>
                    </>
                    
                : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading" />}

                <div className="pagination">
                    Foram encontrados {totalItens} itens
                    
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
            <footer id="footer-shop">
                <div className="contato">
                    <p>Alguma dúvida sobre essa loja?</p>
                    <p>Fale com {shop_name} através do whatsapp: </p>
                    <a target="_blank" rel="noopener noreferrer" href={'https://wa.me/+55' + whatsapp }>
                        <img src={whatsappIcon} alt="whatsapp"/>
                        Entrar em contato
                    </a>
                </div>
                <div className="divulgue">
                        <p>Gostou desse Catálogo Virtual? Ele é 100% online e grátis! Faça seu cadastro no botão abaixo e confira:</p>
                        <Link to="/user/form"> Crie sua loja virtual </Link>
                    </div>
                
            </footer>
        </div>
    )
}

export default ShopList;