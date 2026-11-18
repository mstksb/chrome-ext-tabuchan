---
lang: pt-BR
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | Português (Brasil) | [Español](README.es.md) | [Deutsch](README.de.md)

Extensão do Chrome para alternar entre abas recentes pelo teclado. Toque no atalho para percorrer o histórico ou mantenha-o pressionado para abrir a lista de abas.

Este pacote usa a versão `0.2.1`. Consulte o [registro de lançamento](releases.pt-BR.md) para arquivos, ambientes verificados e estado da loja.

A documentação está disponível em inglês, japonês, chinês simplificado, chinês tradicional, português do Brasil, espanhol e alemão. Isso é independente dos idiomas da interface: as configurações e a lista usam japonês quando o idioma de exibição do Chrome é japonês, e inglês nos demais casos.

## Recursos

- Voltar e avançar por uma ordem fixa de uso recente na janela atual.
- Manter o atalho pressionado para abrir a lista; selecionar com as setas para cima/baixo e alternar com Enter.
- Usar a seta para a esquerda para alternar entre uso recente e ordem das abas; buscar títulos na lista por ordem das abas.
- Exibir nomes dos grupos e indicar se os atalhos estão disponíveis na aba de destino.
- Atribuir vários atalhos a cada direção e configurar o tempo de pressionamento e o limite do histórico.

## Requisitos

Google Chrome compatível com Manifest V3. O manifesto declara Chrome 102 como versão mínima. O [registro de lançamento](releases.pt-BR.md) distingue os ambientes e versões efetivamente testados. Windows, versões antigas do Chrome e IMEs nativos do sistema ainda não foram verificados. Em Linux, os testes usaram o Chrome for Testing arm64 sem interface gráfica.

Inicie os atalhos dentro de páginas HTTP(S) comuns, inclusive em iframes. Não é possível iniciá-los em páginas internas do Chrome, na Chrome Web Store, em páginas de outras extensões, em arquivos locais ou na barra de endereço. As restrições da Chrome Web Store abrangem `chromewebstore.google.com` e `chrome.google.com`, inclusive seus subdomínios.

## Carregar e configurar

1. Baixe e extraia este repositório.
2. Abra `chrome://extensions` no Chrome e ative o modo do desenvolvedor.
3. Selecione **Carregar sem compactação** e escolha a pasta com este README e `manifest.json`.
4. Abra as configurações pelo ícone do tabuchan na barra de ferramentas e confira os atalhos e o comportamento.

| Ação | Padrão no macOS | Padrão nos demais sistemas |
| --- | --- | --- |
| Voltar | Control + Shift + J | Alt + Shift + J |
| Avançar | Control + Shift + K | Alt + Shift + K |

No macOS, use a tecla física Control. Nas configurações, pressione a combinação desejada para registrá-la. Chrome, o sistema ou outras extensões podem interceptar combinações antes que cheguem à página.

Mantenha pressionadas as teclas modificadoras necessárias e pressione e solte rapidamente a tecla comum de Voltar ou Avançar. Cada toque alterna uma aba na ordem fixa do histórico. Ao soltar um modificador necessário, a aba exibida passa a ser a mais recente.

O tempo padrão para abrir a lista é 0,5 segundo. A lista permanece aberta após soltar todas as teclas: cima/baixo selecionam, Enter confirma e Esc cancela. Esquerda alterna os modos. Na ordem das abas, digite para filtrar títulos e use Backspace para apagar o último caractere. Durante a composição pelo IME japonês, Enter, cima/baixo e Esc ficam reservados ao IME.

Pressione Enter em qualquer uma das listas, inclusive nos resultados da busca, ou selecione uma aba diretamente no Chrome para torná-la a mais recente. Se ela já estava no histórico, sua entrada anterior é removida e as demais abas mantêm a ordem.

Separe os termos de busca com espaços. A correspondência parcial (padrão) encontra títulos que contêm todos os termos em qualquer ordem. A busca por prefixo exige que o título comece com o primeiro termo e contenha os demais na ordem digitada, mesmo com caracteres entre eles. Os dois modos usam normalização Unicode NFC e ignoram diferenças entre maiúsculas e minúsculas.

O tempo de pressionamento pode variar de 0,2 a 2,0 segundos, em passos de 0,1 segundo, com padrão de 0,5 segundo. O histórico guarda de 10 a 30 abas anteriores, com padrão de 10. Por padrão, um toque pula abas sem atalhos disponíveis. Na lista, essas abas aparecem em cinza e mantêm a altura da linha. Você pode selecioná-las com Enter. Se a opção de pular abas estiver desativada, uma aba na qual a extensão não consegue receber entradas de teclado passa a ser a mais recente assim que é exibida.

## Armazenamento de dados

O histórico é mantido por janela no armazenamento de sessão local. Reiniciar o navegador ou desativar, recarregar ou atualizar a extensão apaga o histórico, que recomeça na aba atual. Atalhos e configurações são salvos localmente. Consulte a [política de privacidade](privacy-policy.pt-BR.md), inclusive sobre solicitações de favicons.

## Recriar o ZIP de distribuição

Abra um terminal na pasta deste README. Os comandos usam `zip` e `shasum` padrão do macOS para empacotar os 28 arquivos de execução e substituem o ZIP e a soma de verificação existentes.

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.2.1.zip" \
  manifest.json \
  options.html \
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
  src/tab-access.js \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  picker.html \
  src/input-protocol.js \
  src/legacy-command.js \
  src/picker-model.js \
  src/picker-view.js \
  src/picker.css \
  src/picker.js \
  src/settings-rules.js \
  src/shortcut-changes.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.2.1.zip" dist/tabuchan-0.2.1.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.2.1.zip > tabuchan-0.2.1.zip.sha256)
```

O ZIP contém `manifest.json` na raiz e exclui documentos da loja, imagens e registros. O SHA-256 pode mudar ao recriar o arquivo; associe a soma do ZIP efetivo ao [registro de lançamento](releases.pt-BR.md) antes de distribuí-lo.

## Site

As instruções e os documentos públicos são hospedados no GitHub Pages. Veja a situação de implantação verificada no [registro](releases.pt-BR.md#github-pages).

- [Instruções de uso](https://mstksb.github.io/chrome-ext-tabuchan/README.pt-BR.html)
- [Política de privacidade no GitHub Pages](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html)

A política de privacidade do GitHub Pages foi verificada nos sete idiomas da documentação, via HTTPS e sem login.

## Documentos públicos

| Documento | Conteúdo |
| --- | --- |
| [README](README.pt-BR.md) | Instalação, uso, configurações, requisitos e recriação do ZIP |
| [Página da loja](store/listing.pt-BR.md) | Textos e capturas de tela |
| [Declarações de privacidade](store/privacy.pt-BR.md) | Justificativas de permissões e declarações preliminares |
| [Política de privacidade](privacy-policy.pt-BR.md) | Política que descreve como a extensão trata os dados |
| [Registro de lançamento](releases.pt-BR.md) | Versão, arquivos, ambientes verificados e revisão/publicação |
