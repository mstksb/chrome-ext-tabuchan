---
lang: es
---

# Borrador de declaraciones de privacidad

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | Español | [Deutsch](privacy.de.md)

Para la candidata pública `0.1.0`, según el código actual. Verificación del responsable, situación legal y contacto pendientes antes de publicar. Estado y pendientes en el [registro](../releases.es.md).

## Finalidad única

Navegación por teclado a pestañas recientes o encontradas por título en la ventana actual.

## Justificación de permisos

| Permiso | Texto para Dashboard |
| --- | --- |
| `tabs` | Enumerar pestañas por ventana y obtener IDs, títulos, URLs y favicons para historial/listas, disponibilidad de atajos y activación de la pestaña elegida. |
| `tabGroups` | Mostrar nombres/colores y conservar la jerarquía de grupos en el orden de pestañas. |
| `storage` | Guardar atajos/ajustes localmente y mantener historial/recorrido durante la sesión. |
| `scripting` | Inyectar detección de entrada y lista en páginas HTTP(S) abiertas, también después de instalar/actualizar. |
| `http://*/*` y `https://*/*` | Detectar pulsación/liberación en páginas HTTP(S) e iframes y mostrar la lista en el marco principal, para iniciar desde cualquier página normal. |

## Obtención, uso y almacenamiento

| Datos | Finalidad | Almacenamiento / conservación |
| --- | --- | --- |
| IDs de pestañas/ventanas, orden reciente, recorrido | Navegación y consistencia | `storage.session.mruState`, durante la sesión |
| Títulos, URLs, favicons, IDs/nombres/colores de grupos | Lista, búsqueda, disponibilidad | APIs Chrome; memoria/estado de lista |
| Eventos de teclas y combinaciones grabadas | Atajos, pulsación prolongada/lista, ajustes | Estado en memoria; combinaciones en `storage.local.mruShortcuts` |
| Duración, límite, omisión de pestañas | Aplicar ajustes | `storage.local.mruSettings` |
| Texto de búsqueda | Filtrar | Memoria mientras está abierta; descartar al cerrar/cambiar modo |

Títulos y grupos se muestran como texto en la lista insertada en la página. La búsqueda usa su campo de entrada. Los eventos sirven para atajos, lista y registro de combinaciones.

## Solicitudes externas y terceros

Usar URLs HTTP(S) de favicons puede generar solicitudes del navegador al servidor indicado por Chrome. El código fija `referrerPolicy="no-referrer"`.

El proveedor puede recibir IP y datos habituales de solicitud. Cookies, caché y contenido mixto dependen de Chrome y del destino; sus registros siguen sus propias reglas. Las imágenes HTTP y el tratamiento seguro deben comprobarse antes del envío.

El código ejecutable referencia JavaScript incluido; favicons son imágenes. La auditoría existente no detectó descarga/ejecución de JavaScript o WASM externos ni evaluación dinámica.

## Campos de uso de datos

| Campo | Borrador / criterio |
| --- | --- |
| Web history | Declarar URLs y orden reciente tratados localmente |
| Website content | Declarar títulos, favicons y búsquedas escritos por el usuario |
| User activity | Selección, teclas y operaciones; concretar alcance según definición actual |
| Otros tipos | Responsable compara definiciones actuales con implementación |
| Remote code | Respuesta preliminar “No, I am not using remote code.” según auditoría |
| Limited Use | Responsable verifica y certifica finalidad/uso |
| Política | Publicar el [borrador](../privacy-policy.es.md) con responsable/contacto en HTTPS sin inicio de sesión |

Declara también los datos que permanecen locales. Finaliza categorías y certificaciones según definiciones actuales: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Conservación y eliminación

Reinicio, desactivación/recarga/actualización borran el historial de sesión. Se eliminan pestañas cerradas y entradas que excedan un límite reducido. Ajustes permanecen hasta modificarse; desinstalar elimina el almacenamiento. Búsquedas se descartan al cerrar/cambiar modo. Administra cachés con controles de datos de navegación. Consulta la [política](../privacy-policy.es.md).

## Confirmaciones pendientes

La [URL existente](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) se verificó sin autenticación; no se confirmó el despliegue de las nuevas traducciones. Responsable, contacto, vigencia, condición Trader / Non-Trader, verificación de cuenta y destinos siguen pendientes. Finaliza antes del envío y registra el estado en el [registro](../releases.es.md).
