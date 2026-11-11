---
lang: es
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | Español | [Deutsch](README.de.md)

Extensión de Chrome para cambiar a pestañas recientes con el teclado. Pulsa brevemente un atajo para recorrer el historial o mantenlo pulsado para abrir la lista.

La versión candidata pública es `0.1.0`. Consulta el [registro de publicación](releases.es.md) para los archivos, entornos verificados y estado de revisión/publicación.

La documentación está disponible en inglés, japonés, chino simplificado, chino tradicional, portugués de Brasil, español y alemán. Los idiomas de documentación son independientes de la interfaz: los ajustes y la lista usan japonés cuando Chrome se muestra en japonés e inglés en los demás casos. La búsqueda admite Unicode con normalización NFC y coincidencia de subcadenas sin distinguir mayúsculas de minúsculas, independientemente del idioma de la interfaz.

## Funciones

- Retroceder y avanzar por un orden fijo de uso reciente en la ventana actual.
- Mantener pulsado para abrir la lista; seleccionar con Arriba/Abajo y cambiar con Enter.
- Pulsar Izquierda para alternar entre uso reciente y orden real de pestañas; buscar títulos en este último modo.
- Ver nombres/colores de grupos y si los atajos están disponibles en la pestaña de destino.
- Asignar varios atajos por dirección y ajustar la duración y el límite del historial.

## Requisitos

Google Chrome compatible con Manifest V3. El manifiesto declara Chrome 102 como mínimo. El [registro](releases.es.md) distingue los entornos y versiones realmente probados. Windows, Linux, Chrome antiguo y el IME japonés del sistema operativo siguen sin verificarse.

Los atajos se inician dentro de páginas HTTP(S) normales, incluidos iframes. No se pueden iniciar en páginas internas de Chrome, Chrome Web Store, páginas de otras extensiones, archivos locales ni la barra de direcciones.

## Cargar y configurar

1. Descarga y descomprime este repositorio.
2. Abre `chrome://extensions` y activa el modo de desarrollador.
3. Selecciona **Cargar descomprimida** y la carpeta que contiene este README y `manifest.json`.
4. Abre los ajustes desde el icono de tabuchan y revisa los atajos y el comportamiento.

| Acción | macOS | Otros sistemas |
| --- | --- | --- |
| Retroceder | Control + Shift + J | Alt + Shift + J |
| Avanzar | Control + Shift + K | Alt + Shift + K |

En macOS se usa la tecla física Control. Registra combinaciones pulsándolas en los ajustes. Chrome, el sistema u otras extensiones pueden interceptarlas antes de que lleguen a la página.

Una pulsación breve se aplica al soltar una tecla necesaria. La duración predeterminada para abrir la lista es 1 segundo. La lista permanece al soltar todas las teclas: Arriba/Abajo seleccionan, Enter confirma y Esc cancela. Izquierda alterna los modos. En orden de pestañas, escribe para filtrar títulos y usa Backspace para borrar el último carácter. Durante la composición del IME japonés, Enter, Arriba/Abajo y Esc se reservan para el IME.

La duración se ajusta de 0,5 a 2 segundos en pasos de 0,1. El historial conserva 10–30 pestañas anteriores, con 10 por defecto. Las pulsaciones breves omiten por defecto las pestañas sin atajos disponibles; aún pueden seleccionarse explícitamente en la lista.

## Almacenamiento de datos

El historial se conserva por ventana en el almacenamiento local de sesión. Reiniciar el navegador o desactivar, recargar o actualizar la extensión borra el historial, que comienza de nuevo desde la pestaña actual. Atajos y ajustes se guardan localmente. Consulta el [borrador de política de privacidad](privacy-policy.es.md), incluidas las solicitudes de favicons.

## Volver a empaquetar el ZIP

Abre una terminal en la carpeta de este README. Los comandos usan `zip` y `shasum` estándar de macOS para empaquetar los 20 archivos de ejecución y reemplazan el ZIP y su suma de comprobación.

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.1.0.zip" \
  manifest.json \
  options.html \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  icons/tab.svg \
  icons/tab-16.png \
  icons/tab-48.png \
  icons/tab-128.png \
  src/background.js \
  src/controller.js \
  src/history.js \
  src/input-bridge.js \
  src/options.css \
  src/options.js \
  src/overlay.js \
  src/page-input.js \
  src/press-state.js \
  src/settings.js \
  src/shortcuts.js \
  src/tab-access.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.1.0.zip" dist/tabuchan-0.1.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.1.0.zip > tabuchan-0.1.0.zip.sha256)
```

El ZIP contiene `manifest.json` en la raíz y excluye documentos de la tienda, capturas y registros. El SHA-256 puede cambiar al volver a empaquetar; relaciona la suma del ZIP real con el [registro](releases.es.md) antes de distribuirlo.

## Sitio web

Las instrucciones y los documentos públicos se alojan en GitHub Pages. Consulta el estado verificado del despliegue en el [registro](releases.es.md#github-pages).

- [Instrucciones](https://mstksb.github.io/chrome-ext-tabuchan/README.es.html)
- [Borrador de política](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.es.html)

El nombre del responsable, el contacto y la fecha de entrada en vigor siguen pendientes. Finaliza la política antes del envío a la tienda.

## Documentos públicos

| Documento | Contenido |
| --- | --- |
| [README](README.es.md) | Instalación, uso, ajustes, requisitos y empaquetado |
| [Ficha de la tienda](store/listing.es.md) | Textos y capturas |
| [Declaraciones de privacidad](store/privacy.es.md) | Justificación de permisos y declaraciones preliminares |
| [Política de privacidad](privacy-policy.es.md) | Borrador de tratamiento de datos para usuarios |
| [Registro de publicación](releases.es.md) | Versión, archivos, entornos verificados y revisión/publicación |
