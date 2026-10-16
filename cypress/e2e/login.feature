# language: pt
Funcionalidade: Autenticação
  Como usuário do sistema
  Quero entrar com minhas credenciais
  Para acessar a gestão de alunos

  Cenário: Login bem sucedido
    Dado que estou na tela de login da aplicação
    Quando informo a matrícula "2620101"
    E informo a senha "12345678"
    E clico no botão de acessar
    Então sou redirecionado para a tela de listagem de alunos

  Esquema do Cenário: Login mal sucedido
    Dado que estou na tela de login da aplicação
    Quando informo a matrícula "<matricula>"
    E informo a senha "<senha>"
    E clico no botão de acessar
    Então o sistema exibe uma mensagem de erro correspondente
    E permaneço na tela de login

    Exemplos:
      | matricula | senha    |
      | 1111111   | 12345678 |
      | 2620101   | 87654321 |
      |           |          |

  Esquema do Cenário: Rejeição de credenciais fora das regras de formato
    Dado que estou na tela de login da aplicação
    Quando informo a matrícula "<matricula>"
    E informo a senha "<senha>"
    E clico no botão de acessar
    Então o formulário impede o envio dos dados fora do formato aceito

    Exemplos:
      | matricula | senha    |
      | 123456    | 12345678 |
      | 1234567890| 12345678 |
      | abc12345  | 12345678 |
      | 2620101   | 1234567  |
      | 2620101   | 123456789|
      | 2620101   | senha123 |
