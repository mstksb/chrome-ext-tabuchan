---
lang: pt-BR
---

# Texto preliminar para a Chrome Web Store

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | Português (Brasil) | [Español](listing.es.md) | [Deutsch](listing.de.md)

Baseado na versão candidata pública `0.1.0`. Valores confirmados e pendências constam no [registro de lançamento](../releases.pt-BR.md).

## Informações básicas

| Campo | Texto / situação |
| --- | --- |
| Nome | tabuchan |
| Versão | 0.1.0, primeira candidata pública |
| Idiomas da documentação/loja | Inglês como base; japonês, chinês simplificado/tradicional, português do Brasil, espanhol e alemão. Idiomas salvos no Dashboard não verificados |
| Idiomas da interface | Japonês quando o Chrome está em japonês, inglês nos demais casos; documentação não amplia a interface |
| Categoria proposta | Functionality & UI, conforme categoria oficial atual para gerenciamento de abas/atalhos; valor salvo não verificado |
| Resumo | Alterne entre abas recentes com um toque. Mantenha o atalho pressionado para listar, buscar e escolher abas na janela atual. |
| Página inicial / suporte | [Instruções](https://mstksb.github.io/chrome-ext-tabuchan/README.pt-BR.html); canal de suporte a definir pelo responsável |
| Visibilidade / países | A definir pelo responsável |
| Política | [URL pública](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html); responsável e vigência pendentes, finalizar antes do envio |

## Descrição detalhada

tabuchan permite alternar entre abas da janela atual com atalhos de teclado.

Toque em Voltar ou Avançar para percorrer uma ordem fixa de uso recente. Por padrão, abas onde os atalhos não estão disponíveis são puladas.

Mantenha toda a combinação pressionada para abrir a lista. Cima/baixo selecionam, Enter alterna e Esc cancela. A lista permanece aberta ao soltar o atalho.

A seta para a esquerda alterna uso recente e ordem das abas. Na ordem das abas, os grupos são preservados e os títulos podem ser filtrados com texto Unicode, independentemente da interface. A busca usa NFC e trechos sem diferenciar maiúsculas/minúsculas.

As configurações permitem vários atalhos por ação, tempo de 0,5–2 segundos e histórico de 10–30 abas anteriores. Padrões: 1 segundo e 10 abas.

No macOS: Control + Shift + J para Voltar e Control + Shift + K para Avançar. Outros sistemas: Alt + Shift + J/K. Grave suas combinações nas configurações.

Atalhos começam em páginas HTTP(S) comuns, inclusive iframes, mas não em páginas internas, Chrome Web Store, outras extensões, arquivos ou barra de endereço. Abas restritas podem ser escolhidas em uma lista aberta numa página comum.

Histórico e configurações são processados e salvos localmente. Favicons podem gerar solicitações ao provedor da imagem. Consulte a política de privacidade.

## Capturas de tela

| Arquivo | Conteúdo / preparação |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Ícone existente convertido para PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Configurações em inglês, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Lista por ordem das abas e grupo Work, aberta com teclas reais, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Configurações reais em japonês com atalhos padrão, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Lista recente em japonês com abas de teste e teclas reais, 1280×800 |

As imagens japonesas foram capturadas nos testes Chrome de `0.1.0`. As inglesas vieram do Chrome real com o mesmo código e apenas o dicionário inglês, verificando tradução/layout. A seleção automática de inglês no pacote bilíngue original segue não verificada. Os quatro PNGs são opacos, de 1280×800, e foram conferidos visualmente; a lista usa dados de exemplo. Não há imagens nem tradução da interface para os outros idiomas da documentação.

## Instruções para revisão

Não há conta nem login. Abra várias abas HTTP(S) na mesma janela e visite-as em sequência. Teste toques nos atalhos padrão acima; mantenha a combinação por pelo menos 1 segundo e use cima/baixo, Enter e Esc. Alterne os modos com esquerda e busque um título na ordem das abas. Abra configurações pelo ícone e confirme `0.1.0`.

## Base do texto

Implementação atual e testes Chrome da candidata: MRU fixo, toques/pressionamento, grupos/busca, configurações, iframes e abas restritas. IMEs nativos, outros sistemas, Chrome antigo e seleção real de inglês/fallback não verificados; veja o [registro](../releases.pt-BR.md).

Campos e requisitos de imagens foram conferidos em 9 de novembro de 2026. Confira os campos atuais antes do envio: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
