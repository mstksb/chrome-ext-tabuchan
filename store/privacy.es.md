---
lang: es
---

# Borrador de declaraciones de privacidad

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | Español | [Deutsch](privacy.de.md)

Este borrador se basa en el código de tabuchan `0.2.0`. Consulta el [registro](../releases.es.md) para ver las tareas pendientes y el estado de verificación y envío.

## Finalidad única

Navegación por teclado a pestañas recientes o encontradas por título en la ventana actual.

## Justificación de permisos

| Permiso | Texto para Dashboard |
| --- | --- |
| `tabs` | Enumerar pestañas por ventana y obtener IDs, títulos, URLs y favicons para historial/listas, disponibilidad de atajos y activación de la pestaña elegida. |
| `tabGroups` | Mostrar nombres/colores y conservar la jerarquía de grupos en el orden de pestañas. |
| `storage` | Guardar atajos/ajustes localmente y mantener historial/recorrido durante la sesión. |
| `scripting` | Inyectar detección de entrada y lista en páginas HTTP(S) abiertas, también después de instalar/actualizar. |
| `http://*/*` y `https://*/*` | Detectar la pulsación y la liberación de teclas de atajo en páginas HTTP(S) y sus iframes, y mostrar la lista en un marco de la extensión insertado en la página principal. Esto permite iniciar atajos desde páginas normales. |

## Obtención, uso y almacenamiento

| Datos | Finalidad | Almacenamiento / conservación |
| --- | --- | --- |
| IDs de pestañas/ventanas, orden reciente, recorrido | Navegación y consistencia | `storage.session.mruState`, durante la sesión |
| Títulos, URLs, favicons, IDs/nombres/colores de grupos | Lista, búsqueda, disponibilidad | APIs Chrome; memoria/estado de lista |
| Eventos de teclas y combinaciones grabadas | Atajos, pulsación prolongada/lista, ajustes | Estado en memoria; combinaciones en `storage.local.mruShortcuts` |
| Duración de la pulsación larga, límite del historial, omisión de pestañas sin atajos al pulsar brevemente y modo de coincidencia de búsqueda | Aplicar ajustes | `storage.local.mruSettings` |
| Texto de búsqueda | Filtrar | Memoria mientras está abierta; descartar al cerrar/cambiar modo |

Los títulos y nombres de grupos se muestran como texto en el marco de la extensión. El campo de búsqueda del mismo marco recibe el texto introducido. El contenido de la lista y el texto de búsqueda se procesan dentro de la extensión. Los eventos de entrada se usan para los atajos, las acciones de la lista y el registro de atajos.

## Solicitudes externas y terceros

Para mostrar favicons en la lista de pestañas y en las notificaciones de los comandos de atajos antiguos de Chrome, el navegador puede enviar solicitudes a los servidores de las URL HTTPS que facilita Chrome. Si Chrome facilita una URL HTTP para un favicon, la extensión muestra un icono alternativo sin solicitar esa URL. Las solicitudes HTTPS de favicons usan `referrerPolicy="no-referrer"`.

Los proveedores de imágenes pueden recibir la dirección IP y los datos habituales de la solicitud del navegador. El tratamiento de las cookies y la caché depende de los ajustes y las políticas de Chrome y del servidor de destino. Los proveedores conservan los registros de acceso según sus propias reglas. Verifica las declaraciones de uso de datos antes del envío.

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
| Política | Comprueba que la [política de privacidad](../privacy-policy.es.md) actualizada esté disponible en GitHub Pages por HTTPS sin inicio de sesión antes de introducir la URL en el Dashboard. |

Declara también los datos que permanecen locales. Finaliza categorías y certificaciones según definiciones actuales: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Conservación y eliminación

Reinicio, desactivación/recarga/actualización borran el historial de sesión. Se eliminan pestañas cerradas y entradas que excedan un límite reducido. Ajustes permanecen hasta modificarse; desinstalar elimina el almacenamiento. Búsquedas se descartan al cerrar/cambiar modo. Administra cachés con controles de datos de navegación. Consulta la [política de privacidad](../privacy-policy.es.md).

## Confirmaciones pendientes

Responsable de la publicación: `mstksb`. Contacto: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com). Esta política entra en vigor en la fecha de publicación de la versión `0.2.0` de tabuchan en Chrome Web Store.

Ya se ha comprobado que la [URL existente](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) de la política es accesible sin inicio de sesión. La política actualizada está en el repositorio y su despliegue en GitHub Pages queda pendiente. La condición de Trader / Non-Trader, la verificación de la cuenta y los destinos de distribución siguen pendientes. Consulta el [registro](../releases.es.md) para ver el estado actual.
