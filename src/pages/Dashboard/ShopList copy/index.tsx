import React, { useState } from 'react'

import './styles.css'

import ShopItem from '../../../components/ShopItem'


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
    const [items ] = useState(item);

    return (
        <div id="page-shop-list">
            
            <main>

                <h1>Seus produtos</h1>

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