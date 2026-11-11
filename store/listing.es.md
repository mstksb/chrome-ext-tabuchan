---
lang: es
---

# Borrador de ficha de Chrome Web Store

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | Español | [Deutsch](listing.de.md)

Corresponde a la candidata pública `0.1.0`. Consulta valores y pendientes en el [registro](../releases.es.md).

## Datos básicos

| Campo | Texto / situación |
| --- | --- |
| Nombre | tabuchan |
| Versión | 0.1.0, primera candidata pública |
| Idiomas de documentos/ficha | Inglés como base; japonés, chino simplificado/tradicional, portugués de Brasil, español y alemán. Valores guardados en Dashboard sin verificar |
| Interfaz | Japonés con Chrome en japonés; inglés en otros casos. Los documentos no amplían la interfaz |
| Categoría propuesta | Functionality & UI, según la categoría oficial actual para pestañas/atajos; valor guardado sin verificar |
| Resumen | Cambia a pestañas recientes con una pulsación. Mantén el atajo para listar, buscar y elegir pestañas en la ventana actual. |
| Inicio / soporte | [Instrucciones](https://mstksb.github.io/chrome-ext-tabuchan/README.es.html); soporte a definir por el responsable |
| Visibilidad / países | Pendiente del responsable |
| Política | [URL pública](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.es.html), datos/vigencia pendientes; finalizar antes del envío |

## Descripción detallada

tabuchan permite cambiar entre pestañas de la ventana actual con atajos de teclado.

Pulsa brevemente Retroceder o Avanzar para recorrer un orden fijo de uso reciente. Por defecto se omiten las pestañas sin atajos disponibles.

Mantén toda la combinación para abrir la lista. Arriba/Abajo seleccionan, Enter cambia y Esc cancela. La lista permanece al soltar las teclas.

Izquierda alterna uso reciente y orden de pestañas. Este último conserva grupos y filtra títulos con texto Unicode, independiente de la interfaz, usando NFC y subcadenas sin distinguir mayúsculas/minúsculas.

Puedes asignar varios atajos por acción, ajustar 0,5–2 segundos y conservar 10–30 pestañas anteriores. Valores predeterminados: 1 segundo y 10 pestañas.

En macOS: Control + Shift + J para Retroceder y Control + Shift + K para Avanzar. En otros sistemas: Alt + Shift + J/K. Registra combinaciones propias en ajustes.

Los atajos empiezan en páginas HTTP(S) normales e iframes, no en páginas internas, Chrome Web Store, otras extensiones, archivos ni barra de direcciones. Las pestañas restringidas pueden elegirse desde una lista abierta en una página normal.

Historial y ajustes se procesan y guardan localmente. Los favicons pueden generar solicitudes al proveedor de la imagen. Consulta la política de privacidad.

## Capturas de pantalla

| Archivo | Contenido / preparación |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Icono existente convertido a PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Ajustes en inglés, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Orden de pestañas y grupo Work, abierto con teclas reales, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Ajustes japoneses reales y atajos predeterminados, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Lista reciente japonesa con teclas reales y pestañas de prueba, 1280×800 |

Las japonesas se capturaron en pruebas Chrome de `0.1.0`. Las inglesas usan Chrome real, el mismo código y solo el diccionario inglés: se comprobó texto/diseño, no la selección automática en el paquete bilingüe original. Los cuatro PNG son opacos, 1280×800 y revisados visualmente; la lista contiene datos de ejemplo. No hay capturas ni interfaz traducida para los otros idiomas documentales.

## Instrucciones para revisión

No se requiere cuenta ni inicio de sesión. Abre varias pestañas HTTP(S) en una ventana y visítalas en orden. Comprueba pulsaciones breves con los atajos indicados, luego mantén la combinación al menos 1 segundo y usa Arriba/Abajo, Enter y Esc. Cambia de modo con Izquierda y busca un título en orden de pestañas. Abre ajustes desde el icono y confirma `0.1.0`.

## Base del borrador

Implementación y pruebas Chrome actuales: MRU fijo, pulsaciones, grupos/búsqueda, ajustes, iframes y pestañas restringidas. Sin verificar: IMEs nativos, otros sistemas, Chrome antiguo y selección real inglés/fallback. Consulta el [registro](../releases.es.md).

Campos e imágenes se contrastaron con documentación oficial el 9 de noviembre de 2026. Revisa los requisitos actuales antes del envío: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
