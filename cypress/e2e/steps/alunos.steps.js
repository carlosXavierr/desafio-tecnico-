const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

const appUrl = "https://desafio-qa-gamma.vercel.app";
const uniqueId = () => `${Date.now()}`.slice(-8);

function visibleField(index) {
  return cy.get("input:visible, textarea:visible, select:visible").eq(index);
}

function fillStudentForm({ registration, name, birthDate }) {
  visibleField(0).clear().type(registration);
  visibleField(1).clear().type(name);
  visibleField(2).clear().type(birthDate);
  visibleField(3).select("Masculino");
}

function submitStudentForm() {
  cy.contains("button:visible", /salvar|cadastrar/i).click();
}

function successMessage() {
  cy.get("#toast").invoke("text").should("match", /sucesso|cadastrado|atualizado|exclu[ií]do/i);
}

function openStudentForm() {
  cy.get("body").then(($body) => {
    const visibleRegistration = $body
      .find("input#matricula:visible")
      .filter((_, input) => /aluno/i.test(input.placeholder || ""));
    if (!visibleRegistration.length) cy.get("#add-student-button:visible").click();
  });
}

Given("que estou na tela de login da aplicação", () => {
  cy.visit(appUrl);
});

Given("que sou usuário autenticado na tela de alunos", () => {
  cy.visit(appUrl);
  visibleField(0).clear().type("2620101");
  visibleField(1).clear().type("12345678");
  cy.contains("button", /acessar|entrar|login/i).click();
  cy.get("#students-table-body").should("be.visible");
});

When("informo a matrícula {string}", (registration) => {
  visibleField(0).clear();
  if (registration) visibleField(0).type(registration);
});

When("informo a senha {string}", (password) => {
  visibleField(1).clear();
  if (password) visibleField(1).type(password);
});

When("clico no botão de acessar", () => {
  cy.contains("button", /acessar|entrar|login/i).click();
});

Then("sou redirecionado para a tela de listagem de alunos", () => {
  cy.get("#students-table-body").should("be.visible");
});

Then("o sistema exibe uma mensagem de erro correspondente", () => {
  cy.get("input:visible").then(($inputs) => {
    const formInvalid = $inputs.toArray().some((input) => !input.checkValidity());
    if (!formInvalid) {
      cy.contains(/inválid|incorret|erro|obrigatóri|preench|credencial|ops!|verifique|informe/i).should("be.visible");
    }
  });
});

Then("permaneço na tela de login", () => {
  cy.contains("button:visible", /acessar|entrar|login/i).should("be.visible");
});

Then("o formulário impede o envio dos dados fora do formato aceito", () => {
  cy.contains("button:visible", /acessar|entrar|login/i).should("be.visible");
  cy.contains(/inválid|incorret|erro|obrigatóri|preench|formato|dígito|ops!|verifique/i).should("be.visible");
});

When("cadastro um aluno com dados válidos", () => {
  openStudentForm();
  const registration = uniqueId();
  const student = { registration, name: `Aluno Cypress ${registration}`, birthDate: "2000-05-20" };
  cy.wrap(student).as("student");
  fillStudentForm(student);
  submitStudentForm();
});

Then("o sistema cadastra o aluno e exibe uma mensagem de sucesso", () => successMessage());

Then("o novo aluno passa a ser exibido na lista", () => {
  cy.get("@student").then(({ registration, name }) => {
    cy.contains(new RegExp(`${registration}|${name}`)).should("be.visible");
  });
});

When("busco um aluno existente pelo nome", () => {
  cy.get("tbody tr").first().find("td").eq(1).invoke("text").then((name) => {
    const query = name.trim();
    expect(query, "nome de um aluno existente").not.to.equal("");
    cy.wrap(query).as("searchedName");
    cy.get("input").then(($inputs) => {
      const search = $inputs.toArray().find((input) => /buscar|pesquisar|nome/i.test(`${input.placeholder} ${input.getAttribute("aria-label") || ""}`)) || $inputs[$inputs.length - 1];
      cy.wrap(search).clear().type(query);
    });
  });
});

Then("a lista exibe apenas registros correspondentes ao nome", () => {
  cy.get("@searchedName").then((name) => cy.get("tbody tr").should("have.length.greaterThan", 0).each(($row) => {
    expect($row.text().toLowerCase()).to.include(name.toLowerCase());
  }));
});

When("busco um aluno existente pela matrícula", () => {
  cy.get("tbody tr").first().find("td").first().invoke("text").then((registration) => {
    const query = registration.trim();
    expect(query, "matrícula de um aluno existente").not.to.equal("");
    cy.wrap(query).as("searchedRegistration");
    cy.get("input").then(($inputs) => {
      const search = $inputs.toArray().find((input) => /buscar|pesquisar/i.test(`${input.placeholder} ${input.getAttribute("aria-label") || ""}`)) || $inputs[$inputs.length - 1];
      cy.wrap(search).clear().type(query);
    });
  });
});

Then("a lista exibe apenas registros correspondentes à matrícula", () => {
  cy.get("@searchedRegistration").then((registration) => cy.get("tbody tr").should("have.length.greaterThan", 0).each(($row) => {
    expect($row.text()).to.include(registration);
  }));
});

When("edito um aluno existente com dados válidos", () => {
  cy.get("tbody tr").first().as("originalRow");
  cy.get("@originalRow").find("button").first().click();
  const name = `Aluno Editado ${uniqueId()}`;
  cy.wrap(name).as("editedName");
  visibleField(1).clear().type(name);
  submitStudentForm();
});

Then("o sistema atualiza as informações e exibe uma mensagem de sucesso", () => successMessage());

Then("a lista reflete os dados atualizados", () => {
  cy.get("@editedName").then((name) => cy.contains(name).should("be.visible"));
});

When("excluo um aluno existente e confirmo a operação", () => {
  openStudentForm();
  const registration = uniqueId();
  fillStudentForm({
    registration,
    name: `Aluno para excluir ${registration}`,
    birthDate: "2000-05-20",
  });
  submitStudentForm();
  cy.contains("tbody tr", registration).should("be.visible").as("targetRow");
  cy.wrap(registration).as("deletedStudentRegistration");
  cy.on("window:confirm", (message) => {
    expect(message).to.match(/excluir|remover|confirmar/i);
    return true;
  });
  cy.get("@targetRow").find("button").last().click();
  cy.get("body").then(($body) => {
    const $confirmButton = $body.find("button").filter((_, button) => /confirmar|excluir|remover|sim/i.test(button.innerText));
    if ($confirmButton.length) cy.wrap($confirmButton.last()).click();
  });
});

Then("o sistema remove o aluno e exibe uma mensagem de sucesso", () => successMessage());

Then("o aluno não é mais exibido na lista de registros", () => {
  cy.get("@deletedStudentRegistration").then((registration) => {
    cy.get("tbody").should("not.contain", registration);
  });
});

When("clico no botão de sair", () => {
  cy.contains("button, a", /sair|logout/i).click();
});

Then("sou redirecionado para a tela de acesso à aplicação", () => {
  cy.location("pathname").should("match", /login|acesso|\/$/i);
  cy.contains("button", /acessar|entrar|login/i).should("be.visible");
});

When("navego para a próxima página de alunos", () => {
  cy.get("tbody tr").then(($rows) => {
    const firstPage = $rows.first().text();
    cy.wrap(firstPage).as("firstPageFirstRow");
  });
  cy.contains("button, a", /próxima|next|›|❯/i).click();
});

Then("a lista exibe a página seguinte", () => {
  cy.get("tbody tr").should("have.length.greaterThan", 0);
  cy.get("@firstPageFirstRow").then((previous) => cy.get("tbody").should("not.contain", previous));
});

When("tento salvar um aluno sem preencher os campos obrigatórios", () => {
  openStudentForm();
  submitStudentForm();
});

Then("o formulário informa que os dados obrigatórios devem ser preenchidos", () => {
  [
    /informe a matrícula/i,
    /informe o nome/i,
    /informe a data de nascimento/i,
    /selecione o gênero/i,
  ].forEach((message) => cy.contains(message).should("be.visible"));
});

When("tento cadastrar um aluno com a matrícula {string}", (registration) => {
  openStudentForm();
  const student = { registration, name: `Aluno Cypress ${uniqueId()}`, birthDate: "2000-05-20" };
  fillStudentForm(student);
  submitStudentForm();
});

Then("o formulário informa que a matrícula deve conter de sete a nove dígitos", () => {
  visibleField(0).then(($field) => {
    const validityFailed = !$field[0].checkValidity();
    if (!validityFailed) {
      cy.contains(/matr[ií]cula.{0,60}(inv[aá]lid|entre|7\s*(a|e)\s*9|d[ií]gito|n[uú]mero|obrigat)|apenas n[uú]meros|somente n[uú]meros/i).should("be.visible");
    }
  });
});

Then("a listagem apresenta matrícula, nome, data de nascimento e gênero", () => {
  [
    /matr[ií]cula/i,
    /nome/i,
    /nascimento|data/i,
    /g[eê]nero|sexo/i,
  ].forEach((heading) => cy.get("thead").contains(heading).should("be.visible"));
});

When("digito uma matrícula com dez dígitos no formulário", () => {
  openStudentForm();
  visibleField(0).clear().type("1234567890");
});

Then("o campo de matrícula limita a entrada a nove dígitos", () => {
  visibleField(0).should("have.value", "123456789");
});
