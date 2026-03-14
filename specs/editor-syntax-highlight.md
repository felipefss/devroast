# Spec: Editor de Código com Syntax Highlight e Auto-detecção

## Visão Geral
Construir um editor de código funcional inspirado no `ray.so`. O editor deve permitir que o usuário cole ou digite código e, automaticamente, descobrir a linguagem para aplicar a coloração (syntax highlight) correta. Também deve haver um seletor manual para sobrepor a detecção automática.

## Arquitetura e Bibliotecas
- **Renderização (Highlighting):** `shiki` (Já instalado no projeto).
- **Detecção de Linguagem:** `highlight.js` (Precisará ser instalado).
- **Por que essa combinação?** O `shiki` gera as cores mais precisas (usando gramáticas do VS Code), mas não faz auto-detecção. O `highlight.js` tem um motor heurístico excelente (`hljs.highlightAuto(code)`) para adivinhar a linguagem, mas o highlight dele é baseado em Regex e menos robusto. Usaremos o `highlight.js` apenas como "oráculo" para descobrir a linguagem e passaremos essa informação para o `shiki` pintar a tela.

## Fluxo de Funcionamento
1. **Input do Usuário:** O usuário cola um trecho de código no `<textarea>`.
2. **Detecção (Debounced):** Se o seletor estiver em "Auto Detect", uma função com _debounce_ (ex: aguarda 300ms após o usuário parar de digitar) chama o `highlight.js` para analisar o texto e retornar a linguagem provável.
3. **Lazy Loading da Gramática:** Com a linguagem identificada, pedimos ao `shiki` para carregar a gramática correspondente de forma assíncrona (ex: `shiki.loadLanguage('javascript')`), caso ainda não esteja em memória.
4. **Renderização:** O código é transformado em HTML e injetado na camada de sobreposição (`<pre>`) do editor.
5. **Ação Manual:** Se o usuário escolher uma linguagem num `<select>` (ex: "Python"), desligamos a detecção automática e forçamos o `shiki` a renderizar como Python.

## Lista de Tarefas (To-Dos) para Implementação

- [ ] **Instalar Dependências:** Instalar o pacote `highlight.js` (usaremos apenas o sub-módulo de detecção para não pesar o bundle).
- [ ] **Mapeamento de Linguagens (`src/lib/languages.ts`):** 
  - Criar uma lista de linguagens suportadas pelo projeto (ex: TS, JS, Python, Rust, Go, CSS, HTML, SQL).
  - Criar um objeto de mapeamento caso o id retornado pelo `highlight.js` seja diferente do id esperado pelo `shiki`.
- [ ] **Criar Hook de Detecção (`useLanguageDetection.ts`):**
  - Implementar hook que recebe o código e um boolean `isAuto`.
  - Usar um debounce (nativo ou via lodash/use-debounce) para chamar a detecção.
  - Retornar a linguagem detectada e um estado de `isDetecting` (útil para mostrar um spinnerzinho na UI, se quiser).
- [ ] **Componente `LanguageSelector`:**
  - Criar um dropdown visualmente agradável usando a biblioteca `@base-ui/react` (já no projeto) ou componentes do Tailwind.
  - Opção padrão: "Automático (Detectando...)".
  - Lista das outras linguagens suportadas abaixo.
- [ ] **Atualizar o `CodeEditorHighlighted`:**
  - Conectar os estados do Seletor e do Hook de Detecção no editor.
  - Garantir que o output em HTML gerado pelo Shiki se alinhe perfeitamente com a tipografia do `<textarea>` (scroll-sync e line-height).
- [ ] **Otimização de Performance (Bundle):**
  - Importar o `highlight.js/lib/core` e registrar apenas as linguagens do nosso ecossistema, evitando carregar a biblioteca inteira (que é bem pesada).
  - Instanciar o engine do Shiki via singleton assíncrono para ser reaproveitado.

## Casos Extremos (Edge Cases)
- **Falha na Detecção:** Se o `highlight.js` não conseguir descobrir, fazer fallback elegante para `plaintext`.
- **Textos muito grandes:** Colar um código de 10.000 linhas pode travar a main thread. O debounce ajuda, mas o HTML injetado no DOM também pesa. Vale a pena avaliar se limitaremos a quantidade máxima de caracteres do editor.
