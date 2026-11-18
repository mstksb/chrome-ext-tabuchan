---
lang: pt-BR
---

# Política de privacidade do tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | Português (Brasil) | [Español](privacy-policy.es.md) | [Deutsch](privacy-policy.de.md)

Esta política entra em vigor na data de publicação da versão `0.2.0` do tabuchan na Chrome Web Store. Consulte o [registro de lançamento](releases.pt-BR.md) para acompanhar a publicação.

## Finalidade

tabuchan oferece navegação pelo teclado para abas recentes e abas encontradas pelo título na janela atual.

## Informações tratadas

- IDs de abas e janelas, títulos, URLs, URLs de favicons e IDs, nomes e cores de grupos obtidos do Chrome.
- Ordem de seleção das abas, ordem fixa de navegação e seleção na lista.
- Eventos de pressionamento/liberação de atalhos detectados nas páginas, operações da lista e texto de busca por título.
- Combinações de teclas, tempo de pressionamento, limite do histórico, opção de pular abas sem atalhos no toque e modo de correspondência da busca escolhidos pelo usuário.

Esses dados permitem alternar abas, criar histórico/listas, buscar títulos, indicar a disponibilidade dos atalhos e aplicar as configurações do usuário.

## Processamento e armazenamento locais

O histórico e o estado de navegação ficam no armazenamento local de sessão de extensões do Chrome, `storage.session`, principalmente como IDs de abas, ordem e seleção. Atalhos e configurações ficam em `storage.local`.

Títulos, URLs e grupos são obtidos do Chrome durante o processamento. A lista é exibida em um quadro da extensão incorporado à página atual, com títulos e nomes de grupos em texto. O conteúdo da lista e o texto da busca são processados dentro da extensão. O texto da busca e o estado das teclas são usados na memória durante o processamento.

## Solicitações de rede para favicons

Para exibir favicons na lista de abas e nas notificações dos comandos de atalho antigos do Chrome, o navegador pode solicitar imagens nos endereços HTTPS fornecidos pelo Chrome. Quando o Chrome informa um endereço HTTP de favicon, a extensão exibe um ícone substituto sem solicitar esse endereço.

Os provedores das imagens podem receber o endereço IP do usuário e informações comuns da solicitação. A extensão especifica `no-referrer` nessas solicitações. O tratamento de cookies e do cache depende das configurações e políticas do Chrome e do servidor de destino. Cada provedor define as regras de retenção dos registros de acesso e de outros tratamentos.

## Retenção e exclusão

O histórico de sessão é apagado ao reiniciar o navegador ou desativar, recarregar ou atualizar a extensão. Um novo histórico começa na aba atual. Fechar uma aba a remove do histórico; reduzir o limite remove as entradas mais antigas que o excederem.

Atalhos e configurações permanecem no dispositivo até serem alterados pelo usuário, pela página de configurações. Ao remover a extensão, o Chrome exclui seu armazenamento. Caches de imagens gerenciados pelo navegador podem ser controlados pela limpeza de dados de navegação.

O texto de busca é usado enquanto a lista está aberta e descartado ao fechá-la ou mudar de modo.

## Escopo do uso dos dados

As informações são usadas para alternar abas, exibir listas, buscar e configurar o comportamento descrito nesta política. Solicitações a provedores externos estão relacionadas à exibição de favicons. As declarações de uso de dados na Chrome Web Store devem refletir esse tratamento.

## Responsável e contato

Responsável pela publicação: `mstksb`. Contato: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com).

A URL pública da política está [aqui](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html). Alterações na política devem constar na ficha da loja com a versão aplicável e o tratamento atualizado dos dados.
