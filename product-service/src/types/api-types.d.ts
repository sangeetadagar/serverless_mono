export interface Product {
    "id": number,
    "title": string,
    "description": string,
    "price": number
}

export type ProductList = Array<Product>;