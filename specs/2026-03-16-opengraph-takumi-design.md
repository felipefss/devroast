# OpenGraph Images for Roast Results with Takumi

## Objetivo
Adicionar imagens OpenGraph (OG) geradas dinamicamente para os links de compartilhamento de roasts (`/roast/[id]`), de modo que as prévias em redes sociais sejam visualmente ricas, aumentando o engajamento e compartilhamento do devroast.

## Escopo
- **In**
  - Criação de uma API route para geração da imagem usando `@takumi-rs/image-response`.
  - Atualização do arquivo `next.config.ts` para ignorar o empacotamento do core Rust do Takumi.
  - Implementação visual baseada no design aprovado (do arquivo `devroast.pen` - frame `4J5QT`).
  - Exportação de metadados na página `/roast/[id]` apontando para a nova imagem OG.
- **Out**
  - Hospedagem estática/S3 de imagens geradas (vamos utilizar geração on-the-fly SSR por ser dinâmica).
  - Outros formatos de pré-visualização (Twitter player card, etc) além de summary_large_image, o qual o OpenGraph basic já cobre primariamente.

## Decisões Técnicas
- **Ferramenta de Geração**: `@takumi-rs/image-response` em vez de `@vercel/og` (conforme solicitado e pela velocidade da engine Rust).
- **Dados**: Extraídos via tRPC server-caller / camada de DB já existente (`trpc.getRoastById`).
- **Design & Cores**:
  - `bg-page`: `#0A0A0A`
  - `accent-green`: `#10B981`
  - `text-primary`: `#FAFAFA`
  - `accent-amber`: `#F59E0B`
  - `text-tertiary`: `#4B5563`
  - `accent-red`: `#EF4444`
  - `border-primary`: `#2A2A2A`
  - Fonts: `JetBrains Mono` and `Geist` (to be loaded properly or fallback to sans-serif/mono if needed).

## Passo a Passo (Plano de Ação)
1. Instalar as dependências do takumi (`pnpm add @takumi-rs/image-response`).
2. Atualizar o `next.config.ts` com a flag `serverExternalPackages: ["@takumi-rs/core"]`.
3. Criar a API Route em `src/app/api/og/roast/[id]/route.tsx`.
   - Recuperar o ID da URL.
   - Buscar os dados com `trpc.getRoastById({ id })`.
   - Renderizar o layout em flexbox utilizando os componentes de estilo aprovados.
   - Retornar o `new ImageResponse`.
4. Atualizar o arquivo `src/app/roast/[id]/page.tsx` para exportar a função `generateMetadata({ params })`.
   - Incluir a `metadataBase` e definir `openGraph: { images: ['/api/og/roast/[id]'] }`.
5. Verificar o lint, tipo e build (`pnpm format`, `pnpm lint`, `pnpm build`).
