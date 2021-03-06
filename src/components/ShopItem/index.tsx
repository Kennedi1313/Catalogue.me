import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

interface itemProps {
    item: {
        name: string,
        price: number,
        avatar: string,
        info: string,
        category: string,
        id: string,
        shop_id: number,
    },
    whatsapp: string,
    path: string,
    onDelete?,
    onInative?,
    onAtive?,
    shop_tag: string
}

const ShopItem: React.FC<itemProps> = ( { item, whatsapp, onDelete, onInative, onAtive, path, shop_tag } ) => {
    var avatar_url = ''
    var default_url = '/uploads/default.png'
    var avatar_s3 = 'https://upload-catalogueme.'
    var isS3 = false
    
    if(item.avatar) {
        if(item.avatar.match(avatar_s3)){
            isS3 = true
        } else {
            avatar_url = item.avatar.substring(6, item.avatar.length)
        }
        
    }

    var nomeExibido = item.name;

    return (
        <article className="shop-item">
            <Link to={'/'+shop_tag+'/item/'+item.id}>
                <header>
                <img src={ isS3 ? item.avatar : ( item.avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>
                    <div>
                        <strong>{nomeExibido}</strong>
                    </div>
                </header>
            </Link>
                <footer>
                    <p>
                        Preço: 
                        <strong>R$ {item.price}</strong>
                    </p>
                </footer>
        </article>
    )
}

export default ShopItem;