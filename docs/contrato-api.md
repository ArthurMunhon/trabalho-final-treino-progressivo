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
| **Versão do contrato** | 1.2 |
| **Última atualização** | 2026-11-23 |
| **URL base (desenvolvimento)** | `http://localhost:3001` |
| **Formato** | JSON (`Content-Type: application/json`) |

> **Porta 3001:** o NestJS sobe na porta 3001 (`backend/src/main.ts`) porque o Next.js usa a 3000 no desenvolvimento.

> **Nota para o app mobile:** `localhost` dentro do emulador Android aponta para o próprio emulador, não para a máquina do desenvolvedor. O app usa `http://10.0.2.2:3001` no emulador Android, ou o IP da máquina na rede local para dispositivo físico. A URL não fica fixa no meio do código: é lida de `--dart-define=API_URL=...` (constante `enderecoDaApi` em `mobile/lib/treino_api.dart`), com `http://10.0.2.2:3001` como padrão.

---

## 1. Convenções gerais

### 1.1 Nomenclatura

- Recursos no plural e em português, sem acento: `/exercicios`, `/fichas`, `/alunos`, `/sessoes-treino`, `/solicitacoes`
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

Operações que não são CRUD puro — registrar uma série executada, finalizar uma sessão e recalcular carga, aceitar uma solicitação — ficam como sub-recurso (`POST /sessoes-treino/:id/finalizar`, `POST /solicitacoes/:id/aceitar`) em vez de campo em um `PATCH` genérico. Ver seção 4.

Os logins (`POST /personal/login`, `POST /app/login`) respondem `200`, não `201`: não criam recurso.

### 1.3 Formato de erro

Toda resposta de erro segue o mesmo formato, em qualquer endpoint:

```json
{
  "statusCode": 400,
  "message": ["cargaUsada must not be less than 0", "itemFichaId must be a UUID"],
  "error": "Bad Request"
}
```

Formato padrão do NestJS (`ValidationPipe` + filtro de exceção global). `message` é **uma string** nos erros lançados pelos serviços (`404`, `409`, `401`) e **uma lista de strings** nos erros de validação (`400`). Os clientes devem tratar os dois casos. As mensagens de validação vêm do `class-validator`, em inglês, salvo onde o DTO define mensagem própria.

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

Há dois níveis de autenticação, um por cliente:

| Cliente | Usuário | Como entra | O que recebe |
|---|---|---|---|
| Web | `personal` | E-mail e senha em `POST /personal/login` | Token JWT (HS256) com validade de 8 horas (`JWT_EXPIRES_IN`), contendo `sub` (id do personal) e `email` |
| Mobile | `aluno` | Só o e-mail, em `POST /app/login` (**login simulado**) | Os dados do aluno, **sem token** |

Não há refresh token no MVP — expirado, o personal faz login novamente.

Requisições autenticadas enviam o token no cabeçalho:

```
Authorization: Bearer <token>
```

### 2.2 Endpoints de autenticação

#### `POST /personal/register`

Cria a conta de um personal. Rota pública (usada pela página `/cadastro` do web).

**Requisição**

```json
{
  "nome": "Carlos Souza",
  "email": "carlos@fittrack.com",
  "senha": "123456"
}
```

| Campo | Regra |
|---|---|
| `nome` | string, 1–120 caracteres |
| `email` | e-mail válido, único entre os personals |
| `senha` | string, mínimo 6 caracteres; guardada com hash bcrypt |

**Resposta `201`** — mesmo formato da resposta de login abaixo (o personal já sai autenticado).

| Status | Quando |
|---|---|
| `400` | Campo ausente ou fora da regra |
| `409` | Já existe personal com esse e-mail |

#### `POST /personal/login`

Autentica o personal e devolve o token de acesso.

**Requisição**

```json
{
  "email": "carlos@fittrack.com",
  "senha": "123456"
}
```

**Resposta `200`**

```json
{
  "accessToken": "eyJhbGciOi...",
  "personal": {
    "id": "9f1c2b6e-4a7d-4b28-9a4e-2d5f8c1e7b30",
    "nome": "Carlos Souza",
    "email": "carlos@fittrack.com"
  }
}
```

**Erros**

| Status | Quando |
|---|---|
| `400` | Corpo inválido (e-mail ausente, formato incorreto) |
| `401` | Credenciais incorretas |

#### `POST /app/login`

Login **simulado** do app mobile: identifica qual aluno está usando o app para saber de quem puxar a ficha e as sessões. Não confere senha e não gera token. Rota pública.

**Requisição**

```json
{
  "email": "marcos@exemplo.com"
}
```

O e-mail passa por `trim()` e é convertido para minúsculas antes da busca.

**Resposta `200`**

```json
{
  "id": "3bdbcdb1-dfe5-49d1-a0dc-e0698a8749e4",
  "nome": "Marcos Vinicius",
  "email": "marcos@exemplo.com",
  "personalId": "6f763d50-278d-479b-89ff-69c500412e12"
}
```

`personalId` vem `null` enquanto nenhum personal aceitou o aluno (ver seção 3.7). O campo `senha` nunca é devolvido.

**Erros**

| Status | Quando |
|---|---|
| `400` | E-mail ausente ou em formato inválido |
| `404` | Nenhum aluno com esse e-mail (`"message": "Aluno não encontrado"`) |

### 2.3 Perfis e permissões

| Perfil | Pode | Não pode |
|---|---|---|
| `personal` | Cadastrar, editar e remover exercícios do catálogo; cadastrar, editar e remover os próprios alunos; montar e editar fichas para seus alunos; ver sessões de qualquer aluno seu; aceitar ou recusar solicitações enviadas a ele | Registrar série executada ou finalizar sessão em nome do aluno; ver ou alterar alunos de outro personal |
| `aluno` | Consultar a própria ficha; iniciar sessão de treino; registrar série executada; finalizar a própria sessão; enviar solicitação para um personal | Criar, editar ou remover exercícios ou fichas; cadastrar alunos |

**Proteção por rota no estado atual da API:**

| Rotas | Exige token de personal? | Observação |
|---|---|---|
| `/alunos/**` | sim | Filtra sempre pelo personal do token: aluno de outro personal responde `404` |
| `/solicitacoes/**` (lado do personal) | sim | Idem |
| `/personal/register`, `/personal/login`, `/app/login` | não | Rotas de entrada |
| `/exercicios/**`, `/fichas/**`, `/itens-ficha/**`, `/sessoes-treino/**` | **não** | Ver pendência abaixo |

> **Pendência conhecida:** as rotas de catálogo, fichas e sessões ainda não têm guard. Como consequência, `POST /fichas` recebe `personalId` no corpo e `POST /sessoes-treino` recebe `alunoId` no corpo, em vez de tirá-los do token. As permissões da tabela acima são aplicadas pelos clientes (o web só mostra os dados do personal logado; o app só usa o `id` devolvido pelo `/app/login`), não pela API. Proteger catálogo e fichas com o guard do personal não afeta o app, que só lê essas rotas pelo `alunoId`.

### 2.4 Armazenamento da sessão em cada cliente

| Cliente | Onde a sessão fica | Nível de autenticação | Observação |
|---|---|---|---|
| Web (Next.js) | Cookie `httpOnly` `token` (8h) gravado por Server Action; o `nome` vai em outro cookie só para exibição | Completa | Toda chamada ao backend é feita no servidor Next, lendo o cookie e enviando `Authorization`; sem cookie, as páginas redirecionam para `/login`; logout limpa os cookies |
| Mobile (Flutter) | `Aluno` mantido em memória (estado do app) após o `POST /app/login` | **Simulada** — só e-mail, sem senha e sem token | Fechar o app perde a sessão; o `id` do aluno é passado como `alunoId` nas consultas e na criação de sessão |

> **Mudança em relação à versão 1.1:** a versão anterior exigia que o app apresentasse um token válido em toda requisição ("regra inegociável"). Por orientação do professor em aula, essa exigência deixou de ser obrigatória para o app mobile, e o grupo adotou o login simulado descrito acima. A autenticação do cliente web continua completa.

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
| `nome` | string (1–120) | sim | Único no catálogo |
| `grupoMuscular` | string | sim | Ex.: `peito`, `costas`, `pernas`, `ombro`, `braco`, `core` |

#### `GET /exercicios`

Lista o catálogo.

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

Cadastra um exercício. Uso previsto: **somente perfil `personal`** (ver pendência da seção 2.3).

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
| `409` | Já existe exercício com esse nome |

> **Pendência:** o `nome` é único no banco, mas o serviço ainda não trata a duplicidade — hoje um nome repetido responde `500`. O `409` acima é o comportamento acordado.

#### `PATCH /exercicios/:id`

**Requisição** — campos parciais da representação.
**Resposta `200`** — a representação atualizada.

| Status | Quando |
|---|---|
| `404` | Exercício inexistente |

#### `DELETE /exercicios/:id`

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `404` | Exercício inexistente |
| `409` | Exercício está em uso em algum item de ficha — remova o item antes |

---

### 3.2 `Personal`

**Descrição:** profissional responsável por cadastrar exercícios, criar fichas, aceitar alunos e acompanhar a evolução deles.

**Consumido por:** web (perfil autenticado, exibido no cabeçalho da aplicação)

#### Representação

```json
{
  "id": "b2c3d4e5-0000-0000-0000-000000000002",
  "nome": "Carlos Souza",
  "email": "carlos@fittrack.com"
}
```

A conta é criada pelo próprio personal em `POST /personal/register` ou pelo seed do banco (`carlos@fittrack.com` / `123456`). Não há outros endpoints para este recurso no MVP.

---

### 3.3 `Aluno`

**Descrição:** pessoa que treina, dona das fichas e sessões. Fica vinculada a um personal — pelo cadastro feito pelo próprio personal (`POST /alunos`) ou por uma solicitação aceita (seção 3.7).

**Consumido por:** web (personal gerencia a lista) e mobile (login simulado, seção 2.2)

#### Representação

```json
{
  "id": "c3d4e5f6-0000-0000-0000-000000000003",
  "nome": "Marcos Vinicius",
  "email": "marcos@exemplo.com",
  "personalId": "b2c3d4e5-0000-0000-0000-000000000002",
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
| `personalId` | uuid \| `null` | — | Preenchido pelo servidor; `null` até um personal aceitar o aluno |

Todas as rotas abaixo exigem **token de personal** e atuam só sobre os alunos dele.

#### `GET /alunos`

Lista os alunos do personal autenticado.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `busca` | string | Filtra por nome ou e-mail (sem diferenciar maiúsculas) |

**Resposta `200`** — objeto paginado conforme a seção 1.4.

| Status | Quando |
|---|---|
| `401` | Sem token, ou token inválido/expirado |

#### `GET /alunos/:id`

**Resposta `200`** — a representação acima, sem o campo `senha`.

| Status | Quando |
|---|---|
| `401` | Sem token |
| `404` | Aluno inexistente ou de outro personal |

#### `POST /alunos`

Cadastra um aluno vinculado ao personal autenticado.

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
| `401` | Sem token |
| `409` | Já existe usuário com esse e-mail |

#### `PATCH /alunos/:id`

**Requisição** — campos parciais (`nome`, `email`, `senha`).
**Resposta `200`** — a representação atualizada.

| Status | Quando |
|---|---|
| `401` | Sem token |
| `404` | Aluno inexistente ou de outro personal |

#### `DELETE /alunos/:id`

Remove um aluno do personal autenticado.

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
| `401` | Sem token |
| `404` | Aluno inexistente ou de outro personal |
| `409` | Aluno tem ficha cadastrada — histórico não pode ser perdido |

---

### 3.4 `Ficha`

**Descrição:** conjunto de exercícios prescritos pelo personal a um aluno, com a meta de cada exercício (séries, repetições e carga para força; duração, velocidade e inclinação para cardio).

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
      "fichaId": "d4e5f6a7-0000-0000-0000-000000000004",
      "ordem": 1,
      "tipo": "forca",
      "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001",
      "exercicio": { "id": "a1b2c3d4-0000-0000-0000-000000000001", "nome": "Supino reto com barra", "grupoMuscular": "peito" },
      "nomePersonalizado": null,
      "seriesAlvo": 4,
      "repeticoesAlvo": 10,
      "cargaSugerida": 40.0,
      "duracaoMin": null,
      "velocidadeKmh": null,
      "inclinacaoPct": null
    },
    {
      "id": "e5f6a7b8-0000-0000-0000-000000000006",
      "fichaId": "d4e5f6a7-0000-0000-0000-000000000004",
      "ordem": 2,
      "tipo": "cardio",
      "exercicioId": null,
      "exercicio": null,
      "nomePersonalizado": "Esteira",
      "seriesAlvo": null,
      "repeticoesAlvo": null,
      "cargaSugerida": null,
      "duracaoMin": 20,
      "velocidadeKmh": 8.5,
      "inclinacaoPct": 2.0
    }
  ],
  "createdAt": "2026-08-13T14:30:00.000Z",
  "updatedAt": "2026-08-13T14:30:00.000Z"
}
```

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | uuid | — | Gerado pelo servidor |
| `alunoId` | uuid | sim | Deve ser um aluno do personal |
| `personalId` | uuid | sim (no corpo, por enquanto) | Deveria vir do token — ver pendência da seção 2.3 |
| `itens` | array de `ItemFicha` | não, na criação | Pode ser enviado junto ou adicionado depois via sub-recurso (seção 3.5) |

#### `GET /fichas`

Lista fichas com seus itens (e o exercício de cada item).

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `alunoId` | uuid | Filtra por aluno. **É assim que o app mobile busca a ficha do aluno logado** |

**Resposta `200`** — objeto paginado conforme a seção 1.4, com `itens` de cada ficha.

**Ordenação:** as fichas vêm da mais antiga para a mais nova (`createdAt` crescente), e os itens de cada ficha vêm em `ordem` crescente. Os clientes usam essa ordem para distribuir as fichas na semana: a 1ª ficha é a de segunda, a 2ª a de terça, e assim por diante, até a 7ª no domingo.

#### `GET /fichas/:id`

**Resposta `200`** — a representação acima.

| Status | Quando |
|---|---|
| `404` | Ficha inexistente |

#### `POST /fichas`

Cria uma ficha para um aluno. Uso previsto: **somente perfil `personal`**.

**Requisição**

```json
{
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "personalId": "b2c3d4e5-0000-0000-0000-000000000002",
  "itens": [
    { "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001", "tipo": "forca", "ordem": 1, "seriesAlvo": 4, "repeticoesAlvo": 10, "cargaSugerida": 40.0 },
    { "nomePersonalizado": "Esteira", "tipo": "cardio", "ordem": 2, "duracaoMin": 20, "velocidadeKmh": 8.5, "inclinacaoPct": 2.0 }
  ]
}
```

**Resposta `201`** — a representação criada.

| Campo | Regra |
|---|---|
| `alunoId` | Deve existir |
| `personalId` | Deve existir |
| `itens[]` | Mesmas regras de `POST /fichas/:fichaId/itens` (seção 3.5) |

| Status | Quando |
|---|---|
| `400` | Campo obrigatório ausente, `alunoId`, `personalId` ou `exercicioId` inexistente, item fora das regras |

#### `PATCH /fichas/:id`

Atualiza dados da ficha (não os itens — ver seção 3.5). Uso previsto: **somente perfil `personal`**, dono da ficha.

**Resposta `200`** — a representação atualizada.

| Status | Quando |
|---|---|
| `400` | `alunoId` inexistente |
| `404` | Ficha inexistente |

#### `DELETE /fichas/:id`

**Resposta `204`** — sem corpo. Os itens da ficha são removidos junto, na mesma transação (tudo ou nada).

| Status | Quando |
|---|---|
| `404` | Ficha inexistente |
| `409` | Ficha tem sessão de treino registrada — histórico não pode ser perdido |

---

### 3.5 `ItemFicha` (sub-recurso de `Ficha`)

**Descrição:** um exercício dentro de uma ficha. Pode ser de **força** (séries, repetições e carga sugerida, que a sobrecarga progressiva recalcula) ou de **cardio** (duração, velocidade e inclinação, sem progressão automática). O exercício vem do catálogo (`exercicioId`) **ou** é um nome livre definido pelo personal (`nomePersonalizado`).

**Consumido por:** web (montagem pelo personal) e mobile (leitura, ao exibir o treino do dia)

#### Representação

Ver bloco `itens` dentro de `Ficha`, seção 3.4.

| Campo | Tipo | Regra |
|---|---|---|
| `exercicioId` | uuid \| `null` | Exercício do catálogo. **Exatamente um** entre `exercicioId` e `nomePersonalizado` |
| `nomePersonalizado` | string (até 80) \| `null` | Nome livre, quando o exercício não está no catálogo |
| `tipo` | `forca` \| `cardio` | Obrigatório |
| `ordem` | inteiro ≥ 1 | Obrigatório |
| `seriesAlvo` | inteiro 1–20 | Obrigatório se `tipo = forca` |
| `repeticoesAlvo` | inteiro 1–100 | Obrigatório se `tipo = forca` |
| `cargaSugerida` | número 0–1000 (kg) | Opcional; sem carga, o item fica fora da sobrecarga progressiva |
| `duracaoMin` | inteiro 1–300 | Obrigatório se `tipo = cardio` |
| `velocidadeKmh` | número 0,1–40 | Opcional (cardio) |
| `inclinacaoPct` | número 0–40 | Opcional (cardio) |

#### `POST /fichas/:fichaId/itens`

Adiciona um exercício à ficha. Uso previsto: **somente perfil `personal`**, dono da ficha.

**Requisição**

```json
{
  "exercicioId": "a1b2c3d4-0000-0000-0000-000000000001",
  "tipo": "forca",
  "ordem": 2,
  "seriesAlvo": 3,
  "repeticoesAlvo": 12,
  "cargaSugerida": 20.0
}
```

**Resposta `201`** — o item criado.

| Status | Quando |
|---|---|
| `400` | Campo fora da regra; `exercicioId` e `nomePersonalizado` juntos ou nenhum dos dois; força sem `seriesAlvo`/`repeticoesAlvo`; cardio sem `duracaoMin` |
| `404` | `fichaId` ou `exercicioId` inexistente |

#### `PATCH /itens-ficha/:id`

Ajusta a meta, a ordem ou a carga sugerida manualmente. Uso previsto: **somente perfil `personal`**, dono da ficha do item.

**Resposta `200`** — o item atualizado.

| Status | Quando |
|---|---|
| `404` | Item inexistente |

#### `DELETE /itens-ficha/:id`

**Resposta `204`** — sem corpo.

| Status | Quando |
|---|---|
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
      "sessaoTreinoId": "f6a7b8c9-0000-0000-0000-000000000006",
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
| `alunoId` | uuid | sim, na criação | Enviado no corpo — o app usa o `id` devolvido pelo `POST /app/login` |
| `fichaId` | uuid | sim, na criação | Deve pertencer ao `alunoId` informado |
| `data` | ISO 8601 | — | Preenchida pelo servidor no momento da criação |
| `situacao` | enum | — | `em_andamento` \| `finalizada`; calculada pelo servidor |
| `seriesExecutadas` | array | — | Preenchido conforme o aluno registra séries |

#### `POST /sessoes-treino`

Inicia uma sessão de treino. Uso previsto: **app mobile, pelo aluno**.

**Requisição**

```json
{
  "fichaId": "d4e5f6a7-0000-0000-0000-000000000004",
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003"
}
```

**Resposta `201`** — a representação criada, com `situacao: "em_andamento"` e `seriesExecutadas: []`.

| Status | Quando |
|---|---|
| `400` | `fichaId` ou `alunoId` ausente, ou a ficha não pertence ao `alunoId` informado |
| `404` | Ficha inexistente |
| `409` | Já existe uma sessão `em_andamento` para essa ficha |

#### `GET /sessoes-treino`

O app filtra pelo aluno logado; o web filtra pelo aluno que o personal está acompanhando.

| Parâmetro de consulta | Tipo | Descrição |
|---|---|---|
| `page` | número | Página, padrão 1 |
| `limit` | número | Itens por página, padrão 20 |
| `alunoId` | uuid | Filtra por aluno |
| `fichaId` | uuid | Filtra por ficha |

**Resposta `200`** — objeto paginado conforme a seção 1.4, cada sessão com `seriesExecutadas`.

#### `GET /sessoes-treino/:id`

**Resposta `200`** — a representação acima, com `seriesExecutadas`.

| Status | Quando |
|---|---|
| `404` | Sessão inexistente |
<!--  -->
---

### 3.7 `Solicitacao`

**Descrição:** pedido de um aluno para ser atendido por um personal. O aluno envia pelo app mobile; o personal vê os pedidos pendentes no web e aceita ou recusa. Aceitar vincula o aluno ao personal (`Aluno.personalId`) e apaga todos os pedidos pendentes daquele aluno.

**Consumido por:** mobile (o aluno envia — **previsto**) e web (o personal lista, aceita e recusa)

#### Representação (como o personal recebe em `GET /solicitacoes`)

```json
{
  "id": "0a1b2c3d-0000-0000-0000-000000000008",
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "personalId": "b2c3d4e5-0000-0000-0000-000000000002",
  "createdAt": "2026-11-20T18:00:00.000Z",
  "aluno": {
    "id": "c3d4e5f6-0000-0000-0000-000000000003",
    "nome": "Marcos Vinicius",
    "email": "marcos@exemplo.com"
  }
}
```

Um aluno não pode ter dois pedidos para o mesmo personal (par `alunoId` + `personalId` único). Remover o aluno ou o personal apaga os pedidos dele.

#### `GET /solicitacoes`

Lista os pedidos pendentes **para o personal do token**, os mais recentes primeiro. Exige token de personal.

**Resposta `200`** — array da representação acima (sem paginação).

| Status | Quando |
|---|---|
| `401` | Sem token |

#### `POST /solicitacoes` _(previsto — ainda não implementado)_

O aluno pede para ser atendido por um personal, informando o e-mail dele. Chamado pelo app mobile.

**Requisição prevista**

```json
{
  "alunoId": "c3d4e5f6-0000-0000-0000-000000000003",
  "emailPersonal": "carlos@fittrack.com"
}
```

> Como o app não tem token (seção 2.4), o `alunoId` precisa vir no corpo — o `CreateSolicitacaoDto` atual só tem `emailPersonal` e assume o id vindo do token; precisa ser ajustado quando a rota for implementada.

**Resposta prevista `201`** — a representação criada.

| Status | Quando |
|---|---|
| `400` | E-mail inválido ou `alunoId` ausente |
| `404` | Aluno ou personal inexistente |
| `409` | Já existe pedido desse aluno para esse personal, ou o aluno já tem personal |

#### Endpoints de aceitar e recusar

Ver seção 4.4.

> **Em aberto:** ainda não está decidido como nasce a conta de um aluno **sem** personal (que é quem envia solicitação). Hoje esses alunos só existem pelo seed (`backend/prisma/Criar-solicitacao.ts`). Existe um `RegisterAlunoDto` (`nome`, `email`, `senha`) previsto para um cadastro pelo app em `POST /aluno-auth/register`, mas a rota não foi criada e a decisão ainda está com o grupo.

---

## 4. Endpoints de regra de negócio

### 4.1 `POST /sessoes-treino/:id/series`

**O que faz:** registra uma série executada dentro de uma sessão em andamento.

**Pré-condições:** a sessão existe e está com `situacao` em `em_andamento`. O `itemFichaId` informado pertence à ficha da sessão.

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
| `404` | Sessão ou `itemFichaId` inexistente |
| `409` | Sessão já está `finalizada`, ou `itemFichaId` não pertence à ficha da sessão |

---

### 4.2 `POST /sessoes-treino/:id/finalizar`

**O que faz:** encerra a sessão e recalcula, para cada item **de força com carga sugerida** que teve série registrada nesta sessão, a `cargaSugerida` a ser usada na próxima vez — é aqui que a sobrecarga progressiva acontece.

**Regra do cálculo:** para cada `itemFicha` da sessão, compara `repeticoesFeitas` em todas as séries registradas contra `repeticoesAlvo`:
- Se o aluno completou `repeticoesAlvo` (ou mais) em **todas** as séries do item, a `cargaSugerida` do item aumenta em 5% em relação à `cargaUsada` da última série.
- Se ficou abaixo de `repeticoesAlvo` em mais de uma série, a `cargaSugerida` reduz em 5% em relação à `cargaUsada` da última série.
- Nos demais casos, a `cargaSugerida` mantém o mesmo valor.
- Itens de **cardio** e itens **sem `cargaSugerida`** ficam fora do cálculo e não aparecem em `itensAtualizados`.
- Os valores são arredondados para duas casas decimais.

**O cálculo é feito no servidor** — o cliente exibe o valor recebido, nunca o recalcula.

**Pré-condições:** a sessão existe, está `em_andamento` e tem ao menos uma série registrada.

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
| `404` | Sessão inexistente |
| `409` | Sessão já está `finalizada`, ou não tem nenhuma série registrada |

---

### 4.3 `GET /alunos/:alunoId/exercicios/:exercicioId/evolucao` _(previsto — ainda não implementado)_

**O que faz:** devolve a série histórica de carga usada pelo aluno naquele exercício, ordenada por data — base do gráfico de evolução no web.

**Pré-condições:** `personal` só consulta alunos próprios.

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
| `401` | Sem token |
| `404` | Aluno ou exercício inexistente, aluno de outro personal, ou nenhuma sessão finalizada envolvendo esse exercício |

---

### 4.4 `POST /solicitacoes/:id/aceitar` e `DELETE /solicitacoes/:id`

**O que fazem:** o personal do token responde a um pedido enviado a ele. Exigem token de personal; `:id` deve ser um uuid.

**`POST /solicitacoes/:id/aceitar`** — em uma única transação:
1. vincula o aluno ao personal (`Aluno.personalId` = id do personal do token);
2. apaga **todos** os pedidos pendentes daquele aluno, inclusive os enviados a outros personals.

**`DELETE /solicitacoes/:id`** — recusa: apaga só esse pedido.

**Requisição:** sem corpo, nos dois.

**Resposta `204`** — sem corpo, nos dois.

| Status | Quando |
|---|---|
| `400` | `:id` não é uuid |
| `401` | Sem token |
| `404` | Pedido inexistente ou enviado a outro personal |

---

## 5. Diferenças de consumo entre os clientes

| Endpoint | Diferença | Cliente | Motivo |
|---|---|---|---|
| `POST /app/login` × `POST /personal/login` | O app identifica o aluno só pelo e-mail e não recebe token; o web autentica com senha e guarda o token em cookie | Mobile × Web | Login simulado no app, conforme orientação do professor (seção 2.4) |
| `GET /fichas` | O app sempre informa `alunoId` = id do aluno logado | Mobile | Sem token, a API não sabe quem é o aluno |
| `POST /sessoes-treino` | O app envia `alunoId` no corpo | Mobile | Idem |
| `GET /sessoes-treino/:id` | Devolve `seriesExecutadas` embutidas na mesma resposta, em vez de endpoint separado | Mobile | Evita múltiplas chamadas durante o treino, quando a conectividade pode ser instável |
| `/solicitacoes` | O app só envia (`POST`, previsto); o web lista, aceita e recusa | Mobile × Web | Quem pede é o aluno, quem decide é o personal |
| `GET /alunos/:alunoId/exercicios/:exercicioId/evolucao` | Consumido para montar gráfico de série temporal | Web | O mobile não exibe gráfico de evolução no recorte mínimo do MVP |

---

## 6. Como verificar o contrato

- [x] Coleção de requisições versionada no repositório — arquivos `.http` em `backend/requests/` (`alunos.http`, `exercicios.http`, `fichas.http`, `sessoes-treino.http`, `requisicoes.http` para o `/app/login`)
- [ ] Swagger habilitado no backend (`@nestjs/swagger`) — URL: `http://localhost:3001/api`
- [ ] Tipos do cliente web derivados do contrato
- [x] Modelos do mobile derivados do contrato, em `mobile/lib/models/` (`Aluno.fromJson` já segue a resposta do `/app/login`)

Se o grupo habilitar o Swagger, este documento continua sendo necessário: o Swagger descreve a API que **existe**, e o contrato descreve a que foi **acordada**. Os dois convergem na entrega final, mas cumprem papéis diferentes durante o projeto.

---

## 7. Histórico de revisões

| Versão | Data | Alteração | Impacto nos clientes |
|---|---|---|---|
| 1.0 | 2026-09-12 | Versão inicial: autenticação, `Exercicio`, `Aluno`, `Personal`, `Ficha`, `ItemFicha`, `SessaoTreino` e regra de sobrecarga progressiva | — |
| 1.1 | 2026-09-24 | Adiciona `DELETE /alunos/:id` (faltava no contrato original) | Web: personal passa a poder remover um aluno |
| 1.2 | 2026-11-23 | Alinha o contrato à API implementada: porta 3001; login do personal em `POST /personal/login` e cadastro em `POST /personal/register` (substituem `/auth/login`); login simulado do app em `POST /app/login` (sem token, por orientação do professor em aula); `Aluno.personalId`; `ItemFicha` com `tipo` (força/cardio), `nomePersonalizado` e campos de cardio; recurso `Solicitacao` (`GET /solicitacoes`, aceitar, recusar; `POST` previsto); `alunoId`/`personalId` no corpo enquanto as rotas não têm guard; cardio fora da sobrecarga progressiva; evolução marcada como prevista; pendências registradas | Web: já usa as rotas novas. Mobile: passa a usar `/app/login` e `alunoId` explícito |
| 1.3 | 2026-11-25 | `GET /fichas` com ordem definida (fichas por `createdAt` crescente, itens por `ordem`), base da distribuição das fichas na semana; `DELETE /fichas/:id` remove os itens junto, em transação | Web: tela de fichas por dia da semana. Mobile: precisa escolher a ficha do dia em vez de pegar a primeira |
