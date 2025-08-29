# Casos de Uso

## Criação de uma conta no sistema

* **Atores:**
    * Usuário (Visitante)
    * Sistema

* **Pré-Condições:**
    * (Regra de Negócio) Usuário deve possuir um e-mail institucional válido da própria IBMEC.

* **Fluxo Básico:**
    1.  Usuário acessa a página de cadastro e seleciona o tipo de perfil: **Candidato (Aluno)** ou **Empregador (Professor/Departamento)**.
    2.  Usuário fornece nome, e-mail (obrigatoriamente do Ibmec), senha e confirmação de senha.
    3.  Dados do Usuário são validados pelo Sistema (formato, complexidade da senha, domínio Ibmec).
    4.  Dados do Usuário são encriptados pelo Sistema.
    5.  Dados do Usuário são persistidos pelo Sistema com um status inicial de "não verificado".
    6.  Sistema gera um link de verificação com prazo de expiração.
    7.  Sistema envia e-mail de verificação, com o link, para o Usuário.
    8.  Usuário clica no link de confirmação antes de expirar.
    9.  Sistema atualiza o status do Usuário para "verificado".
    10. Sistema exibe mensagem de sucesso e redireciona o Usuário para a página de Entrada (Login).

* **Fluxos Alternativos:**
    * **3a. E-mail do Usuário possui formato inválido ou já está em uso**
        * 3a1. Sistema exibe mensagem de erro específica ("Formato de e-mail inválido" ou "E-mail já cadastrado").
    * **3b. Senha do Usuário não respeita as regras de segurança**
        * 3b1. Sistema exibe mensagem de erro detalhando os requisitos da senha.
    * **3c. E-mail não pertence ao domínio do Ibmec**
        * 3c1. Sistema exibe mensagem de erro: "Cadastro permitido apenas com e-mail institucional do Ibmec."
    * **8a. Usuário tenta confirmar o e-mail depois de o link expirar**
        * 8a1. Sistema informa que o link expirou e oferece a opção de reenviar um novo e-mail de verificação.
    * **1a. Usuário seleciona o perfil "Empregador"**
        * 1a1. (Recomendado) Após o passo 10, o Sistema pode informar ao Empregador que seu cadastro foi recebido e passará por uma aprovação administrativa para garantir sua legitimidade. O perfil fica com o status "pendente de aprovação".

---

## Entrada do usuário no sistema

* **Atores:**
    * Usuário (Candidato ou Empregador)
    * Sistema

* **Pré-Condições:**
    * Usuário deve possuir um cadastro ativo e **verificado** na plataforma.

* **Fluxo Básico:**
    1.  Usuário fornece seu e-mail e senha na página de entrada.
    2.  Sistema valida as credenciais (compara e-mail e hash da senha).
    3.  Sistema autentica o Usuário e cria uma sessão.
    4.  Sistema redireciona o Usuário para sua página principal (Dashboard):
        * Se **Candidato**, redireciona para a página de busca de vagas.
        * Se **Empregador**, redireciona para o painel de gerenciamento de suas vagas.

* **Fluxos Alternativos:**
    * **2a. E-mail ou senha inválidos**
        * 2a1. Sistema exibe mensagem "E-mail ou senha incorretos".
    * **2b. Conta do Usuário não foi verificada por e-mail**
        * 2b1. Sistema exibe mensagem informando que a conta precisa ser ativada e oferece a opção de reenviar o e-mail de verificação.
    * **2c. Cadastro do Empregador está "pendente de aprovação"**
        * 2c1. Sistema autentica, mas exibe uma página informando que o cadastro ainda está em análise pela administração, não permitindo acesso ao dashboard principal.
    * **4a. Primeiro acesso do Usuário após o cadastro**
        * 4a1. Sistema redireciona o Usuário para a página de "Complete seu Perfil", incentivando-o a preencher suas informações.
