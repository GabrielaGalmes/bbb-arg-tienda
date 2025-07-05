export const getProducts = async () => {
    const response = await fetch('https://dummyjson.com/products/category/mens-shoes?limit=5');
    const data = await response.json();
    return data.products.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail
    }));
};