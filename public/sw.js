/*
 * Service worker mínimo — habilita que Theaveling se pueda "instalar"
 * desde el navegador (agregar a pantalla de inicio) en celular.
 *
 * 2026-09-07, a pedido de Ana: que la app se pueda descargar/instalar
 * mientras el link normal de Vercel sigue funcionando igual para
 * cualquiera que solo quiera abrirlo en el navegador.
 *
 * No cachea contenido a propósito: cada vez que se abre la app
 * instalada, siempre pide la versión más nueva al servidor. Así,
 * cualquier cambio que se suba a Vercel se ve reflejado de inmediato,
 * sin tener que manejar versiones de caché ni lógica de actualización.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Sin caché: deja pasar todas las peticiones directo a la red.
});
