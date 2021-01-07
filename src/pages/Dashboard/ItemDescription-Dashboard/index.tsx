import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import './styles.css'
import {Carousel} from 'react-bootstrap'
import Textarea from '../../../components/Textarea';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import StoreContext from '../../../components/Store/Context';

interface ParamProps {
    item_id: string,
}

function ItemDescription(){
    const { item_id } = useParams<ParamProps>();
    const { user } = useContext(StoreContext);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState([
        {
            id: 0,
            avatar: "string",
            item_id: 0
        }
    ]);
    const [category, setCategory] = useState('Produto');
    const [info, setInfo] = useState('');
    const [price, setPrice] = useState('');
    const [itemAvatar, setItemAvatar] = useState('');
    const [avatarInp, setAvatarInp] = useState('');
    const [infoLength, setInfoLength] = useState(600);
    const [loading, setLoading] = useState(false);
    const [labelInput, setLabelInput] = useState('');

    function resetFormState() {
        setAvatarInp('');
    }

    useEffect(() => {
        async function getItem() {
            const res = await api.get('/itembyid', { 
                params: { item_id } 
            })
            setName(res.data[0].name)
            setInfo(res.data[0].info)
            setPrice(res.data[0].price)
            setCategory(res.data[0].category)
            setItemAvatar(res.data[0].avatar)

            const avatarData = await api.get('/itemavatarbyid', {
                params: {item_id}
            })
            setAvatar(avatarData.data.itemsAvatar)
        }
        getItem();
    }, [item_id, avatarInp]);

    function onChangeHandler (event) {
        setAvatarInp(event.target.files[0])
        setLabelInput(event.target.files[0].name)
    }

    function handlerMudarAvatar(item_id, avatar) {
        api.post('avatar-change', {
            avatar,
            item_id
        }).then((res) => { 
            setAvatarInp("mudado");
            resetFormState();
            window.location.reload(); 
            alert('Essa imagem agora é a capa do item!') 
        })
        .catch((err) => {
            alert('Opa, algo deu errado.')
        })
    }

    function handlerDeletarAvatar(id, avatar) {
        api.post('avatar-delete', {
            avatar,
            id
        }).then((res) => { 
            setAvatarInp("deletado");
            resetFormState();
            window.location.reload(); 
            alert('Deletada com sucesso!') 
        })
        .catch((err) => {
            alert('Opa, algo deu errado.')
        })
    }

    function handleEdit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const user_id = user.id

        const formData = new FormData();
        formData.append("item_id", item_id);
        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("info", info);

        api.post('/items-edit', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then((res) => {
            console.log(res)
            setLoading(false);
            alert('Atualizado com sucesso. ')
            resetFormState();
        }).catch((e) => {
            setLoading(false);
            alert(['Erro no cadastro. Verifique se todos os campos foram preenchidos. '])
        })
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_id", item_id);
        formData.append("avatar", avatarInp);

        api.post('/avatar', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then((res) => {
            console.log(res)
            resetFormState();
            alert('Cadastro realizado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
    }

    var avatar_url = ''
    var default_url = '/uploads/default.png'
    var avatar_s3 = 'https://upload-catalogueme.'
    var isS3 = false
    
    avatar.forEach(({avatar})=> {
        
        if(avatar.substring(0, avatar_s3.length) === avatar_s3){
            isS3 = true
        } else {
            avatar_url = avatar.substring(6, avatar.length)
        }
        
    });
    return (
        <div id="item-description-dashboard">
            <h1>Gerenciar Item</h1>
            <article className="item-dashboard">
                
                <header>
                    <Carousel pause="hover" fade={true} interval={5000} keyboard={true}>
                        {avatar.map(({avatar, id, item_id}) => {
                            return (
                                    <Carousel.Item key={avatar} className="carousel-item-dashboard">
                                        <button disabled={avatar === itemAvatar} onClick={() => handlerMudarAvatar(item_id, avatar)} className="mudar-avatar">{avatar !== itemAvatar ? "Tornar Capa" : "Capa"}</button>
                                        <button onClick={() => handlerDeletarAvatar(id, avatar)} className="deletar-avatar">Deletar</button>
                                        <img src={ isS3 ? avatar : ( avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>  
                                        
                                    </Carousel.Item>
                                )
                        }) }
                        
                    </Carousel>
                    <div className="info">
                        <form onSubmit={handleEdit}>

                            <fieldset>
                                <Input 
                                    name="name" 
                                    label="Nome" 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => {setName(e.target.value)}}
                                />

                                <Select 
                                    name="category" 
                                    label="Categoria" 
                                    value={category}
                                    onChange={(e) => {setCategory(e.target.value)}}
                                    options={[
                                        {value: 'Produto', label: 'Produto'},
                                        {value: 'Serviço', label: 'Serviço'},
                                    ]} 
                                />

                                <Textarea 
                                    name="info" 
                                    label={'Descrição (caracteres restantes: '+ infoLength +')'} 
                                    value={info}
                                    maxLength={600}
                                    onChange={(e) => {setInfo(e.target.value); setInfoLength(600 - info.length)}}
                                />
                                
                                <footer>
                                    <Input 
                                        name="price" 
                                        label="Preço" 
                                        type="number" 
                                        value={price}
                                        onChange={(e) => {setPrice(e.target.value)}}
                                    />
                                </footer>

                                {!loading ?
                            
                                    <button type="submit">Salvar</button>
                                
                                : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading" />}
                            </fieldset>
                           
                        </form>
                    </div>
                </header>
                
                <form onSubmit={handleCreate}>
                    <fieldset className="add-image">
                        <legend>Adicionar nova imagem</legend>
                        <label id="label-file" htmlFor="arquivo">{labelInput ? labelInput : 'Selecionar imagem'}</label>
                        <input 
                            name="avatar" 
                            type="file" 
                            id="arquivo"
                            accept="image/x-png,image/gif,image/jpeg"
                            className="imagem-avatar" 
                            onChange={onChangeHandler}
                        />
                        <button>Adicionar</button>
                    </fieldset>
                </form>
                
                
            </article>
        </div>
    )
}

export default ItemDescription;