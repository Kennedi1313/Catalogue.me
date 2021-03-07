import React, { FormEvent, useContext, useState } from 'react'
import './styles.css'
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Select from '../../../components/Select';
import api from '../../../services/api';
import StoreContext from '../../../components/Store/Context';
import imageCompression from 'browser-image-compression';
import { DeleteOutlineRounded } from '@material-ui/icons'
import { AddCircleOutlineRounded } from '@material-ui/icons'

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
    const [category, setCategory] = useState('')
    const [avatar, setAvatar] = useState<File>()
    const [info, setInfo] = useState('')
    const [infoLength, setInfoLength] = useState(600);
    const [ itemOptions, setItemOptions ] = useState([
        { label: '' }
    ]);
    const [optionLabel, setOptionLabel] = useState('');

    function addNewItemOptions() {
        
        if(itemOptions.length === 0 || itemOptions[0].label === '') {
            setItemOptions([{ label: optionLabel }])
        } else {
            setItemOptions([
                ...itemOptions, 
                { label: optionLabel }
            ]);
        }
        
        setOptionLabel('');
    }

    function deleteItemOptions(label: string){
        const updatedItemOptions = itemOptions.filter(function(itemOptions) {
            if ( itemOptions.label === label ) {
                return false;
            }

            return true;
            
        }).map( (itemOptions ) => {
            return itemOptions;
        });

        setItemOptions(updatedItemOptions);
        
    }

    function resetFormState() {
        setName('');
        setPrice('');
        setInfo('');
        setItemOptions([
            { label: '' }
        ]);
    }

    async function onChangeHandler(event) {
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
      
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      
          setAvatar(compressedFile)
        } catch (error) {
          console.log(error);
        }
      
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
        formData.append("avatar", avatar as File);
        formData.append("info", info);
        formData.append("options", JSON.stringify(itemOptions))


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

                <fieldset>
                    <legend>
                        Opções adicionais
                    </legend>
                    <div className="new-option">
                        <Input name="label" label="Opção" type="text" value={optionLabel} onChange={ e => setOptionLabel(e.target.value) }/>
                        <button type="button" onClick={ addNewItemOptions }> <AddCircleOutlineRounded style={{ fontSize: '40' }}/> </button>    
                    </div>
                            
                    { itemOptions.map((itemOptions, index) => {
                        return (
                            itemOptions.label !== '' ?
                                <div key={ itemOptions.label } className="item-options">
                                    <span>{itemOptions.label}</span>
                                    <button type="button" onClick={e => deleteItemOptions(itemOptions.label)}><DeleteOutlineRounded style={{ fontSize: '30' }}/></button>
                                </div>
                            : null
                        );
                    })}
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