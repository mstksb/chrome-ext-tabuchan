---
lang: pt-BR
---

# Registro de lançamento

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | Português (Brasil) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

Em 11 de novembro de 2026, o README e os documentos públicos existentes foram publicados pelo GitHub Pages a partir da raiz da branch `main`. O README é a página inicial; o Jekyll padrão converte links Markdown relativos em URLs HTML. Os documentos continuam sendo editados em Markdown. `src/`, `options.html` e `manifest.json` ficam fora do site gerado.

A compilação e a implantação iniciais das [instruções](https://mstksb.github.io/chrome-ext-tabuchan/) e da [política preliminar](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) foram concluídas. Ambas foram acessadas por HTTPS sem autenticação e conferidas no navegador. Responsável, contato e vigência seguem indefinidos; a política não está finalizada para envio. Essa verificação histórica não confirma a implantação das novas traduções.

O registro acima descreve implantações anteriores. A implantação da atualização de 18 de novembro de 2026 ainda não foi verificada.

## 0.2.0

A versão 0.2.0 altera quando a troca de aba é registrada no histórico. Também melhora a lista e a alternância entre abas e corrige o retorno do foco ao fechar uma lista aberta em um iframe.

Mantenha pressionadas as teclas modificadoras necessárias e pressione e solte rapidamente a tecla comum de Voltar ou Avançar. Cada toque alterna uma aba na ordem fixa do histórico. Ao soltar um modificador necessário, a aba exibida passa a ser a mais recente.

Pressione Enter em qualquer uma das listas, inclusive nos resultados da busca, ou selecione uma aba diretamente no Chrome para torná-la a mais recente. Se ela já estava no histórico, sua entrada anterior é removida e as demais abas mantêm a ordem.

| Item | Detalhes |
| --- | --- |
| Versão | Este pacote usa a versão `0.2.0`. A versão a enviar depende do histórico de uploads no Dashboard. |
| ZIP | [tabuchan-0.2.0.zip](dist/tabuchan-0.2.0.zip), 29 arquivos de execução e manifesto na raiz |
| SHA-256 | `f7a7b26c5486aa8ee8054c5ca826a33992c8e3d5f3a512a6099e4874b830938e` |
| Soma de verificação | [tabuchan-0.2.0.zip.sha256](dist/tabuchan-0.2.0.zip.sha256) |
| Requisitos | Chrome com Manifest V3; mínimo declarado de Chrome 102 |
| Loja | Ainda é necessário verificar o pacote, o ID e o URL do item no Dashboard e o estado da revisão e da publicação. |

## Verificação da versão 0.2.0

A versão candidata passou em 184 testes de Node. No Chrome for Testing Stable `158.0.8127.36` (Linux arm64), passaram 21 grupos de testes de ponta a ponta das operações principais e outros três grupos para japonês, inglês e inglês com o Chrome em francês.

Os 24 grupos de testes de navegador também passaram com o ZIP extraído, incluindo a versão exibida nas configurações. O [rascunho da página da loja](store/listing.pt-BR.md) tem quatro capturas de 1280×800 feitas a partir do ZIP em japonês e inglês.


## 0.1.0

Esta versão candidata atualiza a detecção de páginas restritas e a aparência das abas afetadas, reduz os tempos mínimo e padrão de pressionamento e adiciona busca com vários termos por correspondência parcial ou por prefixo. Também corrige problemas na troca de abas e nas configurações.

As configurações e a lista usam japonês quando o idioma de exibição do Chrome é japonês, e inglês nos demais casos. Separe os termos de busca com espaços. A correspondência parcial (padrão) encontra títulos que contêm todos os termos em qualquer ordem. A busca por prefixo exige que o título comece com o primeiro termo e contenha os demais na ordem digitada, mesmo com caracteres entre eles. Os dois modos usam normalização Unicode NFC e ignoram diferenças entre maiúsculas e minúsculas.

| Item | Detalhes |
| --- | --- |
| Versão | O pacote anterior usava a versão `0.1.0`. |
| ZIP | `tabuchan-0.1.0.zip`, 29 arquivos de execução e manifesto na raiz |
| SHA-256 | `25a07b0f94b01a9bc9d9ea5ce05d9e258b584a7560ace136fa10716a1e6d9982` |
| Soma de verificação | `tabuchan-0.1.0.zip.sha256` |
| Requisitos | Chrome com Manifest V3; mínimo declarado de Chrome 102 |
| Loja | Ainda é necessário verificar o pacote, o ID e o URL do item no Dashboard e o estado da revisão e da publicação. |

## Verificação da versão candidata 0.1.0 de 18 de novembro de 2026

A versão candidata passou em 21 grupos de testes de ponta a ponta no Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Outros três grupos verificaram a interface em japonês e em inglês e o uso do inglês com o Chrome em francês, incluindo busca de títulos com Unicode. Os 24 grupos também passaram com a extensão carregada a partir do ZIP de distribuição extraído. A versão exibida nas configurações correspondeu ao manifesto do ZIP.

A [página da loja](store/listing.pt-BR.md#capturas-de-tela) contém imagens japonesas/inglesas das configurações e da lista: PNGs opacos de 1280×800 com abas de exemplo.

## Verificação da versão candidata anterior

Em 10 de novembro de 2026, no macOS e Chrome `156.0.8078.80`, foram verificadas a interface japonesa e as operações principais: toques, pressionamento prolongado, seleção/cancelamento, ordem/grupos, persistência das configurações, iframes, abas restritas, busca e encaminhamento de operações durante composição por IME. A interface japonesa e a busca NFC também foram verificadas em uma extração separada do ZIP.

Em 11 de novembro de 2026, 17 grupos de operações foram verificados com os arquivos deste repositório no macOS e Chrome `157.0.8103.40`, idioma `ja`, incluindo a versão `0.1.0` nas configurações. O funcionamento após recarregar a extensão não foi verificado.

Verificações de configuração/automatizadas cobrem chaves japonês/inglês, referências do manifesto, caracteres pré-compostos/combinantes NFC e trechos multilíngues/com emojis. O layout inglês foi conferido em uma configuração de captura com o mesmo código e dicionário inglês.

## Não verificado ou indefinido

- Windows, versões antigas do Chrome e IMEs nativos do sistema.
- Funcionamento após recarregar no Chrome comum.
- Responsável/contato, licença, visibilidade e países de distribuição.
- Responsável, contato e vigência da política; conformidade dos dados, inclusive favicons HTTP.
- Salvamento dos textos/declarações no Dashboard e situação de revisão/publicação.

Finalize esses pontos antes do envio à loja. As declarações e a política preliminares são materiais de preparação, não comprovantes de conclusão dos requisitos.
