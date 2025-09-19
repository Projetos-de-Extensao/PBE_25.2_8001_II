# Casos de Uso - Portal de Monitorias Ibmec

Este documento descreve os principais casos de uso do sistema, detalhando as interações entre os atores e a plataforma.

---

## 1. Criação de Conta de Usuário

* **Atores:**
    * Usuário Visitante (Aluno ou Professor/Coordenador)
    * Sistema
* **Pré-Condições:**
    * Usuário deve possuir um e-mail institucional válido do Ibmec.
* **Fluxo Básico:**
    1.  Usuário acessa a página de cadastro e seleciona o tipo de perfil: **Aluno** ou **Professor/Coordenador**.
    2.  Usuário preenche os campos: Nome Completo, E-mail Institucional, Matrícula (se Aluno), Senha e Confirmação de Senha.
    3.  Sistema valida os dados (formato, domínio `@ibmec.edu.br`, complexidade da senha, se o e-mail já existe).
    4.  Sistema persiste os dados do usuário com um status inicial de "não verificado".
    5.  Sistema envia um e-mail com um link de verificação para o endereço fornecido.
    6.  Usuário abre o e-mail e clica no link de verificação.
    7.  Sistema atualiza o status do usuário para "verificado".
    8.  Sistema exibe uma mensagem de sucesso e redireciona o usuário para a página de Login.
* **Fluxos Alternativos:**
    * **3a. E-mail inválido, fora do domínio Ibmec ou já cadastrado:**
        * 3a1. Sistema exibe uma mensagem de erro específica para cada caso.
    * **3b. Senhas não conferem ou não atendem aos requisitos de segurança:**
        * 3b1. Sistema exibe uma mensagem de erro detalhando os requisitos da senha.
    * **6a. Usuário tenta usar um link de verificação expirado:**
        * 6a1. Sistema informa que o link expirou e oferece a opção de reenviar um novo e-mail de verificação.

---

## 2. Autenticação (Login) no Sistema

* **Atores:**
    * Usuário Cadastrado (Aluno, Monitor, Professor/Coordenador)
    * Sistema
* **Pré-Condições:**
    * Usuário deve possuir um cadastro ativo e verificado na plataforma.
* **Fluxo Básico:**
    1.  Usuário acessa a página de login e fornece seu e-mail institucional e senha.
    2.  Sistema valida as credenciais.
    3.  Sistema cria uma sessão autenticada para o usuário.
    4.  Sistema redireciona o usuário para o seu respectivo Painel Principal (Dashboard).
* **Fluxos Alternativos:**
    * **2a. E-mail ou senha incorretos:**
        * 2a1. Sistema exibe a mensagem "E-mail ou senha incorretos".
    * **2b. Conta não verificada:**
        * 2b1. Sistema exibe a mensagem "Sua conta ainda não foi verificada" e oferece a opção de reenviar o e-mail de verificação.

---

## 3. Candidatar-se a uma Vaga de Monitoria

* **Atores:**
    * Aluno Candidato
    * Sistema
* **Pré-Condições:**
    * Aluno deve estar autenticado no sistema.
    * A vaga de monitoria desejada deve estar com o período de inscrições aberto.
* **Fluxo Básico:**
    1.  Aluno acessa a tela "Buscar Vagas de Monitoria".
    2.  Aluno utiliza a busca e/ou filtros para encontrar uma vaga de seu interesse.
    3.  Aluno clica em uma vaga para visualizar seus detalhes (requisitos, descrição, etc.).
    4.  Aluno clica no botão "Candidatar-se".
    5.  Sistema exibe o formulário de candidatura.
    6.  Aluno preenche os campos necessários (ex: carta de motivação) e anexa documentos (se solicitado).
    7.  Aluno clica em "Enviar Candidatura".
    8.  Sistema valida os dados, processa a candidatura e armazena as informações.
    9.  Sistema define o status da candidatura como "Recebida".
    10. Sistema exibe uma mensagem de sucesso e redireciona o aluno para a tela "Minhas Candidaturas".
* **Fluxos Alternativos:**
    * **4a. Período de inscrições para a vaga já encerrou:**
        * 4a1. O botão "Candidatar-se" não é exibido ou está desabilitado. O sistema exibe uma mensagem "Inscrições encerradas".
    * **7a. Aluno já se candidatou para esta vaga:**
        * 7a1. Sistema exibe a mensagem "Você já se candidatou para esta vaga" e impede um novo envio.
    * **8a. Falha no envio do formulário (ex: campo obrigatório não preenchido):**
        * 8a1. Sistema exibe uma mensagem de erro indicando o campo que precisa de correção.

---

## 4. Publicar e Gerenciar Vaga de Monitoria

* **Atores:**
    * Professor/Coordenador
    * Sistema
* **Pré-Condições:**
    * Professor/Coordenador deve estar autenticado no sistema.
* **Fluxo Básico (Publicar Vaga):**
    1.  Professor/Coordenador acessa seu painel e seleciona a opção "Criar Nova Vaga".
    2.  Professor/Coordenador preenche o formulário da vaga com todas as informações: disciplina, requisitos, número de vagas, descrição das atividades, prazo de inscrição.
    3.  Professor/Coordenador clica em "Publicar Vaga".
    4.  Sistema valida os dados do formulário.
    5.  Sistema armazena as informações e torna a vaga visível para todos os alunos na tela de busca.
    6.  Sistema exibe uma mensagem de sucesso.
* **Fluxo Básico (Gerenciar Vaga):**
    1.  Professor/Coordenador acessa a lista de vagas criadas por ele.
    2.  Professor/Coordenador seleciona uma vaga e escolhe uma ação: "Editar", "Pausar Inscrições" ou "Encerrar".
    3.  Sistema executa a ação solicitada e atualiza o status da vaga.
* **Fluxos Alternativos:**
    * **4a. Formulário de criação de vaga com campos obrigatórios em branco:**
        * 4a1. Sistema exibe uma mensagem de erro, destacando os campos que precisam ser preenchidos.
    * **2b. Professor/Coordenador tenta editar uma vaga após o início das inscrições:**
        * 2b1. Sistema pode limitar os campos que podem ser editados (ex: não permitir alterar requisitos essenciais) e exibir um aviso.

---

## 5. Analisar e Selecionar Candidatos

* **Atores:**
    * Professor/Coordenador
    * Sistema
    * Aluno Candidato
* **Pré-Condições:**
    * Professor/Coordenador deve estar autenticado.
    * Deve existir pelo menos uma candidatura para a vaga em análise.
* **Fluxo Básico:**
    1.  Professor/Coordenador acessa o painel de gerenciamento de uma vaga específica.
    2.  Professor/Coordenador clica na opção "Ver Candidatos".
    3.  Sistema exibe a lista de todos os alunos que se candidataram.
    4.  Professor/Coordenador analisa o perfil e as informações de cada candidato.
    5.  Professor/Coordenador altera o status de um candidato para "Aprovado" ou "Rejeitado".
    6.  Sistema atualiza o status da candidatura.
    7.  Sistema envia uma notificação (via e-mail ou na plataforma) para o Aluno Candidato informando sobre a atualização de seu status.
* **Fluxos Alternativos:**
    * **5a. Professor/Coordenador tenta aprovar mais candidatos que o número de vagas disponíveis:**
        * 5a1. Sistema exibe uma mensagem de aviso: "O número de candidatos aprovados excede o número de vagas. Deseja continuar?".

---

## 6. Agendar Sessão com um Monitor

* **Atores:**
    * Aluno Consumidor
    * Sistema
* **Pré-Condições:**
    * Aluno deve estar autenticado.
    * O Monitor desejado deve ter configurado horários disponíveis em sua agenda.
* **Fluxo Básico:**
    1.  Aluno acessa a área "Buscar Ajuda de um Monitor" e encontra o monitor desejado.
    2.  Aluno visualiza o perfil do monitor, incluindo sua agenda com os horários disponíveis.
    3.  Aluno clica em um horário vago.
    4.  Sistema exibe uma tela de confirmação com os detalhes do agendamento.
    5.  Aluno confirma o agendamento.
    6.  Sistema reserva o horário na agenda do monitor, tornando-o indisponível para outros alunos.
    7.  Sistema adiciona o compromisso na área "Meus Agendamentos" do aluno.
    8.  Sistema notifica o Monitor sobre o novo agendamento.
* **Fluxos Alternativos:**
    * **3a. Outro aluno agenda o mesmo horário milissegundos antes:**
        * 3a1. Ao tentar confirmar, o Sistema informa que o horário selecionado não está mais disponível e pede para o aluno escolher outro.

---

## 7. Gerenciar Agenda de Disponibilidade

* **Atores:**
    * Monitor
    * Sistema
* **Pré-Condições:**
    * Usuário deve ter o perfil de Monitor e estar autenticado.
* **Fluxo Básico:**
    1.  Monitor acessa seu painel e seleciona a opção "Gerenciar Minha Agenda".
    2.  Sistema exibe uma interface de calendário.
    3.  Monitor seleciona dias e horários para adicionar ou remover blocos de disponibilidade.
    4.  Monitor salva as alterações.
    5.  Sistema atualiza a agenda pública do monitor, refletindo a nova disponibilidade para os alunos consumidores.
* **Fluxos Alternativos:**
    * **3a. Monitor tenta remover um bloco de horário que já possui um agendamento confirmado:**
        * 3a1. Sistema impede a remoção e exibe uma mensagem: "Você não pode remover este horário, pois já existe um agendamento. Cancele o agendamento primeiro."
