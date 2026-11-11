---
lang: pt-BR
---

# Declarações de privacidade preliminares

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | Português (Brasil) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

Para a candidata pública `0.1.0`, conforme o código atual. Verificação do responsável, situação jurídica e contato devem ser definidos antes da publicação. Consulte pendências e situação no [registro](../releases.pt-BR.md).

## Finalidade única

Permitir navegação pelo teclado para abas recentes ou encontradas pelo título na janela atual.

## Justificativas das permissões

| Permissão | Texto para o Dashboard |
| --- | --- |
| `tabs` | Enumerar abas por janela e obter IDs, títulos, URLs e URLs de favicons para histórico/listas, disponibilidade dos atalhos e ativação da aba escolhida. |
| `tabGroups` | Mostrar nomes/cores dos grupos e preservar sua hierarquia na lista por ordem das abas. |
| `storage` | Salvar atalhos/configurações localmente e manter histórico/estado de navegação durante a sessão. |
| `scripting` | Injetar detecção de entrada e lista nas páginas HTTP(S) abertas, inclusive após instalar/atualizar. |
| `http://*/*` e `https://*/*` | Detectar pressionamento/liberação de atalhos nas páginas HTTP(S) e iframes e mostrar a lista no frame principal, permitindo iniciar em páginas comuns arbitrárias. |

## Coleta, uso e armazenamento

| Dados | Uso | Armazenamento / retenção |
| --- | --- | --- |
| IDs de abas/janelas, ordem recente, estado de navegação | Navegação recente e consistência | `storage.session.mruState`, durante a sessão |
| Títulos, URLs, favicons, IDs/nomes/cores de grupos | Lista, busca, disponibilidade | APIs Chrome, em memória/estado da lista |
| Eventos de teclas e combinações gravadas | Atalhos, pressionamento prolongado/lista, configuração | Estado na memória; combinações em `storage.local.mruShortcuts` |
| Tempo, limite de histórico, opção de pular abas | Comportamento escolhido | `storage.local.mruSettings` |
| Texto da busca por título | Filtragem | Memória enquanto aberta; descartado ao fechar/mudar modo |

Títulos e grupos são renderizados como texto na lista inserida na página. A busca usa seu campo de entrada. Eventos atendem atalhos, lista e gravação de combinações.

## Solicitações externas e terceiros

Usar uma URL HTTP(S) de favicon como imagem pode gerar uma solicitação do navegador ao servidor informado pelo Chrome. O código define `referrerPolicy="no-referrer"`.

O provedor pode receber IP e informações comuns de requisição. Cookies, cache e conteúdo misto dependem do Chrome e do destino; logs seguem as regras do provedor. O uso de imagens HTTP e a conformidade com tratamento seguro de dados precisam ser verificados antes do envio.

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
| URL da política | Publicar a [política preliminar](../privacy-policy.pt-BR.md) com responsável/contato em HTTPS sem login |

Declare também o tratamento exclusivamente local. Finalize categorias/certificações com as definições atuais: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Retenção e exclusão

Reinício do navegador ou desativação/recarga/atualização apagam o histórico de sessão. Abas fechadas e entradas além do limite reduzido são removidas. Configurações permanecem até alteração; desinstalar exclui o armazenamento da extensão. A busca é descartada ao fechar/mudar modo. Gerencie caches nas opções de dados de navegação. Veja a [política](../privacy-policy.pt-BR.md).

## Confirmações do responsável

A [URL existente da política](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) foi verificada sem autenticação; a implantação das novas traduções não foi confirmada. Dados do responsável, contato, vigência, condição Trader / Non-Trader, verificação da conta e destinos de distribuição seguem indefinidos. Finalize antes do envio e acompanhe no [registro](../releases.pt-BR.md).
