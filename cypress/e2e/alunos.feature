# language: en
Feature: Gestão de alunos
  Como usuário autenticado
  Quero consultar e manter os alunos
  Para manter os dados cadastrais atualizados

  Background:
    Given que sou usuário autenticado na tela de alunos

  Scenario: Cadastro de aluno bem sucedido
    When cadastro um aluno com dados válidos
    Then o sistema cadastra o aluno e exibe uma mensagem de sucesso
    And o novo aluno passa a ser exibido na lista

  Scenario: Busca de alunos pelo nome
    When busco um aluno existente pelo nome
    Then a lista exibe apenas registros correspondentes ao nome

  Scenario: Busca de alunos pela matrícula
    When busco um aluno existente pela matrícula
    Then a lista exibe apenas registros correspondentes à matrícula

  Scenario: Edição de um aluno existente
    When edito um aluno existente com dados válidos
    Then o sistema atualiza as informações e exibe uma mensagem de sucesso
    And a lista reflete os dados atualizados

  Scenario: Exclusão de um aluno bem sucedida
    When excluo um aluno existente e confirmo a operação
    Then o sistema remove o aluno e exibe uma mensagem de sucesso
    And o aluno não é mais exibido na lista de registros

  Scenario: Logout do sistema
    When clico no botão de sair
    Then sou redirecionado para a tela de acesso à aplicação

  Scenario: Paginação da listagem
    When navego para a próxima página de alunos
    Then a lista exibe a página seguinte

  Scenario: Validação de campos obrigatórios no cadastro
    When tento salvar um aluno sem preencher os campos obrigatórios
    Then o formulário informa que os dados obrigatórios devem ser preenchidos

  Scenario Outline: Validação do formato da matrícula do aluno
    When tento cadastrar um aluno com a matrícula "<matricula>"
    Then o formulário informa que a matrícula deve conter de sete a nove dígitos

    Examples:
      | matricula  |
      | 123456     |
      | abc12345   |

  Scenario: Limite de nove dígitos na matrícula
    When digito uma matrícula com dez dígitos no formulário
    Then o campo de matrícula limita a entrada a nove dígitos

  Scenario: Exibição dos dados principais dos alunos
    Then a listagem apresenta matrícula, nome, data de nascimento e gênero
