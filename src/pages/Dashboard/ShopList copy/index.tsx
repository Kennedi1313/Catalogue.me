import React, { FormEvent, useState } from 'react'

import './styles.css'

import ShopItem from '../../../components/ShopItem'
import Input from '../../../components/Input'
import PageHeader from '../../../components/PageHeader'
import Select from '../../../components/Select'
import api from '../../../services/api'


interface ParamProps {
    shop_id: string,
    shop_name: string,
    item: [{
        name: string;
        price: number;
        avatar: string;
        info: string;
        category: string;
        id: number;
        shop_id: number;
    }],
}

const ShopList: React.FC<ParamProps> = ({shop_id, shop_name, item}) => {
    const [items, setItems] = useState(item);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

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
            
            <main>

                <h2><h1>Seus produtos</h1></h2>

                <div className="container">
                    {items.map(item => {
                        return (<ShopItem key={item.id} item={item}/>)
                    })}
                </div>
            </main>
        </div>
    )
}

export default ShopList;