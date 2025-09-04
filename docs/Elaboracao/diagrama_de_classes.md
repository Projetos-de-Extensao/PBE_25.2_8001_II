---
id: diagrama_de_casos_de_uso_monitoria
title: Diagrama de Casos de Uso - Gestão de Monitoria
---

## Casos de Uso

### Descrição:

- **Contas**
    - Criação
    - Entrada (Login)
    - Alteração de Dados
    - Recuperar Senha
    - Exclusão Lógica

- **Perfis (Aluno, Professor, Monitor)**
    - Edição (Completar informações, currículo, etc.)
    - Visualização

- **Vagas de Monitoria (Público)** 
	- Criação (Professor)
    - Edição (Professor)
    - Visualização (Todos)
    - Encerramento (Professor)

- **Candidaturas (Privado)**
    - Inscrição em Vaga (Aluno)
    - Visualização de Status (Aluno)
    - Gerenciamento de Candidatos (Professor)
    - Cancelamento de Inscrição (Aluno)

- **Gerenciamento de Monitoria (Restrito)**
    - Definição de Horários (Monitor)
    - Registro de Frequência de Alunos (Monitor)
    - Consulta de Horários (Aluno)

### Criação de uma conta no sistema

* **Atores**:
    * Visitante (Aluno ou Professor do Ibmec)
    * Sistema

* **Pré-Condições**:
    * Visitante deve possuir um e-mail institucional válido do Ibmec (dominio @ibmec).

* **Fluxo Básico**:
    1.  Visitante acessa a página de cadastro.
    2.  Visitante fornece nome, e-mail institucional, senha, confirmação de senha e seleciona o tipo de perfil (Aluno ou Professor).
    3.  Dados são validados pelo Sistema (formato, domínio Ibmec obrigatório, complexidade da senha).
    4.  Senha do Visitante é encriptada pelo Sistema.
    5.  Dados do Visitante são persistidos pelo Sistema com status "não verificado".
    6.  Sistema gera um link de verificação com prazo de expiração.
    7.  Sistema envia e-mail de verificação, com o link, para o Visitante.
    8.  Visitante clica no link de confirmação antes de expirar.
    9.  Sistema atualiza o status da conta para "verificado".
    10. Sistema exibe mensagem de sucesso e redireciona o Visitante para a página de Entrada (Login).

* **Fluxos Alternativos**:
    * **3a. E-mail não pertence ao domínio do Ibmec**
        * 3a1. Sistema exibe a mensagem de erro: "Cadastro permitido apenas com e-mail institucional do Ibmec."
    * **3b. E-mail inválido ou já cadastrado**
        * 3b1. Sistema exibe mensagem de erro específica.
    * **3c. Senha não respeita as regras de segurança**
        * 3c1. Sistema exibe os requisitos de senha não atendidos.
    * **8a. Visitante tenta confirmar o e-mail depois de o link expirar**
        * 8a1. Sistema informa que o link expirou e oferece a opção de reenviar um novo e-mail de verificação.

### Entrada do usuário no sistema

* **Atores**:
    * Usuário (Aluno, Professor, Monitor)
    * Sistema

* **Pré-Condições**:
    * Usuário deve possuir um cadastro ativo e **verificado** na plataforma.

* **Fluxo Básico**:
    1.  Usuário fornece seu e-mail institucional e senha na página de entrada.
    2.  Sistema valida as credenciais (compara e-mail e hash da senha).
    3.  Sistema autentica o Usuário, cria uma sessão e identifica seu perfil.
    4.  Sistema redireciona o Usuário para o seu painel de controle principal (Dashboard do Aluno ou Dashboard do Professor).

* **Fluxos Alternativos**:
    * **2a. E-mail ou senha inválidos**
        * 2a1. Sistema exibe a mensagem "E-mail ou senha incorretos".
    * **2b. Conta do Usuário não foi verificada por e-mail**
        * 2b1. Sistema exibe mensagem informando que a conta precisa ser ativada e oferece a opção de reenviar o e-mail de verificação.
    * **4a. Primeiro acesso do Usuário após o cadastro**
        * 4a1. Sistema redireciona o Usuário para a página de "Complete seu Perfil", incentivando-o a preencher suas informações.
