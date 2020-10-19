import React, { FormEvent, useState } from 'react'

import './styles.css'

import ShopItem from '../../components/ShopItem'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import api from '../../services/api'
import { useParams } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/SearchOutlined';
/* import ArrowDown from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUp from '@material-ui/icons/ArrowUpwardOutlined'; */

interface ParamProps {
    shop_id: string
}

/* interface ScheduleItemProps {
    item: [
        {
            week_day: number,
            from: number,
            to: number,
            id: number,
        }
    ]
    
} */

interface itemProps{
    item: {
        name: string;
        price: number;
        avatar: string;
        info: string;
        category: string;
        id: string;
        shop_id: number;
    }
}

function ShopList() {
    const { shop_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [whatsapp, setWhatsapp] = useState('')
    const [category, setCategory] = useState('');
    const [arrayCategory, setArrayCategory] = useState(['Produto', 'Serviço']);
    /* const [schedule, setSchedule] = useState<ScheduleItemProps["item"]>([{}] as ScheduleItemProps["item"]); */

    window.onload = searchAllItems;
    async function searchAllItems(){
        const item = await api.get('/items', {
            params: {
                shop_id,
            }
        })
        setArrayCategory(item.data.categories)
        setItems(item.data.items)

        const shop = await api.get('/shopbyid', {
            params: {
                shop_id,
            }
        })

        setShopName(shop.data[0].name)
        setWhatsapp(shop.data[0].whatsapp)

        /* const schedule = await api.get('/schedulebyidshop', {
            params: {
                shop_id,
            }
        })

        setSchedule(schedule.data); */
    }

    async function searchItems(e: FormEvent) {
        e.preventDefault();
        const response = await api.get('/items', {
            params: {
                shop_id,
                name,
                category,
                price
            }
        })
        setArrayCategory(response.data.categories)
        setItems(response.data.items)
    }

    /* function abrirSchedule() {
        if(mostrarSchedule === 'none'){
            setMostrarSchedule('block')
            setArrowSchedule(<ArrowUp/>)
        }
        if(mostrarSchedule === 'block'){
            setMostrarSchedule('none')
            setArrowSchedule(<ArrowDown/>)
        }
            
    }

    function minutesToHour(min: number){
        return (Math.trunc(min/60) < 9 ?  '0' + Math.trunc(min/60) : Math.trunc(min/60)) + " : " + (Math.trunc(min%60) < 9 ? '0' + Math.trunc(min%60) :  Math.trunc(min%60))
    }
    function diaSemana(dia: number){
        return dia === 1 ? 'Segunda' : dia === 2 ? 'Terça' : dia === 3 ? 'Quarta' : dia === 4 ? 'Quinta' : dia === 5 ? 'Sexta' : dia === 6 ? 'Sabado' : 'Domingo'
    }

    const [mostrarSchedule, setMostrarSchedule] = useState('none')
    const [arrowSchedule, setArrowSchedule] = useState(<ArrowDown/>) */

    return (
        <div id="page-shop-list">
            <PageHeader title={shop_name}>
            {/* <a className="button-abrir" href="#page-shop-list" onClick={abrirSchedule}>
                <h4>Horários de funcionamento {arrowSchedule}</h4>
                    <div id="schedule-div" style = {{display: mostrarSchedule}} className="input-block">
                        <div id="schedule-title">
                            <input id="schedule-day" value="Dia" readOnly/>
                            <input id="schedule-from" value="Das" readOnly/>
                            <input id="schedule-to" value="Até" readOnly/>
                        </div>
                        {schedule.map( ({id, week_day, from, to}, index) => {
                            return ( 
                                <div key={index} id={"schedule"}>
                                    <input key={'day-'+index} value={ diaSemana(week_day) } readOnly/>
                                    <input key={'from-'+index} value={ minutesToHour(from) } readOnly/>
                                    <input key={'to-'+index} value={  minutesToHour(to) } readOnly/>
                                </div>
                            )
                            })
                        }                            
                    </div>
                </a> */}
                <h4>Pesquisar {<SearchIcon/>}</h4>
                <form onSubmit={searchItems} id="search-itens">
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
                            onChange={(e) => { setCategory(e.target.value)}}
                            options={[
                                {value: 'all', label: 'Todas'},
                                {value: 'Produto', label: 'Produto'},
                                {value: 'Serviço', label: 'Serviço'},
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

            </PageHeader>
            <main>
                {arrayCategory.map((category: string) => {
                    return(
                        <div key={category}>
                            <h2 className="categoria">{category}</h2>
                            <div className="container">
                                {items.map((item: itemProps["item"]) => {
                                    if(item.category ===  category)
                                        return ( <ShopItem key={item.id} path="shopList" whatsapp={whatsapp} item={item}/> )
                                    else return ''
                                }) }

                            </div>
                        </div>
                    )
                }) }
               
            </main>
        </div>
    )
}

export default ShopList;