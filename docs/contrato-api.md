# Contrato da API

> Este documento especifica a interface REST que o backend expõe e que os dois clientes consomem. Mantido atualizado a cada mudança de endpoint.

---

## Por que este documento existe

O grupo trabalha em paralelo em três componentes, com menos gente do que frentes. O que impede que um trave o outro é este arquivo: com o contrato fechado, o responsável pelo cliente web pode construir a tela de listagem antes de o endpoint existir, e o responsável pelo mobile pode modelar suas classes de dados sem esperar a primeira migration.

Duas regras práticas decorrem disso:

1. **O contrato muda antes do código, nunca depois.** Quem precisa alterar um endpoint atualiza este documento e avisa o grupo no mesmo dia.
2. **O contrato é a especificação, não a documentação.** Se ele descreve um comportamento e a API faz outro, o defeito está na API — a menos que o grupo decida conscientemente mudar o contrato.

A régua de qualidade é esta: na entrega final, o contrato precisa ser suficiente para que um quarto cliente seja escrito **sem nenhuma pergunta ao grupo**.

---

## Identificação

| Campo | Valor |
|---|---|
| **Projeto** | Treino Progressivo |
| **Versão do contrato** | 1.1 |
| **Última atualização** | 2026-09-24 |
| **URL base (desenvolvimento)** | `http://localhost:3000` |
| **Formato** | JSON (`Content-Type: application/json`) |

> **Nota para o app mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina do desenvolvedor. Use `http://10.0.2.2:3000` no emulador Android, ou o IP da máquina na rede local para dispositivo físico. Registre a URL usada por cada ambiente na configuração do app, nunca fixa no meio do código.

**Nota sobre o modelo de dados:** o `schema.prisma` atual tem `Aluno` e `Personal` como tabelas sem campo de senha. Para o login (RF-001) funcionar, cada uma precisa ganhar `email` (já existe em `Aluno`, falta em `Personal`) e `senha` (hash), além de um campo que identifique o perfil na resposta do login. Esse ajuste de schema é pré-requisito da Etapa 2 e não muda nada neste contrato — é o mesmo formato de resposta descrito na seção 2.

---

## 1. Convenções gerais

### 1.1 Nomenclatura

- Recursos no plural e em português, sem acento: `/exercicios`, `/fichas`, `/alunos`, `/sessoes-treino`
- Campos em `camelCase`, sem acento: `cargaSugerida`, `repeticoesFeitas`, `grupoMuscular`
- Identificadores técnicos em inglês: `id`, `createdAt`, `updatedAt`, `page`, `limit`

### 1.2 Métodos e status esperados

| Operação | Método e caminho | Sucesso | Erros comuns |
|---|---|---|---|
| Listar | `GET /recursos` | `200` | `401` |
| Obter um | `GET /recursos/:id` | `200` | `401`, `404` |
| Criar | `POST /recursos` | `201` | `400`, `401`, `409` |
| Atualizar | `PATCH /recursos/:id` | `200` | `400`, `401`, `404` |
| Remover | `DELETE /recursos/:id` | `204` | `401`, `404`, `409` |

Operações que não são CRUD puro — registrar uma série executada, finalizar uma sessão e recalcular carga — ficam como sub-recurso (`POST /sessoes-treino/:id/finalizar`) em vez de campo em um `PATCH` genérico. Ver seção 4.

### 1.3 Formato de erro

Toda resposta de erro segue o mesmo formato, em qualquer endpoint:

```json
{
  "statusCode": 400,
  "message": ["cargaUsada deve ser um numero positivo", "exercicioId deve ser um uuid"],
  "error": "Bad Request"
}
```

Formato padrão do NestJS (`ValidationPipe` + filtro de exceção global).

### 1.4 Paginação

`GET /recursos?page=1&limit=20`

```json
{
  "dados": [],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

### 1.5 Datas

Todas as datas trafegam em ISO 8601, em UTC: `2026-08-13T14:30:00.000Z`. A conversão para o fuso do usuário é responsabilidade de cada cliente.

---

## 2. Autenticação

### 2.1 Estratégia

Login com e-mail e senha contra a API. O servidor devolve um token JWT com validade de 8 horas, contendo `sub` (id do usuário) e `perfil` (`personal` ou `aluno`). Não há refresh token no MVP — expirado, o usuário faz login novamente.

Requisições autenticadas enviam o token no cabeçalho:

```
Authorization: Bearer <token>
```

### 2.2 Endpoints de autenticação

#### `POST /auth/login`

Autentica o usuário e devolve o token de acesso.

**Requisição**

```json
{
  "email": "personal@exemplo.com",
  "senha": "..."
}
```

**Resposta `200`**

```json
{
  "accessToken": "eyJhbGciOi...",
  "usuario": {
    "id": "9f1c2b6e-4a7d-4b28-9a4e-2d5f8c1e7b30",
    "nome": "Fernanda Reis",
    "perfil": "personal"
  }
}
```

**Erros**

| Status | Quando |
|---|---|
| `400` | Corpo inválido (e-mail ausente, formato incorreto) |
| `401` | Credenciais incorretas |

Não há auto-cadastro. Um `personal` é criado por seed inicial do banco; cada `personal` cadastra seus próprios alunos via `POST /alunos` (seção 3.3), que recebem uma senha provisória definida pelo personal.

### 2.3 Perfis e permissões

| Perfil | Pode | Não pode |
|---|---|---|
| `personal` | Cadastrar, editar e remover exercícios do catálogo; cadastrar alunos; montar e editar fichas para seus alunos; ver sessões e evolução de qualquer aluno seu | Registrar série executada ou finalizar sessão em nome do aluno |
| `aluno` | Consultar a própria ficha; iniciar sessão de treino; registrar série executada; finalizar a própria sessão; ver a própria evolução por exercício | Ver dados de outro aluno; criar, editar ou remover exercícios ou fichas; cadastrar alunos |

### 2.4 Armazenamento do token em cada cliente

| Cliente | Onde o token fica | Nível de autenticação | Observação |
|---|---|---|---|
| Web (Next.js) | Cookie `httpOnly` gerenciado pelo servidor Next (Route Handler) | Completa | Expiração tratada; logout limpa o cookie |
| Mobile (Flutter) | Memória (variável de estado do app) | Simplificada — a confirmar no PRD | Login real contra `/auth/login`; token perdido ao fechar o app, sem refresh |

> **Regra inegociável:** sessão simplificada ou simulada no app mobile nunca significa afrouxar a API. Os endpoints continuam protegidos pelo mesmo guard, e o app continua apresentando um token válido em toda requisição autenticada — o que muda é apenas **como** esse token é obtido, não se ele é exigido.

---

## 3. Recursos

### 3.1 `Exercicio`

**Descrição:** item do catálogo de exercícios mantido pelo personal, usado para montar itens de ficha.

**Consumido por:** web (cadastro do catálogo) e mobile (consulta, ao exibir a ficha e o histórico)

#### Representação

```json
{
  "id": "a1b2c3d4-0000-0000-0000-000000000001",
  "nome": "Supino reto com barra",
  "grupoMuscular": "peito",
  "createdAt": "2026-08-13T14:30:00.000Z",
  "updatedAt": "2026-08-13T14:30:00.000Z"
}
```

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | uuid | — | Gerado pelo servidor |
| `nome` | string (1–120) | sim | |
| `grupoMuscular` | string | sim | Ex.: `peito`, `costas`, `pernas`, `ombro`, `braco`, `core` |

#### `GET /exercicios`

Lista o catálogo. Rota autenticada — qualquer perfil.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20, máximo 100 |
| `grupoMuscular` | string | Filtra por grupo muscular |

**Resposta `200`** — objeto paginado conforme a seção 1.4.

#### `GET /exercicios/:id`

**Resposta `200`** — a representação acima.

| Status | Quando |
|---|---|
| `404` | Não existe exercício com esse `id` |

#### `POST /exercicios`

Cadastra um exercício. Rota autenticada — **somente perfil `personal`**.

**Requisição**

```json
{
  "nome": "Supino reto com barra",
  "grupoMuscular": "peito"
}
```

**Resposta `201`** — a representação criada.

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente |
| `403` | Perfil `aluno` tentando cadastrar |

#### `PATCH /exercicios/:id`

**Requisição** — campos parciais da representação.
**Resposta `200`** — a representação atualizada.

| Status | Quando |
|---|---|
| `403` | Perfil `aluno` |
| `404` | Exercício inexistente |

#### `DELETE /exercicios/:id`

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `403` | Perfil `aluno` |
| `404` | Exercício inexistente |
| `409` | Exercício está em uso em algum item de ficha — remova o item antes |

---

### 3.2 `Personal`

**Descrição:** profissional responsável por cadastrar exercícios, criar fichas e acompanhar a evolução dos alunos.

**Consumido por:** web (perfil autenticado, exibido no cabeçalho da aplicação)

#### Representação

```json
{
  "id": "b2c3d4e5-0000-0000-0000-000000000002",
  "nome": "Fernanda Reis",
  "email": "fernanda@exemplo.com"
}
```

Não há endpoint de CRUD público para `Personal` no MVP — a conta é provisionada por seed do banco. `GET /auth/login` é o único ponto de contato deste recurso no contrato.

---

### 3.3 `Aluno`

**Descrição:** pessoa que treina, dona das fichas e sessões. Cadastrada pelo personal.

**Consumido por:** web (personal gerencia a lista) e mobile (o próprio aluno consulta e edita seus dados)

#### Representação

```json
{
  "id": "c3d4e5f6-0000-0000-0000-000000000003",
  "nome": "Marcos Vinicius",
  "email": "marcos@exemplo.com",
  "createdAt": "2026-08-13T14:30:00.000Z",
  "updatedAt": "2026-08-13T14:30:00.000Z"
}
```

| Campo | Tipo | Obrigatório na criação | Observação |
|---|---|---|---|
| `id` | uuid | — | Gerado pelo servidor |
| `nome` | string (1–120) | sim | |
| `email` | string | sim | Único no sistema |
| `senha` | string | sim (só na criação) | Nunca retornada nas respostas; senha provisória definida pelo personal |

#### `GET /alunos`

Lista os alunos do personal autenticado. Rota autenticada — **somente perfil `personal`**.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `busca` | string | Filtra por nome ou e-mail |

**Resposta `200`** — objeto paginado conforme a seção 1.4.

| Status | Quando |
|---|---|
| `403` | Perfil `aluno` |

#### `GET /alunos/:id`

Um `personal` só vê os próprios alunos; um `aluno` só vê a si mesmo.

**Resposta `200`** — a representação acima, sem o campo `senha`.

| Status | Quando |
|---|---|
| `403` | `personal` consultando aluno de outro personal, ou `aluno` consultando outro `id` |
| `404` | Aluno inexistente |

#### `POST /alunos`

Cadastra um aluno vinculado ao personal autenticado. Rota autenticada — **somente perfil `personal`**.

**Requisição**

```json
{
  "nome": "Marcos Vinicius",
  "email": "marcos@exemplo.com",
  "senha": "senha-provisoria-123"
}
```

**Resposta `201`** — a representação criada, sem o campo `senha`.

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente ou e-mail em formato inválido |
| `403` | Perfil `aluno` tentando cadastrar |
| `409` | Já existe usuário com esse e-mail |

#### `PATCH /alunos/:id`

**Requisição** — campos parciais (`nome`, `email`; `senha` apenas se o próprio aluno estiver trocando a sua).
**Resposta `200`** — a representação atualizada.

| Status | Quando |
|---|---|
| `403` | Tentativa de editar aluno de outro personal, ou aluno editando outro `id` |
| `404` | Aluno inexistente |

#### `DELETE /alunos/:id`

Remove um aluno cadastrado pelo personal autenticado. Rota autenticada — **somente perfil `personal`**, dono do aluno.

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `403` | Perfil `aluno`, ou aluno de outro personal |
| `404` | Aluno inexistente |
| `409` | Aluno tem ficha cadastrada — histórico não pode ser perdido |

---

### 3.4 `Ficha`

**Descrição:** conjunto de exercícios prescritos pelo personal a um aluno, com meta de séries, repetições e carga por exercício.

**Consumido por:** web (montagem e edição pelo personal) e mobile (consulta pelo aluno, para saber o treino do dia)

#### Representação

```json
{
  "id": "d4e5f6a7-0000-0000-0000-000000000004",
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "personalId": "b2c3d4e5-0000-0000-0000-000000000002",
  "itens": [
    {
      "id": "e5f6a7b8-0000-0000-0000-000000000005",
      "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001",
      "exercicio": { "id": "a1b2c3d4-0000-0000-0000-000000000001", "nome": "Supino reto com barra", "grupoMuscular": "peito" },
      "ordem": 1,
      "seriesAlvo": 4,
      "repeticoesAlvo": 10,
      "cargaSugerida": 40.0
    }
  ],
  "createdAt": "2026-08-13T14:30:00.000Z",
  "updatedAt": "2026-08-13T14:30:00.000Z"
}
```

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | uuid | — | Gerado pelo servidor |
| `alunoId` | uuid | sim | Deve ser um aluno do personal autenticado |
| `personalId` | uuid | — | Preenchido pelo servidor a partir do token |
| `itens` | array de `ItemFicha` | não, na criação | Pode ser enviado junto ou adicionado depois via sub-recurso (seção 3.5) |

#### `GET /fichas`

Lista fichas. `personal` filtra pelos seus alunos; `aluno` vê apenas as próprias, sem precisar informar `alunoId`.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `alunoId` | uuid | Filtra por aluno — ignorado se o token for de um `aluno` (usa sempre o próprio id) |

**Resposta `200`** — objeto paginado conforme a seção 1.4, com `itens` de cada ficha.

#### `GET /fichas/:id`

**Resposta `200`** — a representação acima.

| Status | Quando |
|---|---|
| `403` | `aluno` tentando ver ficha de outro aluno |
| `404` | Ficha inexistente |

#### `POST /fichas`

Cria uma ficha para um aluno do personal autenticado. Rota autenticada — **somente perfil `personal`**.

**Requisição**

```json
{
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "itens": [
    { "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001", "ordem": 1, "seriesAlvo": 4, "repeticoesAlvo": 10, "cargaSugerida": 40.0 }
  ]
}
```

**Resposta `201`** — a representação criada.

| Campo | Regra |
|---|---|
| `alunoId` | Deve existir e pertencer ao personal autenticado |
| `itens[].exercicioId` | Deve existir no catálogo |
| `itens[].cargaSugerida` | Número maior ou igual a zero |

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente, `alunoId` ou `exercicioId` inexistente |
| `403` | Perfil `aluno`, ou `alunoId` não pertence ao personal autenticado |

#### `PATCH /fichas/:id`

Atualiza dados da ficha (não os itens — ver seção 3.5). Rota autenticada — **somente perfil `personal`**, dono da ficha.

**Resposta `200`** — a representação atualizada.

#### `DELETE /fichas/:id`

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `403` | Perfil `aluno`, ou ficha de outro personal |
| `404` | Ficha inexistente |
| `409` | Ficha tem sessão de treino registrada — histórico não pode ser perdido |

---

### 3.5 `ItemFicha` (sub-recurso de `Ficha`)

**Descrição:** um exercício dentro de uma ficha, com a meta de séries/repetições e a carga sugerida para a próxima execução.

**Consumido por:** web (montagem pelo personal) e mobile (leitura, ao exibir o treino do dia)

#### Representação

Ver bloco `itens` dentro de `Ficha`, seção 3.4.

#### `POST /fichas/:fichaId/itens`

Adiciona um exercício à ficha. Rota autenticada — **somente perfil `personal`**, dono da ficha.

**Requisição**

```json
{
  "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001",
  "ordem": 2,
  "seriesAlvo": 3,
  "repeticoesAlvo": 12,
  "cargaSugerida": 20.0
}
```

**Resposta `201`** — o item criado.

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente |
| `403` | Ficha de outro personal |
| `404` | `fichaId` ou `exercicioId` inexistente |

#### `PATCH /itens-ficha/:id`

Ajusta meta de séries, repetições, ordem ou carga sugerida manualmente. Rota autenticada — **somente perfil `personal`**, dono da ficha do item.

**Resposta `200`** — o item atualizado.

#### `DELETE /itens-ficha/:id`

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `403` | Item de ficha de outro personal |
| `404` | Item inexistente |
| `409` | Item já tem série executada registrada em alguma sessão |

---

### 3.6 `SessaoTreino`

**Descrição:** uma execução do treino pelo aluno, em uma data, baseada em uma ficha. Reúne as séries executadas.

**Consumido por:** mobile (o aluno inicia, executa e finaliza) e web (o personal acompanha, em modo leitura)

#### Representação

```json
{
  "id": "f6a7b8c9-0000-0000-0000-000000000006",
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "fichaId": "d4e5f6a7-0000-0000-0000-000000000004",
  "data": "2026-09-10T13:00:00.000Z",
  "situacao": "em_andamento",
  "seriesExecutadas": [
    {
      "id": "a7b8c9d0-0000-0000-0000-000000000007",
      "itemFichaId": "e5f6a7b8-0000-0000-0000-000000000005",
      "numeroSerie": 1,
      "cargaUsada": 40.0,
      "repeticoesFeitas": 10
    }
  ]
}
```

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | uuid | — | Gerado pelo servidor |
| `alunoId` | uuid | — | Preenchido pelo servidor a partir do token |
| `fichaId` | uuid | sim, na criação | Deve pertencer ao aluno autenticado |
| `data` | ISO 8601 | — | Preenchida pelo servidor no momento da criação |
| `situacao` | enum | — | `em_andamento` \| `finalizada`; calculada pelo servidor |
| `seriesExecutadas` | array | — | Preenchido conforme o aluno registra séries |

#### `POST /sessoes-treino`

Inicia uma sessão de treino. Rota autenticada — **somente perfil `aluno`**.

**Requisição**

```json
{
  "fichaId": "d4e5f6a7-0000-0000-0000-000000000004"
}
```

**Resposta `201`** — a representação criada, com `situacao: "em_andamento"` e `seriesExecutadas: []`.

| Status | Quando |
|---|---|
| `400` | `fichaId` ausente |
| `403` | Ficha não pertence ao aluno autenticado |
| `404` | Ficha inexistente |
| `409` | Já existe uma sessão `em_andamento` para essa ficha |

#### `GET /sessoes-treino`

`aluno` vê as próprias; `personal` filtra por `alunoId` para acompanhar.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `alunoId` | uuid | Ignorado se o token for de um `aluno` |
| `fichaId` | uuid | Filtra por ficha |

**Resposta `200`** — objeto paginado conforme a seção 1.4.

#### `GET /sessoes-treino/:id`

**Resposta `200`** — a representação acima, com `seriesExecutadas`.

| Status | Quando |
|---|---|
| `403` | `aluno` consultando sessão de outro aluno |
| `404` | Sessão inexistente |

---

## 4. Endpoints de regra de negócio

### 4.1 `POST /sessoes-treino/:id/series`

**O que faz:** registra uma série executada dentro de uma sessão em andamento.

**Pré-condições:** a sessão existe, pertence ao aluno autenticado e está com `situacao` em `em_andamento`. O `itemFichaId` informado pertence à ficha da sessão.

**Requisição**

```json
{
  "itemFichaId": "e5f6a7b8-0000-0000-0000-000000000005",
  "numeroSerie": 1,
  "cargaUsada": 40.0,
  "repeticoesFeitas": 10
}
```

**Resposta `201`**

```json
{
  "id": "a7b8c9d0-0000-0000-0000-000000000007",
  "sessaoTreinoId": "f6a7b8c9-0000-0000-0000-000000000006",
  "itemFichaId": "e5f6a7b8-0000-0000-0000-000000000005",
  "numeroSerie": 1,
  "cargaUsada": 40.0,
  "repeticoesFeitas": 10
}
```

**Erros específicos**

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente, `cargaUsada` ou `repeticoesFeitas` negativos |
| `403` | Sessão de outro aluno |
| `404` | Sessão ou `itemFichaId` inexistente |
| `409` | Sessão já está `finalizada`, ou `itemFichaId` não pertence à ficha da sessão |

---

### 4.2 `POST /sessoes-treino/:id/finalizar`

**O que faz:** encerra a sessão e recalcula, para cada item da ficha com série registrada nesta sessão, a `cargaSugerida` a ser usada na próxima vez — é aqui que a sobrecarga progressiva acontece.

**Regra do cálculo:** para cada `itemFicha` da sessão, compara `repeticoesFeitas` em todas as séries registradas contra `repeticoesAlvo`:
- Se o aluno completou `repeticoesAlvo` (ou mais) em **todas** as séries do item, a `cargaSugerida` do item aumenta em 5% em relação à `cargaUsada` da última série.
- Se completou em parte das séries, a `cargaSugerida` mantém o mesmo valor.
- Se ficou abaixo de `repeticoesAlvo` em mais de uma série, a `cargaSugerida` reduz em 5%.

**O cálculo é feito no servidor** — o cliente exibe o valor recebido, nunca o recalcula.

**Pré-condições:** a sessão existe, pertence ao aluno autenticado, está `em_andamento` e tem ao menos uma série registrada.

**Requisição:** sem corpo.

**Resposta `200`**

```json
{
  "id": "f6a7b8c9-0000-0000-0000-000000000006",
  "situacao": "finalizada",
  "itensAtualizados": [
    {
      "itemFichaId": "e5f6a7b8-0000-0000-0000-000000000005",
      "cargaAnterior": 40.0,
      "cargaSugeridaNova": 42.0
    }
  ]
}
```

**Erros específicos**

| Status | Quando |
|---|---|
| `403` | Sessão de outro aluno |
| `404` | Sessão inexistente |
| `409` | Sessão já está `finalizada`, ou não tem nenhuma série registrada |

---

### 4.3 `GET /alunos/:alunoId/exercicios/:exercicioId/evolucao`

**O que faz:** devolve a série histórica de carga usada pelo aluno naquele exercício, ordenada por data — base do gráfico de evolução no web.

**Pré-condições:** `personal` só consulta alunos próprios; `aluno` só consulta a si mesmo.

**Resposta `200`**

```json
{
  "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001",
  "exercicio": "Supino reto com barra",
  "pontos": [
    { "data": "2026-08-20T13:00:00.000Z", "cargaMaxima": 38.0 },
    { "data": "2026-08-27T13:00:00.000Z", "cargaMaxima": 40.0 },
    { "data": "2026-09-03T13:00:00.000Z", "cargaMaxima": 42.0 }
  ]
}
```

`cargaMaxima` é a maior `cargaUsada` registrada entre as séries daquele exercício, na sessão daquela data.

**Erros específicos**

| Status | Quando |
|---|---|
| `403` | `aluno` consultando outro `alunoId`, ou `personal` consultando aluno que não é seu |
| `404` | Aluno ou exercício inexistente, ou nenhuma sessão finalizada envolvendo esse exercício |

---

## 5. Diferenças de consumo entre os clientes

| Endpoint | Diferença | Cliente | Motivo |
|---|---|---|---|
| `GET /fichas` | `alunoId` é ignorado e resolvido pelo próprio token | Mobile | O aluno nunca precisa saber ou informar seu próprio id |
| `GET /sessoes-treino/:id` | Devolve `seriesExecutadas` embutidas na mesma resposta, em vez de endpoint separado | Mobile | Evita múltiplas chamadas durante o treino, quando a conectividade pode ser instável |
| `GET /alunos/:alunoId/exercicios/:exercicioId/evolucao` | Consumido para montar gráfico de série temporal | Web | O mobile não exibe gráfico de evolução no recorte mínimo do MVP |

---

## 6. Como verificar o contrato

- [ ] Coleção de requisições versionada no repositório (arquivo `.http`, Insomnia ou Postman)
- [ ] Swagger habilitado no backend (`@nestjs/swagger`) — URL: `http://localhost:3000/api`
- [ ] Tipos do cliente web derivados do contrato, em `web/src/types/`
- [ ] Modelos do mobile derivados do contrato, em `mobile/lib/models/`

Se o grupo habilitar o Swagger, este documento continua sendo necessário: o Swagger descreve a API que **existe**, e o contrato descreve a que foi **acordada**. Os dois convergem na entrega final, mas cumprem papéis diferentes durante o projeto.

---

## 7. Histórico de revisões

| Versão | Data | Alteração | Impacto nos clientes |
|---|---|---|---|
| 1.0 | 2026-09-12 | Versão inicial: autenticação, `Exercicio`, `Aluno`, `Personal`, `Ficha`, `ItemFicha`, `SessaoTreino` e regra de sobrecarga progressiva | — |
| 1.1 | 2026-09-24 | Adiciona `DELETE /alunos/:id` (faltava no contrato original) | Web: personal passa a poder remover um aluno |
