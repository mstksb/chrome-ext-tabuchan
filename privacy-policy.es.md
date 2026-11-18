---
lang: es
---

# Política de privacidad de tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | [Português (Brasil)](privacy-policy.pt-BR.md) | Español | [Deutsch](privacy-policy.de.md)

Esta política entra en vigor en la fecha de publicación de la versión `0.2.0` de tabuchan en Chrome Web Store. Consulta el [registro](releases.es.md) para ver el estado de publicación.

## Finalidad

tabuchan permite navegar con el teclado a pestañas recientes o encontradas por título en la ventana actual.

## Información tratada

- IDs de pestañas/ventanas, títulos, URLs, URLs de favicons e IDs, nombres y colores de grupos obtenidos de Chrome.
- Orden de selección, orden fijo de recorrido y selección en la lista.
- Eventos de pulsación/liberación de atajos detectados en páginas, operaciones de la lista y texto de búsqueda.
- Combinaciones de teclas, duración de la pulsación larga, límite del historial, omisión de pestañas sin atajos al pulsar brevemente y modo de coincidencia de búsqueda elegidos por el usuario.

Estos datos se usan para cambiar de pestaña, crear el historial/listas, buscar títulos, indicar la disponibilidad de atajos y aplicar los ajustes.

## Procesamiento y almacenamiento locales

El historial y el estado de recorrido se guardan en `storage.session`, el almacenamiento local de sesión de extensiones de Chrome. El historial contiene principalmente IDs, orden y selección. Los atajos y ajustes se guardan en `storage.local`.

Los títulos, las URL y los grupos se obtienen de Chrome durante el procesamiento. La lista aparece en un marco de la extensión insertado en la página actual, con títulos y nombres de grupos como texto. El contenido de la lista y el texto de búsqueda se procesan dentro de la extensión. El texto de búsqueda y el estado de las teclas se usan en memoria durante el procesamiento.

## Solicitudes de red para favicons

Para mostrar favicons en la lista de pestañas y en las notificaciones de los comandos de atajos antiguos de Chrome, el navegador puede solicitar imágenes a las URL HTTPS que facilita Chrome. Si Chrome facilita una URL HTTP para un favicon, la extensión muestra un icono alternativo sin solicitar esa URL.

Los proveedores de imágenes pueden recibir la dirección IP del usuario y los datos habituales de la solicitud. La extensión especifica `no-referrer` para las solicitudes de favicons. El tratamiento de las cookies y la caché depende de los ajustes y las políticas de Chrome y del servidor de destino. Cada proveedor aplica sus reglas para conservar registros de acceso y realizar otros tratamientos.

## Conservación y eliminación

El historial de sesión se borra al reiniciar el navegador o desactivar, recargar o actualizar la extensión. Se crea un nuevo historial desde la pestaña actual. Cerrar una pestaña la elimina del historial; reducir el límite elimina las entradas más antiguas que lo excedan.

Los atajos y ajustes permanecen en el dispositivo hasta que el usuario los modifique en la configuración. Al quitar la extensión, Chrome elimina su almacenamiento. La caché de imágenes se administra mediante los controles de datos de navegación.

La búsqueda se usa mientras la lista está abierta y se descarta al cerrarla o cambiar de modo.

## Alcance del uso

La información se usa para el cambio de pestañas, listas, búsqueda y ajustes descritos aquí. Las solicitudes a proveedores externos corresponden a favicons. Las declaraciones de datos de Chrome Web Store deben reflejar este tratamiento.

## Responsable y contacto

Responsable de la publicación: `mstksb`. Contacto: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com).

La URL pública está [aquí](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.es.html). Los cambios de la política deben reflejarse en la ficha de la tienda con la versión aplicable y el tratamiento actualizado de los datos.
