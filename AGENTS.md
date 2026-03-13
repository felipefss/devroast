# DevRoast - Padrões do Projeto

## Estrutura

```
src/
├── app/                  # Next.js App Router
│   ├── components/       # Componentes de página
│   ├── layout.tsx       # Layout raiz + Navbar
│   └── page.tsx         # Homepage
└── components/ui/        # Biblioteca de componentes
```

## Componentes UI

- **Localização**: `src/components/ui/`
- **Nome**: kebab-case (button.tsx, code-block.tsx)
- **Export**: named exports apenas
- **Estilo**: Tailwind Variants
- **Um arquivo**: um componente (com subcomponentes quando necessário)

## Padrões

- **Indentação**: 2 espaços
- **Tipagem**: TypeScript strict
- **Linting**: Biome
- **Estilização**: Tailwind CSS com @theme

## Página

- Server Components por padrão
- Client Components: `use client` isolado
- Async components com Suspense
