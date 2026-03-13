# Padrões de Componentes UI

## Visão Geral

Todos os componentes de UI devem seguir estes padrões para manter consistência no codebase.

## Regras

### 1. Estrutura de Arquivos

- Cada componente deve ter seu próprio arquivo: `src/components/ui/[nome].tsx`
- Nome do arquivo em kebab-case: `button.tsx`, `card.tsx`, `input.tsx`

### 2. Exports

- **Sempre** usar named exports
- **Nunca** usar default exports

```tsx
// ✅ Correto
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)

// ❌ Errado
export default function Button() { ... }
```

### 3. Tailwind Variants

- Usar `tailwind-variants` (`tv`) para criar variantes
- **Não** usar `twMerge` + `clsx` em conjunto com `tv`
- Passar `className` diretamente como propriedade da variant

```tsx
// ✅ Correto - className passa direto no tv
const buttonVariants = tv({
  base: "...",
  variants: { ... },
})

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)

// ❌ Errado - não usar twMerge com tv
className={twMerge(clsx(buttonVariants({ variant, size }), className))}
```

### 4. TypeScript

- Criar interface `Props` estendendo as propriedades nativas do elemento
- Usar `forwardRef` para suportar ref e permitir composição

```tsx
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### 5. Estrutura do Componente

```tsx
import { type ElementHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const componentVariants = tv({
  base: "classes-base",
  variants: {
    variant: {
      default: "variant-default-classes",
      secondary: "variant-secondary-classes",
    },
    size: {
      sm: "size-sm-classes",
      md: "size-md-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface ComponentProps
  extends ElementHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

### 6. Variant Naming

- `variant`: primary, secondary, default, outline, ghost, destructive, link
- `size`: sm, default, md, lg, icon, full

### 7. Designer para Código

1. Identificar o componente no Pencil
2. Extrair: cores, fontes, paddings, border-radius, gaps
3. Mapear para classes Tailwind equivalentes
4. Criar variantes baseadas nos estados (hover, active, disabled)
