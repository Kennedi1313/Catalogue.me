import React, { FormEvent, useState } from 'react'

import './styles.css'

import ShopItem from '../../components/ShopItem'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import api from '../../services/api'
import { useParams } from 'react-router-dom'


interface ParamProps {
    shop_id: string
}


function ShopList() {
    const { shop_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    
    window.onload = searchAllItems;
    async function searchAllItems(){
        const item = await api.get('/items', {
            params: {
                shop_id,
            }
        })
        
        setItems(item.data)

        console.log('chegou ')
        console.log(shop_id)
        const shop = await api.get('/shopbyid', {
            params: {
                shop_id,
            }
        })

        setShopName(shop.data[0].name)
    }

    async function searchItems(e: FormEvent) {
        e.preventDefault();
        const response = await api.get('/items', {
            params: {
                shop_id,
                name,
            }
        })

        setItems(response.data)
    }

    return (
        <div id="page-shop-list">
            <PageHeader title={shop_name}>
                <form onSubmit={searchItems} id="search-itens">
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
                            onChange={(e) => {setCategory(e.target.value)}}
                            options={[
                                {value: 'product', label: 'Produto'},
                                {value: 'work', label: 'Serviço'},
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
                    <button type="submit">
                        Buscar
                    </button>
                </form>
            </PageHeader>
            <main>
                <div className="container">
                    {items.map(item => {
                        return (<ShopItem item={item}/>)
                    })}
                </div>
            </main>
        </div>
    )
}

export default ShopList;