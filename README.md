# Desafio técnico — Analista de Teste e Qualidade

Suíte de testes end-to-end em Cypress para a aplicação de autenticação e gestão de alunos indicada no desafio.

## Requisitos

- Node.js 20 ou superior
- npm
- Acesso à aplicação `https://desafio-qa-gamma.vercel.app/`

## Instalação e execução

```bash
npm ci
npm run cy:run
```

Para executar em modo interativo:

```bash
npm run cy:open
```

No PowerShell, se `npm` estiver bloqueado pela política de execução, use `npm.cmd`. Se o Cypress não iniciar e mostrar `bad option: --smoke-test`, remova a variável que força o Electron a iniciar como Node:

```powershell
$env:ELECTRON_RUN_AS_NODE = $null
npm.cmd run cy:run
```

## Cobertura

Os arquivos `.feature` em `cypress/e2e` cobrem login válido e inválido, formato das credenciais, cadastro, busca por nome e matrícula, edição, exclusão com confirmação, logout, paginação, dados exibidos e validações do formulário. Os cenários seguem Gherkin em português e compartilham os passos de `cypress/e2e/steps`.

As credenciais de teste válidas foram fornecidas no documento do desafio. Registros criados usam matrícula derivada do horário de execução para reduzir colisões. Os testes assumem os rótulos e mensagens visíveis descritos no desafio; os seletores devem ser ajustados caso a aplicação use textos diferentes.

## Decisões e limitações

- A aplicação é externa e não há código-fonte ou API local para preparar dados de teste.
- Os testes de CRUD operam sobre a interface e dependem da disponibilidade e dos dados atuais do ambiente remoto.
- O acesso de rede ao domínio da aplicação pode exigir liberação nas configurações do ambiente.
- A especificação exige senha numérica com exatamente oito caracteres. O cenário de senha com nove dígitos permanece na suíte porque a aplicação remota atualmente a aceita; esse cenário falha e registra a divergência com a regra do desafio.
