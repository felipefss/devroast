# Spec: Integração do tRPC

## Objetivo
Implementar o tRPC como camada de API e back-end do nosso projeto Next.js (App Router). Garantir chamadas RPC com tipagem forte de ponta a ponta, suportando tanto Client Components quanto Server Components (SSR) de forma nativa e otimizada.

## Escopo
- Configuração do servidor tRPC.
- Criação de rotas e rotadores (routers) base.
- Configuração do Client tRPC (com `@tanstack/react-query`).
- Configuração do Server tRPC (para Server Components).
- Handler de API do Next.js App Router.
- Rota de teste (ex: `hello` ou `health-check`) para validação em cliente e servidor.

## Decisões Técnicas
- **Bibliotecas Base**: `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@tanstack/react-query`, `zod`.
- **Arquitetura**: O tRPC será integrado utilizando a nova abordagem oficial para o Next.js App Router.
- **Client Components**: Utilizaremos a integração nativa com o TanStack Query v5 (`createTRPCReact`).
- **Server Components**: Utilizaremos a criação de um server caller via `createCallerFactory` do tRPC para invocar os procedimentos no lado do servidor sem passar pela rede HTTP (chamadas de função direta).
- **Localização dos Arquivos**: Tudo relacionado à inicialização do tRPC ficará dentro de um diretório dedicado (ex: `src/trpc/` ou `src/lib/trpc/`).

## Passo a Passo (Plano de Ação)

1. **Instalação de Dependências**
   - Instalar `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@tanstack/react-query`, e `zod`.

2. **Inicialização do Servidor tRPC (`src/trpc/init.ts`)**
   - Criar a instância do tRPC usando `initTRPC.create()`.
   - Exportar os utilitários `router`, `procedure` e `createCallerFactory`.
   - (Opcional) Configurar um contexto básico para requisições.

3. **Criação do App Router principal (`src/trpc/routers/_app.ts`)**
   - Criar o roteador principal da aplicação agregando as rotas.
   - Adicionar uma rota de teste, por exemplo, um procedimento `hello` que retorna uma string e usa o `zod` para validação de entrada.

4. **Configuração do Endpoint de API (`src/app/api/trpc/[trpc]/route.ts`)**
   - Implementar o handler do App Router (`fetchRequestHandler`) utilizando o app router do tRPC.
   - Exportar `GET` e `POST`.

5. **Configuração do Cliente tRPC (`src/trpc/client.tsx`)**
   - Criar a instância do cliente com `createTRPCReact`.
   - Criar um componente `<TRPCProvider>` para instanciar o `QueryClient` e o `trpcClient`.
   - Garantir que o `QueryClient` seja singleton no client, mas único por requisição no servidor.

6. **Configuração do Server tRPC (`src/trpc/server.ts`)**
   - Instanciar e exportar o caller no servidor utilizando o roteador principal da aplicação e `createCallerFactory`.

7. **Configuração Global (`src/app/layout.tsx`)**
   - Envolver o `children` do Root Layout com o `<TRPCProvider>`.

8. **Validação (Página de Teste)**
   - Testar o tRPC em um Client Component com hook (ex: `trpc.hello.useQuery()`).
   - Testar o tRPC em um Server Component (ex: `await trpc.hello()`).