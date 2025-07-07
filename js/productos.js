
// Función para obtener productos desde la API (de modo que sea reutilizable para otras categorias)
export async function getProducts(category = 'mens-shoes', limit = 5) {
    try { 
        const respuesta = await fetch('https://dummyjson.com/products/category/mens-shoes?limit=5');
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        const datos = await respuesta.json();
        // Mapeo de datos de la API a esta estructura
        return datos.products.map(item => ({
            id: item.id, 
            name: item.title || 'Producto sin nombre', 
            price: item.price || 0, 
            thumbnail: item.thumbnail || 'placeholder.jpg', 
            description: item.description || 'Sin descripción' 
        }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return []; // Retorna array vacío en caso de error
    }
}
// Función para mostrar alertas
export function mostrarAlerta(mensaje) {
    alert(mensaje);
}
