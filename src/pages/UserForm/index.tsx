import React, { FormEvent, useState } from 'react'

import './styles.css'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import api from '../../services/api';
import { useHistory } from 'react-router-dom'



function UserForm() {
    const history = useHistory();
    
    const [user_name, setUserName] = useState('')
    const [user_whatsapp, setUserWhatsapp] = useState('')
    const [user_email, setUserEmail] = useState('')
    const [user_passwd, setUserPasswd] = useState('')

    const [shop_name, setShopName] = useState('')
    const [shop_whatsapp, setShopWhatsapp] = useState('')
    const [shop_avatar, setShopAvatar] = useState('')
    const [shop_bio, setShopBio] = useState('')

    const [scheduleItems, setScheduleItem] = useState([
        { week_day: 1, from: '', to: ''},
        { week_day: 2, from: '', to: ''},
        { week_day: 3, from: '', to: ''},
        { week_day: 4, from: '', to: ''},
        { week_day: 5, from: '', to: ''},
    ]);

    function onChangeHandler (event) {
        setShopAvatar(event.target.files[0])
    }

    function addNewScheduleItem() {
        setScheduleItem([
            ...scheduleItems,
            { week_day: 0, from: '', to: ''}
        ]);
    }

    function handleCreateShop(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user_name', user_name)
        formData.append('user_whatsapp', user_whatsapp)
        formData.append('user_email', user_email)
        formData.append('user_passwd', user_passwd)

        formData.append('shop_name', shop_name)
        formData.append('shop_whatsapp', shop_whatsapp)
        formData.append('shop_avatar', shop_avatar)
        formData.append('shop_bio', shop_bio)

        formData.append('schedule_JSON', JSON.stringify(scheduleItems))

        api.post('/shops', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then(() => {
            alert('Cadastro realizado com sucesso. ')
        }).then(() => {
            history.push('/login')
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })

        console.log({
            formData,
            scheduleItems
        })
    }

    function setScheduleItemValue(position: number, field: string, value: string){
        const newArray = scheduleItems.map((scheduleItem, index) => {
            if(index === position) {
                return { ...scheduleItem, [field]: value }
            }

            return scheduleItem
        })
        setScheduleItem(newArray)
    }

    return (
        <div id="page-user-form" className="container">
            <PageHeader 
            title="Formulário de Cadastro" 
            description="Primeiro precisamos de algumas informações sobre você e seu trabalho."/>
            
            <main>
                <form onSubmit={handleCreateShop}>
                    <fieldset>
                        <legend>Seus dados</legend>
                        <Input 
                            name="user_name" 
                            label="Nome" 
                            type="text" 
                            value={user_name} 
                            onChange={(e)=>{setUserName(e.target.value)}}>
                        </Input>
                        <Input 
                            name="user_whatsapp" 
                            label="Whatsapp" 
                            type="text" 
                            value={user_whatsapp} 
                            onChange={(e)=>{setUserWhatsapp(e.target.value)}}>
                        </Input>
                        <Input 
                            name="email" 
                            label="Email" type="text"
                            value={user_email} 
                            onChange={(e)=>{setUserEmail(e.target.value)}}>
                        </Input>
                        <Input 
                            name="passwd" 
                            label="Senha" 
                            type="password"
                            value={user_passwd} 
                            onChange={(e)=>{setUserPasswd(e.target.value)}}>
                        </Input>
                    </fieldset>

                    <fieldset>
                        <legend>Sobre seu trabalho</legend>
                        <Input 
                            name="shop_name" 
                            label="Nome" 
                            type="text" 
                            value={shop_name} 
                            onChange={(e)=>{setShopName(e.target.value)}}>
                        </Input>
                        <Input 
                            name="shop_whatsapp" 
                            label="Whatsapp" 
                            type="text" 
                            value={shop_whatsapp} 
                            onChange={(e)=>{setShopWhatsapp(e.target.value)}}>
                        </Input>
                        <Input 
                            name="avatar" 
                            label="Imagem de capa" 
                            type="file" 
                            className="imagem-avatar" 
                            onChange={onChangeHandler}>
                        </Input>
                        <Textarea 
                            name="bio" 
                            label="Biografia" 
                            value={shop_bio} 
                            onChange={(e)=>{setShopBio(e.target.value)}}>
                        </Textarea>
                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type="button" onClick={addNewScheduleItem}>
                                + novo horário
                            </button>
                        </legend>
                        {scheduleItems.map((scheduleItem, index) => {
                            return(
                                <div key={index} className="schedule-item">
                                    <Select
                                        name={`week_day `+ index}
                                        label="Dia da semana" 
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        value={scheduleItem.week_day}
                                        options={[
                                            {value: '0', label: 'Domingo'},
                                            {value: '1', label: 'Segunda'},
                                            {value: '2', label: 'Terça'},
                                            {value: '3', label: 'Quarta'},
                                            {value: '4', label: 'Quinta'},
                                            {value: '5', label: 'Sexta'},
                                            {value: '6', label: 'Sábado'},
                                        ]}
                                    />
                                    <Input 
                                        name={`from `+ index}
                                        label="Das" 
                                        type="time" 
                                        value={scheduleItem.from} 
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    >
                                    </Input>
                                    <Input 
                                        name={`to `+ index}
                                        label="Ate" 
                                        type="time" 
                                        value={scheduleItem.to} 
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    >
                                    </Input>
                                </div>
                            );
                        })}
                    </fieldset>

                    <footer>
                        <p>Importante! <br /> Preencha todos os dados.</p>
                        <button type="submit">Salvar</button>
                    </footer>
                </form>
            </main>

            
            <main>

            </main>
        </div>
    )
}

export default UserForm;