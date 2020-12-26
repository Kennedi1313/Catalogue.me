import React, { FormEvent, useEffect, useState } from 'react'
import './styles.css'

import Input from '../../../components/Input';
import api from '../../../services/api';
import { useParams } from 'react-router-dom';

interface ParamProps {
    item_id: string
}

function AddAvatar() {
    const { item_id } = useParams<ParamProps>();
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState('')

    function resetFormState() {
        setAvatar('');
    }

    useEffect(() => {
        async function getItem() {
            const res = await api.get('/itembyid', { 
                params: { item_id } 
            })
    
            setName(res.data[0].name)
            setAvatar(res.data[0].avatar)
            setInfo(res.data[0].info)
            setPrice(res.data[0].price)
        }
        getItem()
    }, [item_id]);

    function onChangeHandler (event) {
        setAvatar(event.target.files[0])
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_id", item_id);
        formData.append("avatar", avatar);

        api.post('/avatar', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then((res) => {
            console.log(res)
            alert('Cadastro realizado com sucesso. ')
            resetFormState();
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
    }

    return (
        <div id="page-avatar-form">
            <main>
                <h1>Cadastro de Imagem</h1>
                <form onSubmit={handleCreate}>
                <fieldset>
                    <legend>Dados do Item</legend>
                    <p>Nome: {name}</p>
                    <br/>
                    <p>Descrição: {info}</p>
                    <br/>
                    <p>Preço: {price}</p>
                    <Input 
                        name="avatar" 
                        label="Foto" 
                        type="file" 
                        className="imagem-avatar" 
                        onChange={onChangeHandler}
                    />
                </fieldset>

                <footer>
                    <p>Importante! <br /> Preencha todos os dados.</p>
                    <button>Salvar</button>
                </footer>
                </form>
            </main>
        </div>
    )
}

export default AddAvatar;