import React, { useContext } from 'react'
import StoreContext from '../Store/Context'
import whatsappIcon from '../../assets/images/whatsappIcon.png'
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
    onDelete?,
    onInative?
}

const ShopItem: React.FC<itemProps> = ( { item, whatsapp, onDelete, onInative } ) => {
    const { user } = useContext(StoreContext)
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

    return (
        <article className="shop-item">
            <a href={'/shop/'+item.shop_id+'/item/'+item.id}>
                <header>
                <img src={ isS3 ? item.avatar : ( item.avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>
                    <div>
                        <strong>{item.name}</strong>
                    </div>
                </header>
                </a>
                <footer>
                    <p>
                        Preço: 
                        <strong>R$ {item.price}</strong>
                    </p>
                    {
                        !!user 
                        ?    
                            <>
                                <button type="button" className="deletar" onClick={onDelete}>Deletar</button>
                                <button type="button" className="indisponivel" onClick={onInative}>Indisponível</button>
                            </>
                            
                        
                        :   <a target="_blank" rel="noopener noreferrer" href={'https://wa.me/+55' + whatsapp }>
                                <img src={whatsappIcon} alt="whatsapp"/>
                                Entrar em contato
                            </a>
                    }
                </footer>
        </article>
    )
}

export default ShopItem;