---
lang: es
---

# Borrador de política de privacidad de tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | [Português (Brasil)](privacy-policy.pt-BR.md) | Español | [Deutsch](privacy-policy.de.md)

Este borrador corresponde a la versión `0.1.0`. El nombre del responsable, el contacto y la fecha de publicación/entrada en vigor no se han definido. Consulta el [registro](releases.es.md).

## Finalidad

tabuchan permite navegar con el teclado a pestañas recientes o encontradas por título en la ventana actual.

## Información tratada

- IDs de pestañas/ventanas, títulos, URLs, URLs de favicons e IDs, nombres y colores de grupos obtenidos de Chrome.
- Orden de selección, orden fijo de recorrido y selección en la lista.
- Eventos de pulsación/liberación de atajos detectados en páginas, operaciones de la lista y texto de búsqueda.
- Combinaciones, duración, límite del historial y opción de omitir pestañas configurados por el usuario.

Estos datos se usan para cambiar de pestaña, crear el historial/listas, buscar títulos, indicar la disponibilidad de atajos y aplicar los ajustes.

## Procesamiento y almacenamiento locales

El historial y el estado de recorrido se guardan en `storage.session`, el almacenamiento local de sesión de extensiones de Chrome. El historial contiene principalmente IDs, orden y selección. Los atajos y ajustes se guardan en `storage.local`.

Títulos, URLs y grupos se obtienen de Chrome durante el procesamiento. La lista se muestra dentro de la página actual, con títulos y nombres de grupos como texto. El texto de búsqueda y el estado de las teclas se usan en memoria durante el procesamiento.

## Solicitudes de red para favicons

La lista puede usar URLs HTTP(S) de imágenes proporcionadas por Chrome para mostrar favicons, lo que puede generar solicitudes del navegador al servidor de imágenes.

Los proveedores pueden recibir la dirección IP y datos habituales de la solicitud. La extensión especifica `no-referrer`. Cookies, caché y contenido mixto dependen de los ajustes/políticas de Chrome y del destino. La conservación de registros de acceso y otros tratamientos siguen las reglas de cada proveedor.

## Conservación y eliminación

El historial de sesión se borra al reiniciar el navegador o desactivar, recargar o actualizar la extensión. Se crea un nuevo historial desde la pestaña actual. Cerrar una pestaña la elimina del historial; reducir el límite elimina las entradas más antiguas que lo excedan.

Los atajos y ajustes permanecen en el dispositivo hasta que el usuario los modifique en la configuración. Al quitar la extensión, Chrome elimina su almacenamiento. La caché de imágenes se administra mediante los controles de datos de navegación.

La búsqueda se usa mientras la lista está abierta y se descarta al cerrarla o cambiar de modo.

## Alcance del uso

La información se usa para el cambio de pestañas, listas, búsqueda y ajustes descritos aquí. Las solicitudes a proveedores externos corresponden a favicons. Las declaraciones de datos de Chrome Web Store deben reflejar este tratamiento.

## Responsable y contacto

La URL pública está [aquí](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.es.html). El responsable, el canal de contacto y la fecha de entrada en vigor deben definirse antes del envío a la tienda. Los cambios deben reflejarse en la ficha, indicando versión aplicable y tratamiento actualizado.
