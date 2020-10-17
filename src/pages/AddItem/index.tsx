import React, { FormEvent, useContext, useState } from 'react'
import './styles.css'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import api from '../../services/api';
import StoreContext from '../../components/Store/Context';



function AddItem() {
    const { user } = useContext(StoreContext);

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState('')

    function resetFormState() {
        setName('');
        setPrice('');
        setCategory('');
        setAvatar('');
        setInfo('');
    }

    function onChangeHandler (event) {
        setAvatar(event.target.files[0])
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        
        const user_id = user.id

        const formData = new FormData();

        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("avatar", avatar);
        formData.append("info", info);

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
        <div id="page-item-form" className="container">
            <PageHeader 
            title="Formulário de Cadastro" 
            description="Cadastre aqui algumas informações sobre o item que estará na sua loja."/>
            
            <main>
                <form onSubmit={handleCreate}>
                <fieldset>
                    <legend>Dados do Item</legend>
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
                    <Input 
                        name="price" 
                        label="Preço" 
                        type="number" 
                        value={price}
                        onChange={(e) => {setPrice(e.target.value)}}
                    />
                    <Input 
                        name="avatar" 
                        label="Foto" 
                        type="file" 
                        className="imagem-avatar" 
                        onChange={onChangeHandler}
                    />
                    <Textarea 
                        name="info" 
                        label="Descrição" 
                        value={info}
                        onChange={(e) => {setInfo(e.target.value)}}
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

export default AddItem;