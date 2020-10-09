import React, { FormEvent, useState } from 'react'

import './styles.css'

import ShopItem from '../../components/ShopItem'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import api from '../../services/api'
import { useParams } from 'react-router-dom'
import ArrowDown from '@material-ui/icons/ArrowDownwardOutlined';
import Arrowup from '@material-ui/icons/ArrowUpwardRounded';


interface ParamProps {
    shop_id: string
}


function ShopList() {
    const { shop_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    
    window.onload = searchAllItems;
    async function searchAllItems(){
        const item = await api.get('/items', {
            params: {
                shop_id,
            }
        })
        
        setItems(item.data)

        const shop = await api.get('/shopbyid', {
            params: {
                shop_id,
            }
        })

        setShopName(shop.data[0].name)

        const schedule = await api.get('/schedulebyidshop', {
            params: {
                shop_id,
            }
        })

        setSchedule(schedule.data)

    }

    async function searchItems(e: FormEvent) {
        e.preventDefault();
        const response = await api.get('/items', {
            params: {
                shop_id,
                name,
            }
        })

        setItems(response.data)
    }

    function abrirSchedule() {
        if(mostrarSchedule === 'none'){
            setMostrarSchedule('block')
            setArrowSchedule(<Arrowup/>)
        }
        if(mostrarSchedule === 'block'){
            setMostrarSchedule('none')
            setArrowSchedule(<ArrowDown/>)
        }
            
    }

    function abrirPesquisa() {
        if(mostrarPesquisa === 'none'){
            setMostrarPesquisa('block')
            setArrowPesquisa(<Arrowup/>)
        }

        if(mostrarPesquisa === 'block'){
            setMostrarPesquisa('none')
            setArrowPesquisa(<ArrowDown/>)
        }
    }

    const [mostrarSchedule, setMostrarSchedule] = useState('none')
    const [mostrarPesquisa, setMostrarPesquisa] = useState('none')
    const [arrowSchedule, setArrowSchedule] = useState(<ArrowDown/>)
    const [arrowPesquisa, setArrowPesquisa] = useState(<ArrowDown/>)

    return (
        <div id="page-shop-list">
            <PageHeader title={shop_name}>
                <a className="button-abrir" href="#page-shop-list" onClick={abrirSchedule}>
                <h4>Horários Disponíveis {arrowSchedule}</h4>
                    <div id="schedule-div" style = {{display: mostrarSchedule}} className="input-block">
                        <div >
                            
                            <div id="schedule-title">
                                  
                                <input value="Dia" onChange={()=>{}}/>
                                <input value="Das" onChange={()=>{}}/>
                                <input value="Até" onChange={()=>{}}/>
                            
                            </div>


                            {schedule.map( (item: {week_day: number, from: number, to: number}) => {
                                function minutesToHour(min: number){
                                    return (Math.trunc(min/60)+":"+ Math.trunc(min%60))
                                }
                                function diaSemana(dia: number){
                                    return dia === 1 ? 'Segunda' : dia === 2 ? 'Terça' : dia === 3 ? 'Quarta' : dia === 4 ? 'Quinta' : dia === 5 ? 'Sexta' : dia === 6 ? 'Sabado' : 'Domingo'
                                }
                                return ( 
                                    <div key={item.week_day} id="schedule">
                                  
                                        <input value={ diaSemana(item.week_day) } onChange={()=>{}}/>
                                        <input value={ minutesToHour(item.from) } onChange={()=>{}}/>
                                        <input value={  minutesToHour(item.to) } onChange={()=>{}}/>
                                  
                                    </div>
                                )
                                })
                            }                            
                        </div>
                    </div>
                </a>
                <a className="button-abrir" href="#page-shop-list" onClick={abrirPesquisa}>
                    <h4>Pesquisar {arrowPesquisa}</h4>
                    <form style = {{display: mostrarPesquisa}} onSubmit={searchItems} id="search-itens">
                        <Input 
                            name="name" 
                            label="Nome" 
                            type="text"
                            value={name}
                            onChange={(e) => {setName(e.target.value)}}
                        />
                        <div className="selects">
                            <Select 
                                name="category" 
                                label="Categoria" 
                                value={category}
                                onChange={(e) => {setCategory(e.target.value)}}
                                options={[
                                    {value: 'product', label: 'Produto'},
                                    {value: 'work', label: 'Serviço'},
                                ]} 
                            />
                            <Select 
                                name="price" 
                                label="Preço" 
                                value={price}
                                onChange={(e) => {setPrice(e.target.value)}}
                                options={[
                                    {value: 'desc', label: 'Maior para Menor'},
                                    {value: 'cres', label: 'Menor para Maior'},
                                ]} 
                            />
                        </div>
                        <button type="submit">
                            Buscar
                        </button>
                    </form>
                </a>
            </PageHeader>
            <main>
                <div className="container">
                    {items.map(item => {
                        return (<ShopItem key={item} item={item}/>)
                    })}
                </div>
            </main>
        </div>
    )
}

export default ShopList;