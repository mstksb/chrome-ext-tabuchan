---
lang: es
---

# Borrador de ficha de Chrome Web Store

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | Español | [Deutsch](listing.de.md)

Este paquete usa la versión `0.2.0`. La versión que se enviará depende del historial de cargas en el Dashboard. Consulta el [registro](../releases.es.md) para los archivos, los entornos probados y el estado de la tienda.

## Datos básicos

| Campo | Texto / situación |
| --- | --- |
| Nombre | tabuchan |
| Versión | `0.2.0` |
| Idiomas de documentos/ficha | Inglés como base; japonés, chino simplificado/tradicional, portugués de Brasil, español y alemán. Valores guardados en Dashboard sin verificar |
| Interfaz | Japonés con Chrome en japonés; inglés en otros casos. Los documentos no amplían la interfaz |
| Categoría propuesta | Functionality & UI, según la categoría oficial actual para pestañas/atajos; valor guardado sin verificar |
| Resumen | Cambia a pestañas recientes con una pulsación. Mantén el atajo para listar, buscar y elegir pestañas en la ventana actual. |
| Inicio / soporte | [Instrucciones](https://mstksb.github.io/chrome-ext-tabuchan/README.es.html); soporte a definir por el responsable |
| Visibilidad / países | Pendiente del responsable |
| Política | [URL pública](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.es.html), datos/vigencia pendientes; finalizar antes del envío |

## Descripción detallada

tabuchan permite cambiar entre pestañas de la ventana actual con atajos de teclado.

Mantén pulsadas las teclas modificadoras y pulsa y suelta la tecla normal para Retroceder o Avanzar en un orden fijo. Al soltar un modificador necesario, la pestaña visible pasa a ser la más reciente. Por defecto se omiten las pestañas sin atajos disponibles.

Pulsa Enter en cualquiera de las listas, incluidos los resultados de búsqueda, o selecciona una pestaña directamente en Chrome para que pase a ser la más reciente. Si ya estaba en el historial, se elimina su entrada anterior y se conserva el orden de las demás.

Mantén toda la combinación para abrir la lista. Arriba/Abajo seleccionan, Enter cambia y Esc cancela. La lista permanece al soltar las teclas.

Pulsa Izquierda para alternar entre uso reciente y orden de pestañas. La lista en orden de pestañas conserva los grupos y permite buscar títulos independientemente del idioma de la interfaz. Separa los términos de búsqueda con espacios. La coincidencia parcial (predeterminada) busca títulos que contienen todos los términos en cualquier orden. La coincidencia por prefijo exige que el título empiece por el primer término y que los demás aparezcan en el orden introducido, con caracteres intermedios si los hay. Ambos modos usan normalización Unicode NFC e ignoran las diferencias entre mayúsculas y minúsculas.

Puedes asignar varios atajos por acción. La duración de la pulsación larga admite valores de 0,2 a 2,0 segundos en pasos de 0,1 segundos y su valor predeterminado es de 0,5 segundos. El historial conserva de 10 a 30 pestañas anteriores, con 10 por defecto. Las pestañas sin atajos disponibles aparecen atenuadas en la lista, conservan la altura de la fila y pueden seleccionarse con Enter.

En macOS: Control + Shift + J para Retroceder y Control + Shift + K para Avanzar. En otros sistemas: Alt + Shift + J/K. Registra combinaciones propias en ajustes.

Los atajos empiezan en páginas HTTP(S) normales e iframes, no en páginas internas, Chrome Web Store, otras extensiones, archivos ni barra de direcciones. Las pestañas restringidas pueden elegirse desde una lista abierta en una página normal.

Historial y ajustes se procesan y guardan localmente. Los favicons pueden generar solicitudes al proveedor de la imagen. Consulta la política de privacidad.

## Capturas de pantalla

| Archivo | Contenido / preparación |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Icono existente convertido a PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Duración predeterminada de 0,5 segundos y opciones de coincidencia de búsqueda en inglés, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Lista en orden de pestañas en inglés, con grupos, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Duración predeterminada de 0,5 segundos y opciones de coincidencia de búsqueda en japonés, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Lista en orden de pestañas en japonés, con grupos, 1280×800 |

Las cuatro capturas de 1280×800 muestran el mismo paquete bilingüe en Chrome for Testing Stable `158.0.8127.36` (Linux arm64), con la interfaz de Chrome en japonés y en inglés. Las listas usan pestañas de ejemplo.

## Instrucciones para revisión

No se requiere una cuenta ni iniciar sesión. Visita varias pestañas HTTP(S) en una ventana. Mantén pulsadas las teclas modificadoras y pulsa y suelta las teclas normales de Retroceder y Avanzar. Suelta un modificador necesario y verifica que la pestaña visible pasa a ser la más reciente. Mantén pulsada toda la combinación al menos 0,5 segundos, pasa al orden de pestañas con la flecha izquierda, filtra por título y confirma con Enter. Abre la configuración desde el icono y comprueba la versión `0.2.0`.

## Base del borrador

La versión candidata superó 21 grupos de pruebas de extremo a extremo en Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Otros tres grupos verificaron la interfaz en japonés y en inglés, el uso del inglés con Chrome en francés y la búsqueda de títulos con Unicode.

Campos e imágenes se contrastaron con documentación oficial el 9 de noviembre de 2026. Revisa los requisitos actuales antes del envío: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
