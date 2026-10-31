# Videos

La web busca aquí:

- `hero.mp4`: video de portada. Original: `video-home-la-comarca-meats-1.mp4`
- `planta.mp4`: video de la planta, el del marco que se abre al bajar. Original: `Video-La-Comarca-Meats-Home-3-1.mp4`

Si no están, la web usa los originales de lacomarcameats.com.
Los dos se reproducen solos en bucle, sin audio. El scroll nunca se detiene esperando a un video.
Para que carguen más rápido, puedes comprimirlos:

    ffmpeg -i entrada.mp4 -an -vf scale=-2:1080 -c:v libx264 -crf 24 -preset slow -movflags +faststart video/hero.mp4
