/* Productos por partes del cerdo.
   `zone` = id de la zona en el diagrama SVG (index.html, #pig).
   `products` se rellena con las referencias del catálogo PDF:
     { es: 'Nombre ES', en: 'Name EN', ref: 'código', fresh: true, frozen: true }
   Mientras una pieza no tenga productos, la tarjeta remite al catálogo. */
window.PRODUCT_PARTS = [
  { zone: 'cabeza',  es: 'Cabeza',            en: 'Head',              products: [] },
  { zone: 'paleta',  es: 'Paleta',            en: 'Shoulder',          products: [] },
  { zone: 'lomo',    es: 'Lomo',              en: 'Loin',              products: [] },
  { zone: 'panceta', es: 'Panceta',           en: 'Belly',             products: [] },
  { zone: 'jamon',   es: 'Jamón',             en: 'Ham',               products: [] },
  { zone: 'patas',   es: 'Codillos y manos',  en: 'Hocks & trotters',  products: [] }
];
