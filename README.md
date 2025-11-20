# SizImage - Optimizador de Imágenes

Esta es una aplicación web moderna construida con Next.js para optimizar imágenes para la web.

## Características

- **Optimización Inteligente**: Reduce el peso de las imágenes convirtiéndolas a formato WebP de alta calidad.
- **Redimensionamiento Automático**: Las imágenes mayores a 1200px de ancho se redimensionan automáticamente manteniendo la relación de aspecto.
- **Interfaz Moderna**: Diseño oscuro con efectos de vidrio (glassmorphism) y animaciones suaves.
- **Privacidad**: El procesamiento se realiza en el servidor pero no se almacenan las imágenes permanentemente.

## Tecnologías

- [Next.js 16](https://nextjs.org/) - Framework de React.
- [Tailwind CSS](https://tailwindcss.com/) - Estilos.
- [Sharp](https://sharp.pixelplumbing.com/) - Procesamiento de imágenes de alto rendimiento.
- [Framer Motion](https://www.framer.com/motion/) - Animaciones.
- [React Dropzone](https://react-dropzone.js.org/) - Carga de archivos.

## Cómo usar

1. Arrastra una imagen al área designada o haz clic para seleccionar una.
2. Presiona el botón "Optimizar Imagen".
3. Verás el nuevo peso y el porcentaje de reducción.
4. Haz clic en "Descargar" para guardar tu imagen optimizada.

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
