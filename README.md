# Desafio técnico — Analista de Teste e Qualidade

Este repositório reúne uma suíte de testes automatizados de ponta a ponta para a aplicação de autenticação e gestão de alunos proposta no desafio. Os cenários foram escritos em Gherkin, em português, e são executados com Cypress e Cucumber.

## Aplicação e regras cobertas

A aplicação está disponível em [desafio-qa-gamma.vercel.app](https://desafio-qa-gamma.vercel.app/). O acesso de teste informado no desafio é matrícula `2620101` e senha `12345678`.

A especificação define as seguintes regras:

- A matrícula de acesso aceita apenas números e deve ter de 7 a 9 caracteres.
- A senha aceita apenas números e deve ter exatamente 8 caracteres.
- A listagem de alunos deve apresentar matrícula, nome, data de nascimento e gênero, com busca e paginação.
- No cadastro de aluno, a matrícula deve ter de 7 a 9 dígitos; nome e data de nascimento são obrigatórios.
- Mensagens de validação e avisos de sucesso ao cadastrar, editar ou excluir devem ser conferidos nos testes.

## Cenários automatizados

Os arquivos `.feature` em `cypress/e2e` incluem os cenários propostos no desafio e casos complementares para ampliar a cobertura:

- Login válido, credenciais inválidas ou em branco e formatos inválidos de matrícula e senha.
- Cadastro de aluno, busca por nome e matrícula, edição e exclusão com confirmação.
- Logout e navegação entre páginas da listagem.
- Validação dos campos obrigatórios e do formato e limite de tamanho da matrícula.
- Verificação das colunas principais exibidas na listagem.

Os passos compartilhados ficam em `cypress/e2e/steps`. As verificações de cadastro, edição e exclusão incluem as mensagens de sucesso, além da atualização correspondente na lista.

## Requisitos

- Node.js 20 ou superior.
- npm.
- Acesso à aplicação remota para executar os testes de ponta a ponta.

## Instalação e execução

Na raiz do projeto, instale as dependências:

```bash
npm ci
```

Execute a suíte no terminal:

```bash
npm run cy:run
```

Para abrir a interface interativa do Cypress:

```bash
npm run cy:open
```

No PowerShell, se a política de execução impedir o uso de `npm`, use `npm.cmd`. Caso o Cypress apresente `bad option: --smoke-test` ao iniciar, remova a variável que faz o Electron iniciar como Node e execute novamente:

```powershell
$env:ELECTRON_RUN_AS_NODE = $null
npm.cmd run cy:run
```

## Organização e decisões

A configuração do Cypress está em `cypress.config.js`, e os cenários seguem a estrutura de diretórios do Cypress. Os registros criados durante a execução usam uma matrícula derivada do horário para reduzir colisões com dados existentes no ambiente remoto.

A aplicação é externa ao repositório e não há uma API local ou código-fonte disponível para preparar os dados. Por isso, os testes de listagem e CRUD dependem da disponibilidade do ambiente e dos dados encontrados nele. O acesso à rede também pode depender das configurações do ambiente em que a suíte for executada.

A regra do desafio exige uma senha numérica com exatamente oito caracteres. A suíte inclui a verificação do limite de formato com nove dígitos; no ambiente observado, a aplicação aceita esse valor, em desacordo com a especificação. Esse caso fica documentado como uma divergência entre o comportamento atual da aplicação e o requisito.
