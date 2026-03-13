# DevRoast

Plataforma para submeter código e receber avaliações "brutalmente honestas".

## Funcionalidades

- **Envio de Código**: Cole seu código e receba uma análise detalhada
- **Modo Roast**: Ative para críticas mais ferozes e humoradas
- **Leaderboard**: Veja os códigos mais criticados da comunidade
- **Preview de Código**: Syntax highlighting com tema escuro

## Tech Stack

- **Framework**: Next.js 16
- **Estilização**: Tailwind CSS 4
- **Componentes**: Base UI + customizados
- **Syntax Highlighting**: Shiki
- **Linting**: Biome
- **Package Manager**: pnpm

## Padrões de Código

### Componentes UI
- Localização: `src/components/ui/`
- Named exports apenas
- Tailwind Variants para variantes
- Arquivo único por componente

### Estrutura de Página
- Server Components por padrão
- Client Components isolados em arquivos com `use client`
- Suspense para async components

### Convenções
- 2 espaços de indentação
- Estilo: Tailwind classes
- Tipos: TypeScript strict
