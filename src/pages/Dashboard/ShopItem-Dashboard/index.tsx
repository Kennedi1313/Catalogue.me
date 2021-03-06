import { Switch } from '@material-ui/core'
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
        ativo: boolean,
    },
    path: string,
    onDelete?,
    onInative?,
    onAtive?
}

const ShopItem: React.FC<itemProps> = ( { item, onDelete, onInative } ) => {
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

    if(nomeExibido.length > 35) {
        nomeExibido = nomeExibido.substring(0, 35) + ' [...] ';
    }

    return (
        <article className="shop-item">
            <Link to={'/dashboard/admin/item/'+item.id}>
                <header>
                
                <img src={ isS3 ? item.avatar : ( item.avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>
                    
                </header>
            </Link>
                <footer>
                <div>
                    <strong>{nomeExibido}</strong>
                </div>
                    <p>
                        Preço: 
                        <strong>R$ {item.price}</strong>
                    </p>
                    {   
                        <div className="buttons">
                            <p style={{alignSelf: 'center'}}>Ativo</p>
                            <Switch className="indisponivel" color="primary" checked={item.ativo} onClick={onInative}></Switch>
                            
                        </div>   
                    }
                </footer>
        </article>
    )
}

export default ShopItem;