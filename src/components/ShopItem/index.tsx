import React from 'react'

import whatsappIcon from '../../assets/images/whatsappIcon.png'



import './styles.css'

interface itemProps {
    item: {
        name: string,
        price: number,
        avatar: string,
        info: string,
        category: string,
        id: number,
        shop_id: number,
    }
}

const ShopItem: React.FC<itemProps> = ( { item } ) => {
    var avatar_url = ''
    var default_url = '/uploads/default.png'

    if(item.avatar) {
        avatar_url = item.avatar.substring(6, item.avatar.length)
    }
    
    return (
        <article className="shop-item">
            <a href={'/shop/'+item.shop_id+'/item/'+item.id}>
                <header>
                    <img src={ item.avatar !== '' ? 'http://localhost:3333/' + avatar_url : 'http://localhost:3333/' + default_url} alt="ps5"/>
                    <div>
                        <strong>{item.name}</strong>
                    </div>
                </header>
                <footer>
                    <p>
                        Preço: 
                        <strong>R$ {item.price}</strong>
                    </p>
                    <button type="button">
                        <img src={whatsappIcon} alt="whatsapp"/>
                        Entrar em contato
                    </button>
                </footer>
            </a>
        </article>
    )
}

export default ShopItem;