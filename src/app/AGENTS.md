# Padrões do Next.js App Router

Este diretório contém a estrutura de rotas da aplicação (Next.js App Router).

## Regras e Padrões

1. **Server Components por Padrão**
   - Todas as páginas e componentes devem ser Server Components, a menos que precisem de interatividade ou hooks de estado.

2. **Client Components**
   - Utilize a diretiva `"use client"` estritamente nos componentes que exigem hooks (ex: `useState`, `useEffect`), interatividade de UI, ou hooks do tRPC (`trpc.[route].useQuery()`).
   - Mantenha os Client Components o mais fundo possível na árvore (isolados em `src/app/components/`) para não prejudicar a performance geral da página.

3. **Loading States e Suspense**
   - Sempre que possível e necessário, envolva Server Components assíncronos que buscam dados (ex: `await trpc.route()`) com o `<Suspense>` nativo do React.
   - Forneça um componente de `skeleton` ou loading spinner na propriedade `fallback`.
   - **Exceções**: Quando houver necessidades específicas de UI (ex: animação de carregamento partindo do "0" usando Client Components e `@number-flow/react`), não usar Suspense se isso prejudicar a UX desejada.

4. **Integração com tRPC**
   - **No Server**: Utilize a importação do Server Caller (`import { trpc } from "@/trpc/server"`).
   - **No Client**: Utilize os hooks via React Query (`import { trpc } from "@/trpc/client"`).