import React, { FormEvent, useContext, useState } from 'react'
import './styles.css'
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Select from '../../../components/Select';
import api from '../../../services/api';
import StoreContext from '../../../components/Store/Context';
import Compress from 'compress.js'

interface Props {
    categories: {
        value: string,
        label: string,
    }[]
}

const AddItem: React.FC<Props> = ({categories}) => {
    const { user } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('Produto')
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState('')
    const [infoLength, setInfoLength] = useState(600);

    function resetFormState() {
        setName('');
        setPrice('');
        setAvatar('');
        setInfo('');
    }

    const compress = new Compress()

    async function resizeImageFn(file) {

        const resizedImage = await compress.compress([file], {
          size: 2, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 500, // the max width of the output image, defaults to 1920px
          maxHeight: 500, // the max height of the output image, defaults to 1920px
          resize: true // defaults to true, set false if you do not want to resize the image width and height
        })
        const img = resizedImage[0];
        const base64str = img.data
        const imgExt = img.ext
        const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
        
        return resizedFiile;
    }

    async function onChangeHandler (event) {
        const image = await resizeImageFn(event.target.files[0])
        setAvatar(image)
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
                        options={categories} 
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
                        label="Imagem de Capa (mais imagens poderão ser adicionadas após a criação do item)" 
                        type="file" 
                        accept="image/*"
                        className="imagem-avatar" 
                        onChange={onChangeHandler}
                    />
                    <Textarea 
                        name="info" 
                        label={'Descrição (caracteres restantes: '+ infoLength +')'} 
                        value={info}
                        maxLength={600}
                        onChange={(e) => {setInfo(e.target.value); setInfoLength(600 - info.length)}}
                    />
                    
                </fieldset>
                {!loading ?
                <footer>
                    <p>Importante! <br /> Preencha todos os dados.</p>
                    <button>Salvar</button>
                </footer>
                : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading"/>}
                </form>
                
            </main>
        </div> 
        
    )
}

export default AddItem;