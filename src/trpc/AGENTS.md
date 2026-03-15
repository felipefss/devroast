# Padrões do tRPC

Este diretório contém a configuração e os routers do tRPC, servindo como camada de API e Backend da nossa aplicação.

## Estrutura

- `init.ts`: Inicialização principal do servidor tRPC (`initTRPC.create()`).
- `client.tsx`: Configuração do Provider do React e instanciação do tRPC Client (`createTRPCReact`) utilizando `@tanstack/react-query`.
- `server.ts`: Exportação do tRPC Server Caller (`createCallerFactory`), que permite bypass da camada HTTP no server-side.
- `routers/`: Diretório contendo as rotas (procedures) do sistema. O router principal é o `routers/_app.ts`.

## Regras e Padrões

1. **Definição de Procedures (Rotas)**
   - Defina os endpoints dentro da pasta `routers/` e englobe-os no `appRouter` principal.
   - Utilize a biblioteca `zod` para validação de input (`input(z.object({...}))`).
   - Mantenha a tipagem sempre forte e injetada no router final.
   - **Performance em Queries**: Sempre que uma procedure precisar realizar múltiplas consultas independentes ao banco de dados (ex: com Drizzle), utilize `await Promise.all([...])` para executá-las em paralelo e reduzir o tempo de resposta.

2. **Como chamar o tRPC na Aplicação**
   - **Em Server Components (`src/app/...`)**: Importe de `@/trpc/server` e faça a chamada assíncrona diretamente. Exemplo: `await trpc.getMetrics()`. NUNCA use o client aqui para evitar fetch via HTTP desnecessário, o server caller faz chamada de função direta.
   - **Em Client Components (`"use client"`)**: Importe de `@/trpc/client` e use os hooks gerados pelo `@tanstack/react-query`. Exemplo: `const { data, isLoading } = trpc.getMetrics.useQuery()`.