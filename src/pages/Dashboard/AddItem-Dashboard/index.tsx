import React, { FormEvent, useContext, useState } from 'react'
import './styles.css'

import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Select from '../../../components/Select';
import api from '../../../services/api';
import StoreContext from '../../../components/Store/Context';



const AddItem: React.FC = () => {
    const { user } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('Produto')
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState('')

    function resetFormState() {
        setName('');
        setPrice('');
        setAvatar('');
        setInfo('');
    }

    function onChangeHandler (event) {
        setAvatar(event.target.files[0])
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        
        const user_id = user.id

        const formData = new FormData();

        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("avatar", avatar);
        formData.append("info", info);

        api.post('/items', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then((res) => {
            console.log(res)
            setLoading(false);
            alert('Cadastro realizado com sucesso. ')
            resetFormState();
        }).catch((e) => {
            setLoading(false);
            alert(['Erro no cadastro. Verifique se todos os campos foram preenchidos. '])
        })
    }

    return (
         
        <div id="page-item-form" >
            <main>
                <h1>Cadastro de Item</h1>
                
                <form onSubmit={handleCreate}>
                <fieldset className="add-item">
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
                        accept="image/*"
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
                {!loading ?
                <footer>
                    <p>Importante! <br /> Preencha todos os dados.</p>
                    <button>Salvar</button>
                </footer>
                : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />}
                </form>
                
            </main>
        </div> 
        
    )
}

export default AddItem;