import { createContext } from 'react'

interface AuthContextData {
    signed?: boolean,
    user: {
        id: string,
        name: string,
        whatsapp: string,
        email: string,
        passwd: string,
        shop_id: string,
    },
    setUser(user: object): Promise<void>;
    token: string,
    setToken(token: string): Promise<void>;
}

const StoreContext = createContext<AuthContextData>({} as AuthContextData);

export default StoreContext;