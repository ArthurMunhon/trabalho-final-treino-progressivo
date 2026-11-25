# Relatório Técnico de Desenvolvimento

> **Instruções:** Este documento é um diário técnico, escrito **ao longo** do projeto. Registre decisões, dificuldades e uso de IA à medida que acontecem — o que é reconstruído de memória na última semana fica genérico e se nota.
>
> O documento é organizado por **etapa**. Se o grupo trabalha em sprints mais curtas dentro de uma etapa, agrupe o relato na etapa correspondente.
>
> Campos marcados com _(a preencher)_ dependem de quem conduziu aquela parte.

---

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Treino Progressivo |
| **Grupo** | 2 |
| **Integrantes** | Arthur Munhon (mobile), Othavio Pedretti (web) |
| **Repositório** | `https://github.com/ArthurMunhon/trabalho-final-treino-progressivo` |
| **Vídeo de apresentação** | _(link após a entrega)_ |

---

## 1. Ambiente de desenvolvimento

### 1.1 Ferramentas e versões

| Ferramenta | Versão | Quem |
|---|---|---|
| Node.js | 24.14.0 | Arthur |
| Flutter SDK | 3.50.0 (Dart 3.14.0) | Arthur |
| PostgreSQL | 18 (imagem `postgres:18`) | ambos |
| Docker | 29.3.1 (Docker Desktop) | Arthur |
| Emulador ou dispositivo usado no mobile | Emulador Android `sdk gphone64 x86 64`, API 37 | Arthur |
| Sistema operacional | Windows 11 Pro | Arthur |
| _(ferramentas do Othavio)_ | _(a preencher)_ | Othavio |

**Como o banco foi provisionado:** _(x) Docker Compose · ( ) PostgreSQL instalado na máquina · ( ) serviço hospedado_

### 1.2 Divergências em relação ao README

| Componente | O que divergiu | Como foi resolvido |
|---|---|---|
| Backend | O README diz que a API roda na porta 3000; o `main.ts` sobe na **3001** | Mantida a 3001 (o Next usa a 3000); contrato e clientes usam 3001 |
| Backend | Depois de clonar, faltavam `node_modules` e `.env`, e o editor acusava erro nos imports de `class-validator` | `npm install`, `cp .env.example .env`, `npx prisma migrate dev`, `npx prisma generate`, `npx tsx prisma/seed.ts` |
| Banco | `docker compose up -d` falhou com `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine` | O Docker Desktop precisava estar aberto (engine rodando) antes do comando |
| Mobile | Android 9+ bloqueia `http://` sem TLS | `android:usesCleartextTraffic="true"` e permissão `INTERNET` no `AndroidManifest.xml` (só para desenvolvimento) |
| Backend | `npm install` em outra máquina altera o `package-lock.json` (remove metadados `libc`) | A mudança não é commitada, para não gerar conflito |

### 1.3 Endereços de rede entre os componentes

| Origem | URL da API usada | Observação |
|---|---|---|
| Web (servidor Next) | `http://localhost:3001` | Variável `API_URL` (padrão em `web/lib/api.ts`); as chamadas saem do servidor Next, não do navegador |
| Mobile (emulador) | `http://10.0.2.2:3001` | `localhost` do emulador não é o da máquina; padrão da constante `enderecoDaApi` |
| Mobile (dispositivo físico) | `http://<IP do PC na rede>:3001` | `flutter run --dart-define=API_URL=http://<IP>:3001` |

---

## 2. Uso de Inteligência Artificial

### 2.1 Ferramentas utilizadas

| Ferramenta | Versão / Plano | Quem usou | Em que componente |
|---|---|---|---|
| Claude Code | Claude Opus 5.5 | Arthur | mobile, backend (rota do app), documentação |
| _(a preencher)_ | | Othavio | |

### 2.2 Atenção específica desta stack

| Situação | Ocorreu? | Onde e como foi corrigido |
|---|---|---|
| Código gerado com Next.js Pages Router (`getServerSideProps`, `pages/api/`) | _(a preencher pelo responsável web)_ | |
| Prisma sem o adaptador `@prisma/adapter-pg`, ou importando de `@prisma/client` em vez do caminho gerado | Não, no código do app | O service novo usa o `PrismaService` existente, que já importa de `src/generated/prisma` |
| Decorators ou módulos de versão antiga do NestJS | Não | — |
| Pacotes Flutter descontinuados ou incompatíveis com Flutter 3 | Não | Pacote `http` 1.6, mantido pela equipe do Dart |
| Outro | Sim | A primeira versão do cliente HTTP do app não seguia o padrão do laboratório de consumo de API da disciplina (ver 2.3) e foi reescrita |

### 2.3 Evidências de uso

---

#### Etapa 2 — Backend

- **Quem conduziu:** _(a preencher)_
- **Ferramenta e data:** _(a preencher)_
- **Objetivo da tarefa:** _(a preencher)_
- **Prompt utilizado:**
  ```
  (cole aqui o prompt principal)
  ```
- **Trecho aproveitado:**
  ```
  (cole o trecho de codigo gerado que foi usado)
  ```
- **Análise crítica:**
- **A resposta usava versão desatualizada da stack?** Qual:
- **Correções feitas manualmente e por quê:**
- **Evidência no repositório** (commit ou PR):
- **Como validou:**

---

#### Etapa 3 — Cliente web

- **Quem conduziu:** _(a preencher)_
- **Ferramenta e data:** _(a preencher)_
- **Objetivo da tarefa:** _(a preencher)_
- **Prompt utilizado:**
  ```
  (cole aqui o prompt principal)
  ```
- **Trecho aproveitado:**
  ```
  (cole o trecho de codigo gerado que foi usado)
  ```
- **Análise crítica:**
- **A resposta usava versão desatualizada da stack?** Qual:
- **Correções feitas manualmente e por quê:**
- **Evidência no repositório** (commit ou PR):
- **Como validou:**

---

#### Etapa 4 — App mobile

- **Quem conduziu:** Arthur Munhon
- **Ferramenta e data:** Claude Code (Claude Opus 5.5), 23/11/26
- **Objetivo da tarefa:** criar o login simulado do aluno (rota no backend + tela no app) para o app saber de qual aluno puxar o treino, seguindo o passo a passo e os padrões da disciplina.
- **Prompt utilizado:**
  ```
  o mobile n vai ter auth com token e tudo mais, apenas vamos fazer uma tela de login
  falso para saber qual aluno puxar o treino, acredito com um get aluno/id consegue
  fazer isso
  [...]
  vamo fazer isso, mas vai me guiando passo a passo
  [...]
  https://ensino.diegoinacio.com.br/dev-web-mobile/consumo-api-flutter, confere esse
  conteudo se a implementação esta de acordo
  ```
- **Trecho aproveitado** (`mobile/lib/treino_api.dart`):
  ```dart
  try {
    resposta = await _cliente
        .post(base.replace(path: caminho), headers: {...}, body: jsonEncode(corpo))
        .timeout(limite);
  } on TimeoutException {
    throw const TempoEsgotado();
  } on http.ClientException {
    throw const SemConexao();
  }
  if (resposta.statusCode < 200 || resposta.statusCode > 299) {
    throw ErroDaApi(resposta.statusCode, _detalhesDoErro(resposta));
  }
  ```
- **Análise crítica:**
  - A ideia inicial (usar `GET /alunos/:id`) não funcionava: a rota tem `JwtAuthGuard` e filtra pelo personal do token. A IA apontou isso lendo o controller, e a solução foi uma rota pública separada (`POST /app/login`), sem retirar o guard das rotas usadas pelo web.
  - A IA lembrou de usar `select` no Prisma para não devolver a coluna `senha` ao app.
  - A **primeira versão** do cliente HTTP gerada pela IA usava métodos `static`, URL fixa no código, `catch (_)` genérico e `jsonDecode(resposta.body)`. Ao comparar com o material da aula, ela fugia do padrão em seis pontos: classe `XxxApi` com `http.Client` injetável, URL por `String.fromEnvironment`, `sealed class` de falhas, `utf8.decode(bodyBytes)`, `fromJson` com `switch` de padrões e `FormatException`. Foi reescrita seguindo a aula.
  - Risco aceito: o login simulado permite entrar como qualquer aluno sabendo o e-mail. É aceitável porque o professor deixou de exigir token no app.
  - A IA lembrou que o `400` do `class-validator` vem em inglês ("email must be an email"), o que fere a convenção de mensagens em português; o ajuste no DTO ficou pendente.
- **A resposta usava versão desatualizada da stack?** Não. Os problemas foram de padrão da disciplina, não de versão.
- **Correções feitas manualmente e por quê:**
  - `AndroidManifest.xml` ficou com as tags `<manifest>` e depois `<application>` duplicadas ao colar as alterações; o build quebraria. Foi corrigido colando o arquivo inteiro.
  - Arquivos salvos com nome fora do padrão (`login_app.ts`, `login_scren.dart`, controller e service dentro de `dto/`), renomeados e movidos.
  - A chave final da classe `Aluno` foi apagada ao trocar o `fromJson`, e o `flutter analyze` apontou o erro.
- **Evidência no repositório:** `763ad88` (backend), `495b140` (mobile)
- **Como validou:** arquivo `backend/requests/requisicoes.http` com 5 casos (200, normalização do e-mail, 404, 400 de e-mail inválido e de corpo vazio); `tsc --noEmit` no backend; `flutter analyze` sem apontamentos; teste manual no emulador com e-mail existente, inexistente e com o backend desligado.

---

### 2.4 Reflexão sobre o uso de IA

_(a preencher pelo grupo na Etapa 5)_

---

## 3. Diário por etapa

---

### Etapa 0 — Concepção

**Período:** _(a preencher)_ · **Redigido por:** _(a preencher)_

**O que foi feito:** repositório criado a partir do modelo da disciplina (`9066af4`); escolha do tema e da divisão do trabalho.

**Como o tema foi escolhido, e o que foi descartado no caminho:** _(a preencher)_

**Dificuldades:** _(a preencher)_

---

### Etapa 1 — Contrato e fundação

**Período:** _(a preencher)_ · **Redigido por:** _(a preencher)_

**O que foi feito:**

| Frente | O que foi feito | Por quem |
|---|---|---|
| Modelo de dados | Schema Prisma com Personal, Aluno, Exercicio, Ficha, ItemFicha, SessaoTreino e SerieExecutada | Arthur |
| Contrato da API | Versão 1.0 do contrato (12/09/26) | _(a preencher)_ |
| Projeto do backend | Estrutura NestJS e integração do Prisma 7 (`8398cd8`, `3704903`) | Arthur |

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Identificadores uuid | inteiros autoincrementais | Não expõe a quantidade de registros e evita colisão entre ambientes | IDs longos nas URLs |

**Dificuldades:** _(a preencher)_

**O que ficou para a próxima etapa:** _(a preencher)_

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** _(a preencher)_ · **Redigido por:** _(a preencher)_

**O que foi implementado:** CRUDs do MVP e sobrecarga progressiva (`6a8cdc9`); login do personal com JWT, guard e filtro de alunos por personal (`f7ca2c8`, `5cf1dae`, `dd95ebb`, `3506076`); seed (`c2211cc`).

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Login do personal em `/personal/login` e cadastro em `/personal/register` | `POST /auth/login` único para os dois perfis, como no contrato 1.0 | _(a preencher)_ | Contrato precisou ser atualizado (versão 1.2) |
| _(a preencher)_ | | | |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| `POST /auth/login` → `POST /personal/login` + `POST /personal/register` | Rota e formato da resposta (`personal` em vez de `usuario`) | ambos | Sim, na versão 1.2 (23/11/26) |

**Dificuldades:** _(a preencher)_

**O que ficou para a próxima etapa:** guard nas rotas de catálogo, fichas e sessões (ainda pendente — contrato, seção 2.3).

---

### Etapa 3 — Cliente web · Checkpoint 2

**Período:** _(a preencher)_ · **Redigido por:** _(a preencher)_

**O que foi implementado:** _(a preencher pelo responsável web)_

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| _(a preencher)_ | | | |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| `ItemFicha` | Tipo `forca`/`cardio`, campos de cardio e `nomePersonalizado` | ambos | Sim, na versão 1.2 |
| `/solicitacoes` | Novo recurso (listar, aceitar, recusar) | Arthur (revisou após o `pull`) | Sim, na versão 1.2 |
| `Aluno.personalId` | Passa a ser opcional (nulo até ser aceito) | ambos | Sim, na versão 1.2 |
| `GET /fichas`, `DELETE /fichas/:id` | Ordem definida (fichas por criação, itens por `ordem`) para montar a semana; exclusão da ficha leva os itens junto | Arthur (revisou após o `pull`) | Sim, na versão 1.3 |

**Dificuldades:** _(a preencher)_

**O que ficou para a próxima etapa:** _(a preencher)_

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de 12/11/26 a _(em andamento)_ · **Redigido por:** Arthur Munhon

**O que foi implementado:**
- Projeto Flutter, modelos (`Aluno`, `Exercicio`, `Ficha`, `ItemFicha`, `SessaoTreino`) e dados mock (`15eb1dc`, `717fda9`)
- Tela da ficha e registro de treino, ainda com dados mock (`bfa9437`)
- Rota `POST /app/login` no backend (`763ad88`)
- Cliente `TreinoApi`, tela de login e organização em `lib/screens/` e `lib/widgets/` (`495b140`)
- Ficha do aluno logado vinda da API (`GET /fichas?alunoId=`) (`67e71bb`). Por enquanto o app mostra a primeira ficha da lista; com as fichas por dia da semana (RF-033), precisa passar a mostrar a ficha do dia
- Ainda falta: ficha do dia da semana, sessão de treino pela API, histórico, envio de solicitação e testes com `MockClient`

**Decisões técnicas:**

| Decisão | Alternativas consideradas | Justificativa | Risco ou consequência |
|---|---|---|---|
| Login simulado só por e-mail (`POST /app/login`) | `GET /alunos/:id` (protegida e filtrada por personal); lista de alunos para escolher; login real com senha e token | O professor deixou de exigir token no app; digitar e-mail é mais natural que um UUID; não expõe a lista de alunos | Quem souber o e-mail entra como o aluno; sem token, as rotas usadas pelo app recebem `alunoId` explícito |
| Login como `POST` com e-mail no corpo | `GET /app/alunos?email=` | Login é uma ação, não uma consulta; o dado não fica em URL e log; mesmo padrão do `/personal/login` | — |
| Módulo próprio no backend (`AppAlunoModule`) | Tirar o guard do `AlunosController` | Mantém as rotas de escrita do web protegidas | — |
| Cliente HTTP no padrão da aula (`TreinoApi`, falhas `sealed`) | Serviço `static` com exceção genérica | Testável com `MockClient`; mensagem diferente para cada tipo de falha (RNF-008) | Mais código para um login simples, mas é reaproveitado nas próximas chamadas |
| Estado com `setState` e `Aluno` em memória | `shared_preferences`, `ChangeNotifier` | Suficiente para o recorte; a aula proíbe dado pessoal no `shared_preferences` sem necessidade | O aluno faz login de novo a cada abertura do app |

**Mudanças no contrato da API:**

| Endpoint | O que mudou | Quem foi avisado | Contrato atualizado? |
|---|---|---|---|
| `POST /app/login` | Novo endpoint público (login simulado do app) | Othavio | Sim, versão 1.2 |
| Seção 2.4 (sessão no mobile) | Deixa de exigir token no app | Othavio | Sim, versão 1.2 |

**Dificuldades:**
- Erro `type 'Null' is not a subtype of type 'TreinoApi'` ao testar: o hot reload não executa o `main()` de novo, e o `MyApp` antigo, criado sem `api`, continuava na tela. Resolvido parando o app e rodando `flutter run` de novo. Regra aprendida: mudança em `main()` pede hot restart (`R`); mudança no manifest ou no `pubspec` pede reiniciar o `flutter run`.
- Tags duplicadas no `AndroidManifest.xml` ao colar as alterações.
- Ambiente: Docker Desktop fechado e backend sem `node_modules`/`.env` depois do `pull` (seção 1.2).

**O que ficou para a próxima etapa:** consumir fichas e sessões reais; enviar solicitação pelo app (depende de `POST /solicitacoes` e da decisão do RF-064); mensagens de validação em português; testes com `MockClient`.

---

### Etapa 5 — Integração e fechamento

**Período:** _(a preencher)_ · **Redigido por:** _(a preencher)_

**O que foi ajustado para os três componentes conversarem:**

**Inconsistências encontradas entre os clientes, e como foram resolvidas:**

**Dificuldades:**

---

## 4. Arquitetura — decisões e evolução

### 4.1 Estrutura final

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| Backend | Porta 3001 | O Next usa a 3000 |
| Mobile | `lib/treino_api.dart`, `lib/screens/`, `lib/widgets/`, `lib/models/` | Organização do laboratório de consumo de API da disciplina |
| Web | _(a preencher)_ | |

### 4.2 Fronteira entre backend e clientes

A sobrecarga progressiva é calculada só no backend (`POST /sessoes-treino/:id/finalizar`). O app exibe a `cargaSugerida` que recebe e não refaz a conta. A validação do e-mail no login existe nos dois lados: o app recusa campo vazio ou sem `@` para não gastar uma requisição, mas a validação real (`@IsEmail` e a busca no banco) é do backend.

### 4.3 Nível de autenticação adotado no app mobile

| Aspecto | Registro |
|---|---|
| Nível adotado | Simulada |
| Como o app obtém o token | Não obtém. O `POST /app/login` recebe só o e-mail e devolve `{ id, nome, email, personalId }`; o app guarda o `Aluno` em memória |
| O que deixou de ser tratado (expiração, refresh, logout) | Senha, token, expiração, refresh e persistência da sessão; fechar o app desloga |
| Rotas da API afetadas pela escolha | Nenhuma rota protegida foi aberta. Foi criada uma rota pública nova (`POST /app/login`). As rotas que o app usa (`/fichas`, `/sessoes-treino`) já eram públicas e recebem `alunoId` explícito. A exigência de token no app foi retirada pelo professor em aula |

### 4.4 O que os dois clientes compartilham e o que não

- **Formato de erro:** os dois tratam o `message` do NestJS como string ou lista (o web junta com vírgula; o app junta com quebra de linha em `descreverFalha`).
- **Sessão:** divergente por decisão. O web usa token em cookie `httpOnly`, e o app usa login simulado com o `Aluno` em memória.
- **Tempo limite:** o web usa 5s nas chamadas de login; o app usa 10s, como no laboratório da disciplina.
- _(complementar pelo responsável web)_

---

## 5. Resposta ao RFC _(seção condicional)_

**Houve RFC neste projeto?** _( ) Sim — preencher abaixo · (x) Não, até 23/11/26 — seção não aplicável_

> A retirada da exigência de token no app mobile veio como orientação do professor em aula, não como RFC formal; está registrada no contrato (versão 1.2) e no PRD (versão 1.1).

---

## 6. Reflexão final

### 6.1 O que funcionou bem

### 6.2 O que faria diferente

### 6.3 Principais aprendizados

| Componente | Aprendizado |
|---|---|
| Backend | |
| Web | |
| Mobile | |
| Integração e processo | |

### 6.4 Autoavaliação

**Nota:** ___/10

**Justificativa:**

---

## 7. Vídeo de apresentação

| Campo | Valor |
|---|---|
| **Link** | |
| **Duração** | |
| **Quem fala em cada parte** | |

---

## 8. Histórico de revisões

| Versão | Data | Descrição | Quem atualizou |
|---|---|---|---|
| 0.1 | 23/11/26 | Preenche ambiente, uso de IA e diário da Etapa 4, autenticação do mobile e registros das etapas anteriores levantados pelo Git | Arthur Munhon |
| 0.2 | 25/11/26 | Registra a ficha vinda da API no mobile e a mudança de contrato das fichas por dia da semana | Arthur Munhon |
| | | | |
| 1.0 | | Versão final | |
