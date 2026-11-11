---
lang: es
---

# Registro de publicación

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | Español | [Deutsch](releases.de.md)

## GitHub Pages

El 11 de noviembre de 2026 se publicaron el README y los documentos existentes en GitHub Pages desde la raíz de `main`. El README es la página inicial; Jekyll convierte enlaces Markdown relativos a URLs HTML. La edición sigue en Markdown. `src/`, `options.html` y `manifest.json` se excluyen del sitio.

La compilación y el despliegue iniciales de las [instrucciones](https://mstksb.github.io/chrome-ext-tabuchan/) y el [borrador de política](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) se completaron. Ambas páginas se comprobaron por HTTPS sin autenticación y en el navegador. Responsable, contacto y vigencia siguen pendientes; la política no está finalizada para el envío. Esta verificación histórica no confirma el despliegue de las nuevas traducciones.

## 0.1.0

Candidata pública con cambio por pulsación breve, lista por pulsación prolongada, modos de uso reciente/orden de pestañas, grupos, búsqueda por título y ajustes de atajos/comportamiento.

Ajustes y lista admiten japonés e inglés; Chrome en idiomas distintos del japonés selecciona inglés. La búsqueda es independiente y usa NFC y subcadenas sin distinguir mayúsculas/minúsculas. Traducir documentos no amplía los idiomas de la interfaz.

| Elemento | Detalles |
| --- | --- |
| Versión | `0.1.0` para SemVer y manifiesto |
| ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), 20 archivos y manifiesto en la raíz |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| Suma de comprobación | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Requisitos | Chrome con Manifest V3; mínimo declarado Chrome 102 |
| Tienda | Sin verificar: carga/aceptación de este ZIP internacionalizado, revisión/publicación e ID/URL del artículo |

## Alcance verificado

El 10 de noviembre de 2026 se verificaron la interfaz japonesa y operaciones principales en macOS con Chrome `156.0.8078.80`: pulsaciones breves/prolongadas, selección/cancelación, orden/grupos, guardado de ajustes, iframes, pestañas restringidas, búsqueda y reenvío de operaciones durante composición por IME. También se verificaron la interfaz japonesa y búsqueda NFC en una extracción separada del ZIP.

El 11 de noviembre se verificaron 17 grupos de operaciones con los archivos del repositorio en macOS, Chrome `157.0.8103.40`, idioma `ja`, incluida la versión `0.1.0` en ajustes. El funcionamiento después de recargar sigue sin verificar.

Las comprobaciones automatizadas/de configuración cubren claves japonés/inglés, referencias del manifiesto, caracteres NFC precompuestos/combinantes y búsqueda multilingüe/con emojis. El diseño inglés se comprobó con el mismo código y diccionario inglés en una configuración para capturas.

La [ficha](store/listing.es.md#capturas-de-pantalla) incluye ajustes/listas en japonés e inglés: PNG opacos de 1280×800 y pestañas de ejemplo.

## Sin verificar o decidir

- Windows, Linux, Chrome antiguo e IMEs nativos de cada idioma.
- Paquete bilingüe original en un entorno inglés y retorno al inglés en idiomas no admitidos.
- Funcionamiento tras recargar en Chrome normal.
- Responsable/contacto, licencia, visibilidad y países de distribución.
- Datos y vigencia de la política y conformidad del tratamiento, incluidas solicitudes HTTP de favicons.
- Guardado de ficha/declaraciones en Dashboard y revisión/publicación.

Completa estos puntos antes del envío. Los borradores son materiales de preparación y no prueban que se hayan cumplido los requisitos.
