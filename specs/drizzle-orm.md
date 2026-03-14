# Especificação: Drizzle ORM + PostgreSQL

## 1. Visão Geral

Banco de dados PostgreSQL com Drizzle ORM para suportar as funcionalidades do DevRoast:
- Submissão de código anônima
- Sistema de roasts com pontuações
- Leaderboard público

## 2. Tech Stack

- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Container**: Docker Compose
- **Migrations**: Drizzle Kit

## 3. Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Nota**: Usa porta 5433 pois 5432 pode estar em uso por PostgreSQL local.

## 4. Tabelas

### 4.1 submissions

Armazena os códigos submetidos pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK, UUID v4 |
| code | text | Código fonte submetido |
| language | language_enum | Linguagem de programação |
| ip_hash | varchar(64) | Hash SHA256 do IP (anti-spam) |
| created_at | timestamptz | Data de criação |

### 4.2 roasts

Armazena as críticas/roasts gerados para cada submissão.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK, UUID v4 |
| submission_id | uuid | FK para submissions |
| content | text | Conteúdo do roast |
| score | decimal(3,2) | Pontuação (0.0 - 10.0) |
| roast_mode | roast_mode_enum | Modo do roast (normal/brutal) |
| created_at | timestamptz | Data de criação |

### 4.3 leaderboard_view

View materializada ou query para rankings.

## 5. Enums

### 5.1 language_enum

```sql
CREATE TYPE language_enum AS ENUM (
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'bash',
  'json',
  'yaml',
  'markdown'
);
```

### 5.2 roast_mode_enum

```sql
CREATE TYPE roast_mode_enum AS ENUM (
  'normal',
  'brutal'
);
```

## 6. Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts          # Conexão com banco
│   ├── schema.ts         # Definição das tabelas
│   └── types.ts          # Tipos derivados do schema
├── migrations/           # Migrations do Drizzle Kit
└── .env                  # DATABASE_URL
```

## 7. Variáveis de Ambiente

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5433/devroast
```

## 8. To-Dos

- [x] Criar docker-compose.yml com PostgreSQL
- [x] Configurar Drizzle no projeto (instalar dependências)
- [x] Criar schema com tabelas submissions e roasts
- [x] Configurar conexão com banco
- [x] Criar migration inicial
- [ ] Implementar repository para submissions
- [ ] Implementar repository para roasts
- [ ] Criar query para leaderboard (top roasts por score)
- [ ] Adicionar índice para ordenação do leaderboard
- [ ] Adicionar límite de rate limiting por IP (opcional)

## 9. Queries Comuns

### Listar top roasts (leaderboard)
```sql
SELECT 
  r.id,
  r.score,
  r.content,
  s.code,
  s.language,
  r.created_at
FROM roasts r
JOIN submissions s ON r.submission_id = s.id
ORDER BY r.score ASC
LIMIT 100;
```

### Estatísticas
```sql
SELECT 
  COUNT(*) as total_roasts,
  AVG(score) as avg_score
FROM roasts;
```
