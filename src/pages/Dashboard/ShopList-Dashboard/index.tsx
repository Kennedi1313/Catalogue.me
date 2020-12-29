import React, { useEffect, useState } from 'react'

import './styles.css'

import ShopItem from '../ShopItem-Dashboard'
import api from '../../../services/api'
import { Link } from 'react-router-dom'

interface itemProps {
    item : {
        name: string;
        price: number;
        avatar: string,
        info: string;
        category: string;
        id: string;
        shop_id: number;
    }
}

interface ParamProps {
    shop_id: string,
}

const ShopList: React.FC<ParamProps> = ({shop_id}) => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState(['']);
    const [whatsapp, setWhatsapp] = useState('')
    
    useEffect(() => {
        async function searchAllItems(){
            const item = await api.get('/items', {
                params: {
                    shop_id: shop_id,
                }
            })
    
            setItems(item.data.items)
            setCategories(item.data.categories)
    
            const shop = await api.get('/shopbyid', {
                params: {
                    shop_id,
                }
            })
    
            setWhatsapp(shop.data[0].whatsapp)
        }
        searchAllItems();
    }, [shop_id]);

    

    async function handleDeletar(item, index) {
        const avatarData = await api.get('/itemavatarbyid', {
            params: {item_id: item.id}
        })

        api.post('/itemsDelete', 
                {item_id: item.id,
                avatars: avatarData.data.itemsAvatar}, 
             )
            .then((res) => { 
                alert('Item deletado com sucesso') 
                const itensCopy = Array.from(items);
                itensCopy.splice(index, 1);
                setItems(itensCopy);
                return res
            })
            .catch((err) => {
                console.log({err}) 
                return err
            })
    }

    function hadleInativar(item, index){
        item.ativo = false;
        api.post('/itemsInative', 
                    {item}, 
                )
            .then((res) => { 
                alert('Item Inativado com sucesso') 
                const itensCopy = Array.from(items);
                itensCopy.splice(index, 1);
                setItems(itensCopy);
                return res
            })
            .catch((err) => {
                console.log({err}) 
                return err
            })
    }

    return (
        <div id="page-shop-list-dash">
            <main>
                <h1>Itens disponíveis</h1>
                <Link className="botao-alternar" to={'/dashboard/itens-inativos'}>Ver itens arquivados</Link>
                    {categories.map((category: string) => {
                    return(
                        < div key={category}>
                            <h2  className="categoria">{category}</h2>
                            <div className="container">
                                {items.map((item: itemProps["item"], index) => {
                                    if(item.category ===  category)
                                        return ( <ShopItem 
                                                    key={item.id} 
                                                    item={item} 
                                                    whatsapp={whatsapp}
                                                    path="shopList"
                                                    onDelete={() => handleDeletar(item, index)}
                                                    onInative={() => hadleInativar(item, index)}
                                                />)
                                    else return ''
                                }) }

                            </div>
                        </ div>
                    )
                }) }
            </main>
        </div>
    )
}

export default ShopList;