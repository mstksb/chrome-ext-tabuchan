---
lang: pt-BR
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | Português (Brasil) | [Español](README.es.md) | [Deutsch](README.de.md)

Extensão do Chrome para alternar entre abas recentes pelo teclado. Toque no atalho para percorrer o histórico ou mantenha-o pressionado para abrir a lista de abas.

A versão candidata à distribuição pública é `0.1.0`. Consulte o [registro de lançamento](releases.pt-BR.md) para arquivos, ambientes verificados e situação da revisão/publicação.

A documentação está disponível em inglês, japonês, chinês simplificado, chinês tradicional, português do Brasil, espanhol e alemão. Isso é independente dos idiomas da interface: as configurações e a lista usam japonês quando o idioma de exibição do Chrome é japonês, e inglês nos demais casos. A busca por título aceita Unicode independentemente da interface, com normalização NFC e correspondência de trechos sem diferenciar maiúsculas de minúsculas.

## Recursos

- Voltar e avançar por uma ordem fixa de uso recente na janela atual.
- Manter o atalho pressionado para abrir a lista; selecionar com as setas para cima/baixo e alternar com Enter.
- Usar a seta para a esquerda para alternar entre uso recente e ordem das abas; buscar títulos na lista por ordem das abas.
- Exibir nomes/cores dos grupos e indicar se os atalhos estão disponíveis na aba de destino.
- Atribuir vários atalhos a cada direção e configurar o tempo de pressionamento e o limite do histórico.

## Requisitos

Google Chrome compatível com Manifest V3. O manifesto declara Chrome 102 como versão mínima. O [registro de lançamento](releases.pt-BR.md) distingue os ambientes e versões efetivamente testados. Windows, Linux, versões antigas do Chrome e o IME japonês do sistema operacional ainda não foram verificados.

Inicie os atalhos dentro de páginas HTTP(S) comuns, inclusive em iframes. Não é possível iniciá-los em páginas internas do Chrome, na Chrome Web Store, em páginas de outras extensões, em arquivos locais ou na barra de endereço.

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

Um toque é aplicado ao soltar uma tecla necessária. O tempo padrão para abrir a lista é 1 segundo. A lista permanece aberta após soltar todas as teclas: cima/baixo selecionam, Enter confirma e Esc cancela. Esquerda alterna os modos. Na ordem das abas, digite para filtrar títulos e use Backspace para apagar o último caractere. Durante a composição pelo IME japonês, Enter, cima/baixo e Esc ficam reservados ao IME.

O tempo pode variar de 0,5 a 2 segundos, em passos de 0,1 segundo. O histórico guarda de 10 a 30 abas anteriores, com padrão de 10. Por padrão, um toque pula abas sem atalhos disponíveis; elas ainda podem ser selecionadas explicitamente na lista.

## Armazenamento de dados

O histórico é mantido por janela no armazenamento de sessão local. Reiniciar o navegador ou desativar, recarregar ou atualizar a extensão apaga o histórico, que recomeça na aba atual. Atalhos e configurações são salvos localmente. Consulte a [política de privacidade preliminar](privacy-policy.pt-BR.md), inclusive sobre solicitações de favicons.

## Recriar o ZIP de distribuição

Abra um terminal na pasta deste README. Os comandos usam `zip` e `shasum` padrão do macOS para empacotar os 20 arquivos de execução e substituem o ZIP e a soma de verificação existentes.

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.1.0.zip" \
  manifest.json \
  options.html \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  icons/tab.svg \
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
  src/tab-access.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.1.0.zip" dist/tabuchan-0.1.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.1.0.zip > tabuchan-0.1.0.zip.sha256)
```

O ZIP contém `manifest.json` na raiz e exclui documentos da loja, imagens e registros. O SHA-256 pode mudar ao recriar o arquivo; associe a soma do ZIP efetivo ao [registro de lançamento](releases.pt-BR.md) antes de distribuí-lo.

## Site

As instruções e os documentos públicos são hospedados no GitHub Pages. Veja a situação de implantação verificada no [registro](releases.pt-BR.md#github-pages).

- [Instruções de uso](https://mstksb.github.io/chrome-ext-tabuchan/README.pt-BR.html)
- [Política de privacidade preliminar](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.pt-BR.html)

O nome do responsável pela publicação, o contato e a data de vigência ainda não foram definidos. Finalize a política antes do envio à loja.

## Documentos públicos

| Documento | Conteúdo |
| --- | --- |
| [README](README.pt-BR.md) | Instalação, uso, configurações, requisitos e recriação do ZIP |
| [Página da loja](store/listing.pt-BR.md) | Textos e capturas de tela |
| [Declarações de privacidade](store/privacy.pt-BR.md) | Justificativas de permissões e declarações preliminares |
| [Política de privacidade](privacy-policy.pt-BR.md) | Tratamento de dados explicado ao usuário |
| [Registro de lançamento](releases.pt-BR.md) | Versão, arquivos, ambientes verificados e revisão/publicação |
