
# Casos de Uso - Portal de Monitorias Ibmec (Atualizado Nov/2025)

Este documento reflete o sistema após as principais mudanças:
- Landing page pública (vagas abertas visíveis sem login)
- Fluxo de aprovação: professor avalia primeiro, coordenador só aprova após parecer do professor
- Disciplinas com criação livre e código manual
- Remoção de satisfação, relatórios, agendamento e métricas extras
- UI simplificada

---

## 1. Criação de Conta de Usuário

* **Atores:**
    * Usuário Visitante (Aluno, Professor ou Coordenador)
    * Sistema
* **Pré-Condições:**
    * Usuário deve possuir um e-mail institucional válido do Ibmec.
* **Fluxo Básico:**
    1.  Usuário acessa a página de cadastro e seleciona o tipo de perfil: **Aluno**, **Professor** ou **Coordenador**.
    2.  Usuário preenche os campos obrigatórios.
    3.  Sistema valida os dados e cria o usuário.
    4.  Sistema envia e-mail de verificação.
    5.  Usuário confirma o e-mail e pode acessar o sistema.

---

## 2. Autenticação (Login) no Sistema

* **Atores:**
    * Usuário Cadastrado (Aluno, Monitor, Professor, Coordenador)
    * Sistema
* **Pré-Condições:**
    * Usuário deve possuir cadastro ativo e verificado.
* **Fluxo Básico:**
    1.  Usuário acessa a página de login e fornece e-mail institucional e senha.
    2.  Sistema valida as credenciais e autentica o usuário.
    3.  Usuário é redirecionado para seu painel principal.

---

## 3. Visualizar Vagas de Monitoria (Landing Pública)

* **Atores:**
    * Visitante (não autenticado)
    * Aluno
    * Sistema
* **Fluxo Básico:**
    1.  Visitante acessa a landing page.
    2.  Sistema exibe todas as vagas abertas de monitoria.
    3.  Visitante pode filtrar e visualizar detalhes das vagas.
    4.  Para se candidatar, é necessário login.

---

## 4. Candidatar-se a uma Vaga de Monitoria

* **Atores:**
    * Aluno
    * Sistema
* **Pré-Condições:**
    * Aluno autenticado
    * Vaga aberta
* **Fluxo Básico:**
    1.  Aluno acessa a tela de vagas e escolhe uma vaga aberta.
    2.  Aluno preenche a carta de motivação e envia candidatura.
    3.  Sistema armazena a candidatura com status "pendente".
    4.  Aluno pode acompanhar o status em "Minhas Candidaturas".

---

## 5. Aprovação de Candidatura (Novo Fluxo)

* **Atores:**
    * Professor responsável pela vaga
    * Coordenador
    * Sistema
* **Pré-Condições:**
    * Candidatura pendente
* **Fluxo Básico:**
    1.  Professor avalia a candidatura (aprovado, lista de espera ou rejeitado).
    2.  Só após o parecer do professor, o coordenador pode aprovar ou rejeitar.
    3.  Se aprovado pelo coordenador, aluno vira monitor.
    4.  Sistema notifica o aluno.

---

## 6. Gerenciar Disciplinas

* **Atores:**
    * Coordenador
    * Sistema
* **Fluxo Básico:**
    1.  Coordenador pode criar disciplina informando nome e código (livre, reuso automático).
    2.  Sistema verifica se já existe disciplina com o código; se sim, reutiliza.

---

## 7. Gerenciar Monitorias Ativas e Horários

* **Atores:**
    * Monitor
    * Professor
    * Sistema
* **Fluxo Básico:**
    1.  Monitor visualiza suas monitorias ativas.
    2.  Monitor cadastra horários disponíveis.
    3.  Professor pode validar/rejeitar horas lançadas pelo monitor.

---

## 8. Perfil Simplificado

* **Atores:**
    * Todos os usuários
* **Fluxo Básico:**
    1.  Usuário acessa o perfil e visualiza apenas nome e e-mail institucional.
    2.  Não há métricas, satisfação, relatórios ou histórico detalhado.
