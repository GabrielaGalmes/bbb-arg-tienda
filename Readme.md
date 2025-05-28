# BBB ARG - Pre-entrega Proyecto Front-End

## Propósito del Proyecto

Este proyecto es una pre-entrega para un curso de desarrollo Front-End, diseñado para crear una página web estática para una tienda ficticia llamada **BBB ARG** (Bueno, Bonito, Barato). La página presenta una tienda de calzado con secciones para mostrar información, productos, reseñas, un formulario de contacto y un carrito de compras. El objetivo es demostrar habilidades en HTML y CSS, implementando una estructura semántica, diseño responsivo y un formulario funcional con Formspree.

## Estructura del Proyecto

La página está organizada en las siguientes secciones:

- **Inicio**: Presenta un mensaje de bienvenida, futuro texto descriptivo y un video promocional ( que por ahora, es un video institucional de YouTube a modo de ejemplo).
- **Sobre Nosotros**: Describeirá la tienda y su ubicación, con un mapa de Google Maps integrado.
- **Productos**: Mostrará una galería de productos agrupados por tipo, que a futuro tendrán su propio menú/catálogo (zapatillas, borcegos, botas, sandalias) con enlaces a WhatsApp (de momento ficticio) para consultas.
- **Reseñas**: Exhibirá reseñas de clientes y una “ventana” para ingresar las mismas (en cosnstrución)
- **Contacto**: Incluye un formulario de contacto para enviar mensajes a la tienda (usando Formspree) (por ahora también es ficticio).
- **Carrito**: Presenta una tabla estática para simular un carrito de compras, con un enlace a WhatsApp (por ahora a su página de inicio) para coordinar el pedido.
- **Header**: Contiene un logotipo y una barra de navegación con enlaces internos a todas las secciones.
- **Footer**: Muestra información de derechos reservados y enlaces a redes sociales (TikTok, Instagram, Facebook), que por ahora dirigen a las páginas de inicio de las mismas.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica con `header`, `nav`, `main`, `section`, y `footer`.
- **CSS3**: Estilos personalizados para diseño responsivo, transiciones, sombras y bordes redondeados.
- **Google Fonts**: Fuente `Montserrat` para tipografía consistente.
- **Font Awesome**: Íconos para navegación, footer y botones fijos.
- **Bootstrap**: Usado para componentes como `container`, `row`, `form-control`, y `btn` (opcional, según la consigna).
- **Formspree**: Servicio para manejar el envío de formulario de contacto.
- **Flexbox y Grid**: Flexbox para el diseño de la navegación y formularios; Grid para las secciones de productos y reseñas.

## Características Principales

- **Diseño Responsivo**:
  - La sección de productos usa Grid (dos columnas en escritorio, una en móvil).
  - La sección de reseñas usa Grid con un diseño centrado para pantallas pequeñas.
  - El formulario de contacto se adapta a diferentes tamaños de pantalla mediante `media queries` (máximo 600px).
- **Formulario de Contacto**: Incluye campos para nombre, correo y mensaje, configurado con Formspree.
- **Contenido Multimedia**: Video de YouTube (como ejemplo) en la sección de inicio, mapa de Google Maps en "Sobre Nosotros" e imágenes de productos (placeholders de `picsum.photos`).
- **Navegación**: Lista desordenada (`<ul>`) con enlaces internos y íconos para una navegación intuitiva.
- **Estilos**: Fondo turquesa en `header` y `footer`, fondo gris claro en secciones específicas, transiciones suaves en botones y tarjetas

## Autor

Gabriela L. Galmés - Estudiante del curso Front-End (com 25013)
