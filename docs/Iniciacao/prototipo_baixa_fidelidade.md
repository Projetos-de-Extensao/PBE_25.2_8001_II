---
id: prototipobaixa
title: Protótipo Baixa Fidelidade
---
## Introdução

<p align="justify">
A construção do protótipo de baixa fidelidade é um passo fundamental para validar os fluxos de navegação e a estrutura da informação antes do desenvolvimento visual detalhado. Ele serve como um esqueleto funcional da plataforma, permitindo que a equipe teste a usabilidade das jornadas principais e garanta que as soluções propostas atendem diretamente às necessidades levantadas na fase de pesquisa. Este documento detalha as telas e os fluxos de cada persona do sistema "Portal de Monitorias Ibmec".
</p>

## Metodologia

<p align="justify">
Após as discussões iniciais e a consolidação da pesquisa, a ferramenta <strong>Loveless</strong> foi selecionada para a produção do protótipo de baixa fidelidade (wireframes). O foco será na funcionalidade, hierarquia da informação e na jornada do usuário, deixando os detalhes visuais de alta fidelidade (cores, tipografia) para uma fase posterior. Para esta primeira versão, será utilizada a funcionalidade de IA da ferramenta para criar um protótipo o mais interativo possível dentro do escopo de baixa fidelidade.
</p>

---


## Protótipo de baixa fidelidade

Para facilitar o entendimento do projeto e o fluxo, vamos separar em jornadas

### Versão 1.0

## Jornadas do Usuário

### Jornada 0: Acesso e Autenticação (Comum a Todos)

**Objetivo:** Garantir um acesso seguro e exclusivo para a comunidade acadêmica Ibmec, permitindo a criação e gestão de contas de forma simples.

**Fluxo:**

#### Tela 0.1: Login
- **Persona Principal:** Todos os usuários.
- **Objetivo da Tela:** Permitir que usuários existentes acessem a plataforma.
- **Elementos Chave:**
    - Campo "E-mail Institucional (@ibmec.edu.br)".
    - Campo "Senha".
    - Botão "Entrar".
    - Link "Esqueceu sua senha?".
    - Link "Não tem uma conta? Cadastre-se".
- **Regra de Negócio:** O e-mail deve ser validado para conter o domínio institucional.

#### Tela 0.2: Cadastro
- **Persona Principal:** Aluno, Professor/Coordenador.
- **Objetivo da Tela:** Permitir que novos usuários criem uma conta na plataforma.
- **Elementos Chave:**
    - Campo "Nome Completo".
    - Campo "E-mail Institucional".
    - Campo "Matrícula" (para alunos).
    - Campo "Criar Senha" e "Confirmar Senha".
    - Seleção de Perfil: "Sou Aluno" ou "Sou Professor/Coordenador".
    - Botão "Cadastrar".
- **Regra de Negócio:** Após o cadastro, um e-mail de verificação é enviado.

#### Tela 0.3: Recuperação de Senha
- **Persona Principal:** Todos os usuários.
- **Objetivo da Tela:** Permitir que o usuário recupere o acesso à sua conta caso esqueça a senha.
- **Elementos Chave:**
    - Campo "E-mail Institucional".
    - Botão "Enviar link de recuperação".

#### Tela 0.4: Perfil do Usuário
- **Persona Principal:** Todos os usuários.
- **Objetivo da Tela:** Permitir a visualização e edição das informações pessoais.
- **Elementos Chave:**
    - Foto do perfil (opcional).
    - Campos editáveis: Nome, Telefone de Contato.
    - Campos não editáveis: E-mail, Matrícula.
    - Área para alterar senha.
---

### Jornada 1: Aluno Candidato a Monitor

**Objetivo:** Permitir que um aluno encontre e se candidate a uma vaga de monitoria de forma clara, centralizada e transparente.

**Fluxo:**

#### Tela 1.1: Home Pós-Login (Visão Aluno)
- **Persona Principal:** Aluno.
- **Objetivo da Tela:** Servir como ponto de partida, direcionando o aluno para suas principais necessidades.
- **Elementos Chave:**
    - Saudação ("Olá, [Nome do Aluno]!").
    - Botão principal: **"Procurar Vaga de Monitoria"** (para se candidatar).
    - Botão secundário: **"Buscar Ajuda de um Monitor"** (para agendar).
    - Acesso rápido ao menu "Minhas Candidaturas".

#### Tela 1.2: Busca de Vagas
- **Persona Principal:** Aluno Candidato a Monitor.
- **Objetivo da Tela:** Resolver a dor da "Falta de Centralização", permitindo encontrar todas as vagas abertas em um só lugar.
- **Elementos Chave:**
    - Barra de busca (por disciplina, professor).
    - Filtros (Área de conhecimento, campus, carga horária).
    - Grid de "Cards de Vaga", cada um com: Título da disciplina, Professor, Nº de vagas, Prazo de inscrição.

#### Tela 1.3: Detalhes da Vaga
- **Persona Principal:** Aluno Candidato a Monitor.
- **Objetivo da Tela:** Resolver a dor da "Ambiguidade e Incerteza", oferecendo todas as informações necessárias sobre a vaga.
- **Elementos Chave:**
    - Título da Disciplina.
    - Descrição completa das atividades.
    - Requisitos (nota mínima, período, pré-requisitos cursados).
    - Carga horária semanal.
    - Nome do Professor/Coordenador responsável.
    - Prazo final para candidatura.
    - Botão "Candidatar-se".

#### Tela 1.4: Formulário de Candidatura
- **Persona Principal:** Aluno Candidato a Monitor.
- **Objetivo da Tela:** Padronizar e simplificar o processo de inscrição, eliminando a burocracia.
- **Elementos Chave:**
    - Confirmação de dados (Nome, E-mail, Matrícula - preenchidos automaticamente).
    - Campo de texto: "Por que você gostaria de ser monitor desta disciplina?".
    - Upload de documentos (opcional, ex: histórico escolar).
    - Botão "Enviar Candidatura".

#### Tela 1.5: Minhas Candidaturas
- **Persona Principal:** Aluno Candidato a Monitor.
- **Objetivo da Tela:** Resolver a dor da "Falta de Transparência no Processo Seletivo", permitindo o acompanhamento em tempo real.
- **Elementos Chave:**
    - Lista de todas as vagas para as quais o aluno se candidatou.
    - Status claro para cada candidatura: `Recebida`, `Em Análise`, `Aprovada`, `Rejeitada`.
    - Notificações sobre mudança de status.

---

### Jornada 2: Aluno Consumidor de Monitoria

**Objetivo:** Permitir que um aluno encontre ajuda acadêmica de forma rápida, agende sessões com facilidade e avalie o serviço prestado.

**Fluxo:**

#### Tela 2.1: Busca de Monitorias
- **Persona Principal:** Aluno Consumidor de Monitoria.
- **Objetivo da Tela:** Resolver a "Dificuldade de Descoberta" de monitores disponíveis.
- **Elementos Chave:**
    - Busca por disciplina.
    - Grid de "Cards de Disciplina", cada um mostrando o número de monitores disponíveis.

#### Tela 2.2: Perfil Público do Monitor
- **Persona Principal:** Aluno Consumidor de Monitoria.
- **Objetivo da Tela:** Resolver a "Incerteza sobre a Qualidade", fornecendo informações e avaliações sobre o monitor.
- **Elementos Chave:**
    - Nome e foto do monitor.
    - Breve biografia/apresentação.
    - Visualização de horários de monitores (somente leitura, sem agendamento).

<!-- Removidas telas de agendamento; alunos apenas visualizam monitorias e horários -->


---

### Jornada 3: Monitor

**Objetivo:** Oferecer ferramentas para que o monitor gerencie sua agenda, registre suas atividades e acompanhe seu desempenho de forma organizada e sem burocracia.

**Fluxo:**

#### Tela 3.1: Painel do Monitor
- **Persona Principal:** Monitor.
- **Objetivo da Tela:** Fornecer uma visão geral rápida de suas responsabilidades e atividades.
- **Elementos Chave:**
    - Próximas sessões agendadas.
    - Avisos da coordenação.
    - Atalhos para "Gerenciar Agenda" e "Registrar Atividades".

#### Tela 3.2: Gerenciar Minha Agenda
- **Persona Principal:** Monitor.
- **Objetivo da Tela:** Resolver a "Gestão de Agenda Caótica", permitindo total controle sobre a disponibilidade.
- **Elementos Chave:**
    - Interface de calendário (semanal/mensal).
    - Ferramenta para adicionar/remover blocos de horário de atendimento.
    - Opção para definir o local (online ou presencial).

#### Tela 3.3: Gestão de Sessões e Presença
- **Persona Principal:** Monitor.
- **Objetivo da Tela:** Resolver a "Falta de Ferramentas de Gestão" e o problema dos "No-Shows".
- **Elementos Chave:**
    - Lista de alunos agendados para cada horário.
    - Checkboxes para marcar presença ou ausência.
    - Campo para anotações internas sobre a sessão (tópicos abordados).
    - Botão "Salvar Registro da Sessão".

#### Tela 3.4: Repositório de Materiais
- **Persona Principal:** Monitor.
- **Objetivo da Tela:** Resolver o "Compartilhamento de Material" repetitivo.
- **Elementos Chave:**
    - Interface para upload de arquivos (PDFs, slides, listas de exercícios).
    - Organização dos materiais por tópicos ou datas.


---

### Jornada 4: Coordenador/Professor

**Objetivo:** Centralizar e automatizar a gestão do programa de monitorias, desde a criação de vagas até a análise de dados, reduzindo a carga administrativa.

**Fluxo:**

#### Tela 4.1: Painel do Coordenador
- **Persona Principal:** Coordenador/Professor.
- **Objetivo da Tela:** Resolver a "Falta de Visibilidade e Controle", oferecendo um dashboard com os dados mais importantes.
- **Elementos Chave:**
    - Números chave: Vagas abertas, Candidaturas pendentes, Total de monitores ativos.
    - Gráfico de horas de monitoria realizadas no mês.
    - Atalhos para as principais ações (Criar Vaga, Ver Candidatos).

#### Tela 4.2: Gerenciar Vagas de Monitoria
- **Persona Principal:** Coordenador/Professor.
- **Objetivo da Tela:** Facilitar o processo de criação, edição e publicação de vagas.
- **Elementos Chave:**
    - Botão "Criar Nova Vaga".
    - Lista de vagas existentes com status (Ativa, Pausada, Encerrada).
    - Opções de Editar, Pausar, Ver Candidatos.
    - Formulário de criação/edição de vaga (mesmos campos da Tela 1.3).

#### Tela 4.3: Análise de Candidatos
- **Persona Principal:** Coordenador/Professor.
- **Objetivo da Tela:** Resolver os "Processos Manuais e Burocráticos" da seleção.
- **Elementos Chave:**
    - Seleção de uma vaga para ver os candidatos.
    - Tabela de candidatos com informações chave (Nome, Período, Nota na disciplina-alvo).
    - Botões para "Aprovar" ou "Rejeitar" cada candidato.
    - Link para ver o perfil completo e as informações da candidatura.

#### Tela 4.4: Relatórios e Estatísticas
- **Persona Principal:** Coordenador/Professor.
- **Objetivo da Tela:** Resolver a "Geração de Relatórios Trabalhosa".
- **Elementos Chave:**
    - Filtros por período (data de início/fim).
    - Opção para gerar relatórios:
        - Relatório de horas por monitor.
        - Relatório de atendimentos por disciplina.
        - Lista de monitores ativos.
    - Botão para "Exportar como Planilha (CSV/Excel)".

# Link de acesso: https://monitoria-conecta.lovable.app/auth/login
---
---
---

### Versão 2.0



## Autor(es)

| Data     | Versão | Descrição                            | Autor(es)                                                                            |
| -------- | ------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 18/09/25 | 1.0     | Criação e edição do documento, alinhando com os objetivos do nosso projeto                 | Cauan Baptista e Bruno Pessoa                                                 |
| 18/09/20 | 1.1     | Fazendo o código com lovable para gerar o protótipo    | Cauan Baptista e Bruno Pessoa                                                   |

