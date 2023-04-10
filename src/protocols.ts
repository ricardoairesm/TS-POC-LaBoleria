export type CakeEntity = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

export type Cake = Omit<CakeEntity, "id">

export type OrderEntity = {
    id: number;
    clientId: number;
    cakeId: number;
    quantity: number;
    totalPrice: number;
}

export type Order = Omit<OrderEntity,"id">

export type ClientEntity = {
    id:number;
    name: string;
    address: string;
    phone: string;
}

export type Client = Omit<ClientEntity,"id">