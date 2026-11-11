---
lang: pt-BR
---

# Registro de lançamento

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | Português (Brasil) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

Em 11 de novembro de 2026, o README e os documentos públicos existentes foram publicados pelo GitHub Pages a partir da raiz da branch `main`. O README é a página inicial; o Jekyll padrão converte links Markdown relativos em URLs HTML. Os documentos continuam sendo editados em Markdown. `src/`, `options.html` e `manifest.json` ficam fora do site gerado.

A compilação e a implantação iniciais das [instruções](https://mstksb.github.io/chrome-ext-tabuchan/) e da [política preliminar](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) foram concluídas. Ambas foram acessadas por HTTPS sem autenticação e conferidas no navegador. Responsável, contato e vigência seguem indefinidos; a política não está finalizada para envio. Essa verificação histórica não confirma a implantação das novas traduções.

## 0.1.0

Candidata pública com alternância por toque, lista por pressionamento prolongado, modos de uso recente/ordem das abas, grupos, busca por título e configurações de atalhos/comportamento.

Configurações e lista usam japonês ou inglês; idiomas do Chrome diferentes do japonês selecionam inglês. A busca independe da interface e usa NFC e correspondência de trechos sem diferenciar maiúsculas/minúsculas. Traduções da documentação não ampliam os idiomas da interface.

| Item | Detalhes |
| --- | --- |
| Versão | `0.1.0` no SemVer e no manifesto |
| ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), 20 arquivos de execução e manifesto na raiz |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| Soma de verificação | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Requisitos | Chrome com Manifest V3; mínimo declarado de Chrome 102 |
| Loja | Upload/aceitação deste ZIP internacionalizado, revisão/publicação e ID/URL do item não verificados |

## Escopo verificado

Em 10 de novembro de 2026, no macOS e Chrome `156.0.8078.80`, foram verificadas a interface japonesa e as operações principais: toques, pressionamento prolongado, seleção/cancelamento, ordem/grupos, persistência das configurações, iframes, abas restritas, busca e encaminhamento de operações durante composição por IME. A interface japonesa e a busca NFC também foram verificadas em uma extração separada do ZIP.

Em 11 de novembro de 2026, 17 grupos de operações foram verificados com os arquivos deste repositório no macOS e Chrome `157.0.8103.40`, idioma `ja`, incluindo a versão `0.1.0` nas configurações. O funcionamento após recarregar a extensão não foi verificado.

Verificações de configuração/automatizadas cobrem chaves japonês/inglês, referências do manifesto, caracteres pré-compostos/combinantes NFC e trechos multilíngues/com emojis. O layout inglês foi conferido em uma configuração de captura com o mesmo código e dicionário inglês.

A [página da loja](store/listing.pt-BR.md#capturas-de-tela) contém imagens japonesas/inglesas das configurações e da lista: PNGs opacos de 1280×800 com abas de exemplo.

## Não verificado ou indefinido

- Windows, Linux, Chrome antigo e IMEs nativos de cada idioma.
- Pacote bilíngue original em ambiente inglês e retorno ao inglês em idiomas não suportados.
- Funcionamento após recarregar no Chrome comum.
- Responsável/contato, licença, visibilidade e países de distribuição.
- Responsável, contato e vigência da política; conformidade dos dados, inclusive favicons HTTP.
- Salvamento dos textos/declarações no Dashboard e situação de revisão/publicação.

Finalize esses pontos antes do envio à loja. As declarações e a política preliminares são materiais de preparação, não comprovantes de conclusão dos requisitos.
