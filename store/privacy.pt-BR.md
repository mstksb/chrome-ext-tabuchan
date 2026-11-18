---
lang: pt-BR
---

# Declarações de privacidade preliminares

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | Português (Brasil) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

Este rascunho é baseado no código do tabuchan `0.2.0`. Consulte o [registro](../releases.pt-BR.md) para ver pendências e o estado da verificação e do envio.

## Finalidade única

Permitir navegação pelo teclado para abas recentes ou encontradas pelo título na janela atual.

## Justificativas das permissões

| Permissão | Texto para o Dashboard |
| --- | --- |
| `tabs` | Enumerar abas por janela e obter IDs, títulos, URLs e URLs de favicons para histórico/listas, disponibilidade dos atalhos e ativação da aba escolhida. |
| `tabGroups` | Mostrar nomes/cores dos grupos e preservar sua hierarquia na lista por ordem das abas. |
| `storage` | Salvar atalhos/configurações localmente e manter histórico/estado de navegação durante a sessão. |
| `scripting` | Injetar detecção de entrada e lista nas páginas HTTP(S) abertas, inclusive após instalar/atualizar. |
| `http://*/*` e `https://*/*` | Detectar quando teclas de atalho são pressionadas ou soltas em páginas HTTP(S) e seus iframes, e exibir a lista em um quadro da extensão incorporado à página principal. Isso permite iniciar atalhos em páginas comuns. |

## Coleta, uso e armazenamento

| Dados | Uso | Armazenamento / retenção |
| --- | --- | --- |
| IDs de abas/janelas, ordem recente, estado de navegação | Navegação recente e consistência | `storage.session.mruState`, durante a sessão |
| Títulos, URLs, favicons, IDs/nomes/cores de grupos | Lista, busca, disponibilidade | APIs Chrome, em memória/estado da lista |
| Eventos de teclas e combinações gravadas | Atalhos, pressionamento prolongado/lista, configuração | Estado na memória; combinações em `storage.local.mruShortcuts` |
| Tempo de pressionamento, limite do histórico, opção de pular abas sem atalhos no toque e modo de correspondência da busca | Comportamento escolhido | `storage.local.mruSettings` |
| Texto da busca por título | Filtragem | Memória enquanto aberta; descartado ao fechar/mudar modo |

Títulos e nomes de grupos aparecem como texto dentro do quadro da extensão. O campo de busca no mesmo quadro recebe o texto digitado. O conteúdo da lista e o texto da busca são processados dentro da extensão. Os eventos de entrada são usados para atalhos, ações da lista e gravação de atalhos.

## Solicitações externas e terceiros

Para exibir favicons na lista de abas e nas notificações dos comandos de atalho antigos do Chrome, o navegador pode enviar solicitações aos servidores dos endereços HTTPS fornecidos pelo Chrome. Quando o Chrome informa um endereço HTTP de favicon, a extensão exibe um ícone substituto sem solicitar esse endereço. As solicitações HTTPS de favicons usam `referrerPolicy="no-referrer"`.

Os provedores das imagens podem receber o endereço IP e informações comuns da solicitação do navegador. O tratamento de cookies e do cache depende das configurações e políticas do Chrome e do servidor de destino. Os provedores retêm registros de acesso conforme suas próprias regras. Confira as declarações de uso de dados antes do envio.

O código executável referencia JavaScript do pacote; favicons são imagens. A auditoria existente não encontrou download/execução de JavaScript ou WASM externos nem avaliação dinâmica.

## Campos de uso de dados do Dashboard

| Campo | Texto / critério |
| --- | --- |
| Web history | Declarar URLs de abas e ordem recente processadas localmente |
| Website content | Declarar títulos, favicons e busca digitada usados na lista/filtragem |
| User activity | Seleção, eventos de teclas e operações da lista; definir escopo conforme descrição atual |
| Outros tipos | Responsável deve comparar definições atuais com o código |
| Remote code | Resposta preliminar: “No, I am not using remote code.”, baseada na auditoria |
| Certificação Limited Use | Responsável deve verificar e certificar finalidade/uso dos dados |
| URL da política | Confirme se a [política de privacidade](../privacy-policy.pt-BR.md) atualizada está acessível no GitHub Pages via HTTPS sem login antes de informar a URL no Dashboard. |

Declare também o tratamento exclusivamente local. Finalize categorias/certificações com as definições atuais: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Retenção e exclusão

Reinício do navegador ou desativação/recarga/atualização apagam o histórico de sessão. Abas fechadas e entradas além do limite reduzido são removidas. Configurações permanecem até alteração; desinstalar exclui o armazenamento da extensão. A busca é descartada ao fechar/mudar modo. Gerencie caches nas opções de dados de navegação. Veja a [política de privacidade](../privacy-policy.pt-BR.md).

## Confirmações do responsável

Responsável pela publicação: `mstksb`. Contato: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com). Esta política entra em vigor na data de publicação da versão `0.2.0` do tabuchan na Chrome Web Store.

O [URL existente da política](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) já foi verificado sem login. A versão atualizada da política está no repositório e aguarda implantação no GitHub Pages. A condição de Trader / Non-Trader, a verificação da conta e os destinos de distribuição seguem pendentes. Consulte o [registro](../releases.pt-BR.md) para acompanhar o estado atual.
