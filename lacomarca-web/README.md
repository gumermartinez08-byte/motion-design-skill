# La Comarca Meats: web con motion

Web en HTML estático. Copia los contenidos de lacomarcameats.com y añade animación.

- **Scroll suave:** Lenis.
- **Animaciones con scroll:** GSAP + ScrollTrigger (sin bloqueos en portada ni en el video de planta).
- **Pop-ups y microinteracciones:** Motion.
- **Productos:** sacados del catálogo oficial (64 fichas, `js/products.js` + `img/productos/`), ordenados por partes del cerdo.

## Ver la web
Necesita un servidor local, porque el video de portada se carga con `fetch`:

```bash
cd lacomarca-web
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Pop-ups
- **Idioma:** sale la primera visita y recuerda la elección. Para forzarlo: `?lang`.
- **Contacto:** sale a los 5 y a los 10 minutos de navegación activa (no cuenta el tiempo con la pestaña oculta). No vuelve a salir si el visitante llama o abre el formulario.
- **Prueba rápida:** `?demo` lo muestra a los 10 s y a los 20 s.

## Estructura
- `index.html`: contenido.
- `css/styles.css`: estilos (colores de marca en `:root`).
- `js/i18n.js`: textos ES/EN.
- `js/products.js`: productos.
- `js/main.js`: animación y lógica.
- `vendor/`: GSAP, ScrollTrigger, Lenis, Motion.
- `video/`: ver `video/LEEME.md`.
