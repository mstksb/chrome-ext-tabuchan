---
lang: pt-BR
---

# Política de privacidade preliminar do tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | Português (Brasil) | [Español](privacy-policy.es.md) | [Deutsch](privacy-policy.de.md)

Este texto se aplica à versão `0.1.0`. O nome do responsável pela publicação, o contato e a data de publicação/vigência ainda não foram definidos. Consulte o [registro de lançamento](releases.pt-BR.md).

## Finalidade

tabuchan oferece navegação pelo teclado para abas recentes e abas encontradas pelo título na janela atual.

## Informações tratadas

- IDs de abas e janelas, títulos, URLs, URLs de favicons e IDs, nomes e cores de grupos obtidos do Chrome.
- Ordem de seleção das abas, ordem fixa de navegação e seleção na lista.
- Eventos de pressionamento/liberação de atalhos detectados nas páginas, operações da lista e texto de busca por título.
- Combinações de teclas, tempo de pressionamento, limite do histórico e opção de pular abas configurados pelo usuário.

Esses dados permitem alternar abas, criar histórico/listas, buscar títulos, indicar a disponibilidade dos atalhos e aplicar as configurações do usuário.

## Processamento e armazenamento locais

O histórico e o estado de navegação ficam no armazenamento local de sessão de extensões do Chrome, `storage.session`, principalmente como IDs de abas, ordem e seleção. Atalhos e configurações ficam em `storage.local`.

Títulos, URLs e grupos são obtidos do Chrome durante o processamento. A lista é exibida dentro da página atual, com títulos e nomes de grupos renderizados como texto. Texto de busca e estado das teclas são usados na memória durante o processamento.

## Solicitações de rede para favicons

A lista pode exibir favicons usando URLs HTTP(S) de imagens fornecidas pelo Chrome. Isso pode gerar solicitações do navegador do usuário ao servidor das imagens.

O provedor pode receber o endereço IP e informações comuns da solicitação. A extensão especifica `no-referrer` nessas solicitações. Cookies, cache e conteúdo misto dependem das configurações/políticas do Chrome e do destino. A retenção de registros de acesso e outros tratamentos seguem as regras de cada provedor.

## Retenção e exclusão

O histórico de sessão é apagado ao reiniciar o navegador ou desativar, recarregar ou atualizar a extensão. Um novo histórico começa na aba atual. Fechar uma aba a remove do histórico; reduzir o limite remove as entradas mais antigas que o excederem.

Atalhos e configurações permanecem no dispositivo até serem alterados pelo usuário, pela página de configurações. Ao remover a extensão, o Chrome exclui seu armazenamento. Caches de imagens gerenciados pelo navegador podem ser controlados pela limpeza de dados de navegação.

O texto de busca é usado enquanto a lista está aberta e descartado ao fechá-la ou mudar de modo.

## Escopo do uso dos dados

As informações são usadas para alternar abas, exibir listas, buscar e configurar o comportamento descrito nesta política. Solicitações a provedores externos estão relacionadas à exibição de favicons. As declarações de uso de dados na Chrome Web Store devem refletir esse tratamento.

## Responsável e contato

A URL pública da política está [aqui](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html). O responsável, o canal de contato e a data de vigência precisam ser definidos antes do envio à loja. Alterações na política devem ser refletidas na página da loja, identificando a versão aplicável e o tratamento atualizado.
