---
lang: es
---

# Registro de publicación

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | Español | [Deutsch](releases.de.md)

## GitHub Pages

El 11 de noviembre de 2026 se publicaron el README y los documentos existentes en GitHub Pages desde la raíz de `main`. El README es la página inicial; Jekyll convierte enlaces Markdown relativos a URLs HTML. La edición sigue en Markdown. `src/`, `options.html` y `manifest.json` se excluyen del sitio.

La compilación y el despliegue iniciales de las [instrucciones](https://mstksb.github.io/chrome-ext-tabuchan/) y el [borrador de política](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) se completaron. Ambas páginas se comprobaron por HTTPS sin autenticación y en el navegador. Responsable, contacto y vigencia siguen pendientes; la política no está finalizada para el envío. Esta verificación histórica no confirma el despliegue de las nuevas traducciones.

El registro anterior corresponde a despliegues previos. El despliegue de la actualización del 18 de noviembre de 2026 queda por verificar.

## 0.1.0

Esta versión candidata actualiza la detección y la presentación de las pestañas restringidas, reduce la duración mínima y predeterminada de la pulsación larga y añade coincidencia parcial o por prefijo para búsquedas con varios términos. También corrige problemas de cambio de pestaña y ajustes.

Los ajustes y la lista usan japonés cuando Chrome se muestra en japonés, e inglés en los demás casos. Separa los términos de búsqueda con espacios. La coincidencia parcial (predeterminada) busca títulos que contienen todos los términos en cualquier orden. La coincidencia por prefijo exige que el título empiece por el primer término y que los demás aparezcan en el orden introducido, con caracteres intermedios si los hay. Ambos modos usan normalización Unicode NFC e ignoran las diferencias entre mayúsculas y minúsculas.

| Elemento | Detalles |
| --- | --- |
| Versión | Este paquete usa la versión `0.1.0`. La versión que se enviará depende del historial de cargas en el Dashboard. |
| ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), 29 archivos y manifiesto en la raíz |
| SHA-256 | `25a07b0f94b01a9bc9d9ea5ce05d9e258b584a7560ace136fa10716a1e6d9982` |
| Suma de comprobación | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Requisitos | Chrome con Manifest V3; mínimo declarado Chrome 102 |
| Tienda | Queda por comprobar el paquete, el ID y la URL del elemento en el Dashboard, así como su estado de revisión y publicación. |

## Verificación de la versión candidata del 18 de noviembre de 2026

La versión candidata superó 21 grupos de pruebas de extremo a extremo en Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Otros tres grupos verificaron la interfaz en japonés y en inglés, el uso del inglés con Chrome en francés y la búsqueda de títulos con Unicode. Los 24 grupos también se superaron al cargar la extensión desde el ZIP de distribución descomprimido. La versión mostrada en los ajustes coincidió con la del manifiesto del ZIP.

La [ficha](store/listing.es.md#capturas-de-pantalla) incluye ajustes/listas en japonés e inglés: PNG opacos de 1280×800 y pestañas de ejemplo.

## Verificación de la versión candidata anterior

El 10 de noviembre de 2026 se verificaron la interfaz japonesa y operaciones principales en macOS con Chrome `156.0.8078.80`: pulsaciones breves/prolongadas, selección/cancelación, orden/grupos, guardado de ajustes, iframes, pestañas restringidas, búsqueda y reenvío de operaciones durante composición por IME. También se verificaron la interfaz japonesa y búsqueda NFC en una extracción separada del ZIP.

El 11 de noviembre se verificaron 17 grupos de operaciones con los archivos del repositorio en macOS, Chrome `157.0.8103.40`, idioma `ja`, incluida la versión `0.1.0` en ajustes. El funcionamiento después de recargar sigue sin verificar.

Las comprobaciones automatizadas/de configuración cubren claves japonés/inglés, referencias del manifiesto, caracteres NFC precompuestos/combinantes y búsqueda multilingüe/con emojis. El diseño inglés se comprobó con el mismo código y diccionario inglés en una configuración para capturas.

## Sin verificar o decidir

- Windows, versiones antiguas de Chrome y los IME nativos del sistema.
- Funcionamiento tras recargar en Chrome normal.
- Responsable/contacto, licencia, visibilidad y países de distribución.
- Datos y vigencia de la política y conformidad del tratamiento, incluidas solicitudes HTTP de favicons.
- Guardado de ficha/declaraciones en Dashboard y revisión/publicación.

Completa estos puntos antes del envío. Los borradores son materiales de preparación y no prueban que se hayan cumplido los requisitos.
