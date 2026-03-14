# DevRoast - Padrões Globais do Projeto

Este é o documento principal de padrões do DevRoast. Utilize a estrutura abaixo para entender as diretrizes globais do repositório.

## Estrutura do Projeto

Para regras detalhadas de cada diretório, consulte seus respectivos arquivos `AGENTS.md` locais:

- `specs/`: Padrões para a criação de documentação e planejamento antes de novas features.
- `src/app/`: Padrões arquiteturais do Next.js (App Router, Server vs Client Components, Suspense, Loading States).
- `src/components/ui/`: Padrões visuais para componentes burros/base (Tailwind Variants, Exports, etc).
- `src/trpc/`: Padrões para a API e backend (procedures, endpoints, client hook vs server caller).

```
src/
├── app/                  # Next.js App Router
├── components/ui/        # Biblioteca de componentes de UI
├── trpc/                 # Inicialização, cliente, server e routers tRPC
└── db/                   # Configuração e Schemas do Banco (Drizzle ORM)
```

## Padrões Globais da Base de Código

1. **Indentação e Formatação**
   - Utilizamos sempre 2 espaços para indentação.
   - A formatação é automatizada pelo **Biome**. Sempre verifique/rode o `biome` (`pnpm format` e `pnpm lint`) após modificações.

2. **Tipagem**
   - Utilizamos TypeScript no modo estrito (`strict: true`).
   - Evite o uso de `any` ou type cast desnecessários. Prefira inferência sempre que possível, ou defina interfaces sólidas para dados transacionados.

3. **Gerenciamento de Pacotes**
   - Usamos o `pnpm`. Evite utilizar `npm` ou `yarn` para instalar pacotes. Sempre execute `pnpm install` ou `pnpm add <pkg>`.

4. **Estilização**
   - Utilizamos Tailwind CSS (v4) configurado para ler variáveis e diretivas via `@theme`.

## Workflow de Desenvolvimento

- **Specs primeiro**: Antes de desenvolver uma feature substancial, crie a respectiva documentação em `specs/` (siga o guia no `specs/AGENTS.md`).
- **Commits Convencionais**: Siga um formato semântico (ex: `feat(scope): ...`, `fix(ui): ...`, `chore: ...`).
- **Verificações Finais**: Sempre execute build (`pnpm build`) e o lint (`pnpm lint`) antes de considerar o código pronto.
