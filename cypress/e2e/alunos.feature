# language: pt
Funcionalidade: Gestão de alunos
  Como usuário autenticado
  Quero consultar e manter os alunos
  Para manter os dados cadastrais atualizados

  Contexto:
    Dado que sou usuário autenticado na tela de alunos

  Cenário: Cadastro de aluno bem sucedido
    Quando cadastro um aluno com dados válidos
    Então o sistema cadastra o aluno e exibe uma mensagem de sucesso
    E o novo aluno passa a ser exibido na lista

  Cenário: Busca de alunos pelo nome
    Quando busco um aluno existente pelo nome
    Então a lista exibe apenas registros correspondentes ao nome

  Cenário: Busca de alunos pela matrícula
    Quando busco um aluno existente pela matrícula
    Então a lista exibe apenas registros correspondentes à matrícula

  Cenário: Edição de um aluno existente
    Quando edito um aluno existente com dados válidos
    Então o sistema atualiza as informações e exibe uma mensagem de sucesso
    E a lista reflete os dados atualizados

  Cenário: Exclusão de um aluno bem sucedida
    Quando excluo um aluno existente e confirmo a operação
    Então o sistema remove o aluno e exibe uma mensagem de sucesso
    E o aluno não é mais exibido na lista de registros

  Cenário: Logout do sistema
    Quando clico no botão de sair
    Então sou redirecionado para a tela de acesso à aplicação

  Cenário: Paginação da listagem
    Quando navego para a próxima página de alunos
    Então a lista exibe a página seguinte

  Cenário: Validação de campos obrigatórios no cadastro
    Quando tento salvar um aluno sem preencher os campos obrigatórios
    Então o formulário informa que os dados obrigatórios devem ser preenchidos

  Esquema do Cenário: Validação do formato da matrícula do aluno
    Quando tento cadastrar um aluno com a matrícula "<matricula>"
    Então o formulário informa que a matrícula deve conter de sete a nove dígitos

    Exemplos:
      | matricula  |
      | 123456     |
      | abc12345   |

  Cenário: Limite de nove dígitos na matrícula
    Quando digito uma matrícula com dez dígitos no formulário
    Então o campo de matrícula limita a entrada a nove dígitos

  Cenário: Exibição dos dados principais dos alunos
    Então a listagem apresenta matrícula, nome, data de nascimento e gênero
