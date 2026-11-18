---
lang: pt-BR
---

# Texto preliminar para a Chrome Web Store

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | Português (Brasil) | [Español](listing.es.md) | [Deutsch](listing.de.md)

Este pacote usa a versão `0.2.0`. A versão a enviar depende do histórico de uploads no Dashboard. Consulte o [registro de lançamento](../releases.pt-BR.md) para arquivos, ambientes verificados e estado da loja.

## Informações básicas

| Campo | Texto / situação |
| --- | --- |
| Nome | tabuchan |
| Versão | `0.2.0` |
| Idiomas da documentação/loja | Inglês como base; japonês, chinês simplificado/tradicional, português do Brasil, espanhol e alemão. Idiomas salvos no Dashboard não verificados |
| Idiomas da interface | Japonês quando o Chrome está em japonês, inglês nos demais casos; documentação não amplia a interface |
| Categoria proposta | Functionality & UI, conforme categoria oficial atual para gerenciamento de abas/atalhos; valor salvo não verificado |
| Resumo | Alterne entre abas recentes com um toque. Mantenha o atalho pressionado para listar, buscar e escolher abas na janela atual. |
| Página inicial / suporte | [Instruções](https://mstksb.github.io/chrome-ext-tabuchan/README.pt-BR.html); canal de suporte a definir pelo responsável |
| Visibilidade / países | A definir pelo responsável |
| Política | [URL pública](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html); responsável e vigência pendentes, finalizar antes do envio |

## Descrição detalhada

tabuchan permite alternar entre abas da janela atual com atalhos de teclado.

Mantenha as teclas modificadoras pressionadas e pressione e solte a tecla comum para Voltar ou Avançar em uma ordem fixa. Ao soltar um modificador necessário, a aba exibida passa a ser a mais recente. Abas sem atalhos disponíveis são puladas por padrão.

Pressione Enter em qualquer uma das listas, inclusive nos resultados da busca, ou selecione uma aba diretamente no Chrome para torná-la a mais recente. Se ela já estava no histórico, sua entrada anterior é removida e as demais abas mantêm a ordem.

Mantenha toda a combinação pressionada para abrir a lista. Cima/baixo selecionam, Enter alterna e Esc cancela. A lista permanece aberta ao soltar o atalho.

Pressione a seta para a esquerda para alternar entre uso recente e ordem das abas. Na ordem das abas, a lista preserva os grupos e filtra títulos independentemente do idioma da interface. Separe os termos de busca com espaços. A correspondência parcial (padrão) encontra títulos que contêm todos os termos em qualquer ordem. A busca por prefixo exige que o título comece com o primeiro termo e contenha os demais na ordem digitada, mesmo com caracteres entre eles. Os dois modos usam normalização Unicode NFC e ignoram diferenças entre maiúsculas e minúsculas.

Você pode configurar vários atalhos por ação. O tempo de pressionamento pode variar de 0,2 a 2,0 segundos, em passos de 0,1 segundo, com padrão de 0,5 segundo. O histórico guarda de 10 a 30 abas anteriores, com padrão de 10. Abas sem atalhos disponíveis aparecem em cinza na lista e mantêm a altura da linha. Você ainda pode selecioná-las com Enter.

No macOS: Control + Shift + J para Voltar e Control + Shift + K para Avançar. Outros sistemas: Alt + Shift + J/K. Grave suas combinações nas configurações.

Atalhos começam em páginas HTTP(S) comuns, inclusive iframes, mas não em páginas internas, Chrome Web Store, outras extensões, arquivos ou barra de endereço. Abas restritas podem ser escolhidas em uma lista aberta numa página comum.

Histórico e configurações são processados e salvos localmente. Favicons podem gerar solicitações ao provedor da imagem. Consulte a política de privacidade.

## Capturas de tela

| Arquivo | Conteúdo / preparação |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Ícone existente convertido para PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Duração padrão de 0,5 segundo e opções de correspondência da busca em inglês, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Lista de abas em inglês, com grupos, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Duração padrão de 0,5 segundo e opções de correspondência da busca em japonês, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Lista de abas em japonês, com grupos, 1280×800 |

As quatro capturas de 1280×800 mostram o mesmo pacote bilíngue no Chrome for Testing Stable `158.0.8127.36` (Linux arm64), com a interface do Chrome em japonês e em inglês. As listas usam abas de exemplo.

## Instruções para revisão

Não é necessário criar conta nem fazer login. Visite várias abas HTTP(S) em uma janela. Mantenha as teclas modificadoras pressionadas e pressione e solte as teclas comuns de Voltar e Avançar. Solte um modificador necessário e confira se a aba exibida se torna a mais recente. Mantenha a combinação completa pressionada por pelo menos 0,5 segundo para abrir a lista. Use a seta para a esquerda para ver a ordem das abas, filtre pelo título e confirme com Enter. Abra as configurações pelo ícone da barra e confirme a versão `0.2.0`.

## Base do texto

A versão candidata passou em 21 grupos de testes de ponta a ponta no Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Outros três grupos verificaram a interface em japonês e em inglês e o uso do inglês com o Chrome em francês, incluindo busca de títulos com Unicode.

Campos e requisitos de imagens foram conferidos em 9 de novembro de 2026. Confira os campos atuais antes do envio: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
