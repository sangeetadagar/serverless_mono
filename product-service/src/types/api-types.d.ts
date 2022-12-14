export interface Product {
    id: string,
    title: string,
    description: string,
    price: number
}

export type ProductList = Array<Product>;