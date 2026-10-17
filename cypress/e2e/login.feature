# language: en
Feature: Autenticação
  Como usuário do sistema
  Quero entrar com minhas credenciais
  Para acessar a gestão de alunos

  Scenario: Login bem sucedido
    Given que estou na tela de login da aplicação
    When informo a matrícula "2620101"
    And informo a senha "12345678"
    And clico no botão de acessar
    Then sou redirecionado para a tela de listagem de alunos

  Scenario Outline: Login mal sucedido
    Given que estou na tela de login da aplicação
    When informo a matrícula "<matricula>"
    And informo a senha "<senha>"
    And clico no botão de acessar
    Then o sistema exibe uma mensagem de erro correspondente
    And permaneço na tela de login

    Examples:
      | matricula | senha    |
      | 1111111   | 12345678 |
      | 2620101   | 87654321 |
      |           |          |

  Scenario Outline: Rejeição de credenciais fora das regras de formato
    Given que estou na tela de login da aplicação
    When informo a matrícula "<matricula>"
    And informo a senha "<senha>"
    And clico no botão de acessar
    Then o formulário impede o envio dos dados fora do formato aceito

    Examples:
      | matricula | senha    |
      | 123456    | 12345678 |
      | 1234567890| 12345678 |
      | abc12345  | 12345678 |
      | 2620101   | 1234567  |
      | 2620101   | 123456789|
      | 2620101   | senha123 |

  Scenario Outline: Validar visualmente campos obrigatórios no login
    Given que estou na tela de login da aplicação
    When informo a matrícula "<matricula>"
    And informo a senha "<senha>"
    And clico no botão de acessar
    Then o sistema exibe uma mensagem de erro correspondente
    And permaneço na tela de login

    Examples:
      | matricula | senha    |
      |           | 12345678 |
      | 2620101   |          |
