---
id: brainstorm
title: Brainstorm
---
 
## Introdução
<p align = "justify">
O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto apresentados no documento problema de negócio. Esta técnica permite que todos os membros da equipe contribuam com suas perspectivas e conhecimentos sobre o sistema de monitoria acadêmica, promovendo um ambiente colaborativo onde o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias. O objetivo é capturar uma visão abrangente dos requisitos funcionais e não-funcionais da plataforma, identificando as principais funcionalidades necessárias para atender às necessidades dos usuários finais: alunos, professores e coordenação acadêmica.
</p>
 
## Metodologia
<p align = "justify">
A equipe se reuniu para debater ideias gerais sobre o projeto via Discord, começou às 20h30 de quarta-feira e terminou às 21h15, onde o Bruno Pessoa foi o moderador, direcionando a equipe com questões pré-elaboradas, e transcrevendo as respostas para o documento.
</p>
 
## Brainstorm
 
## Versão 1.0
 
## Perguntas
 
### 1. Qual o objetivo principal da aplicação?
 
<p align = "justify">
<b>Cauan Baptista</b> - O propósito da aplicação é criar um ecossistema digital unificado para o programa de monitorias. A plataforma servirá como um ponto central para que os alunos possam não apenas consultar todas as oportunidades de monitoria disponíveis, mas também se candidatar a elas de maneira intuitiva e eficiente.
</p>
 
<b>João Pedro Ginglass</b> - A plataforma deve fornecer um ambiente centralizado para gestão de vagas de monitoria, permitindo que alunos se candidatem, monitores acompanhem suas atividades e a coordenação tenha controle total sobre o processo.
 
<b>Bruno Pessoa</b> - O objetivo da aplicação é criar uma plataforma centralizada e eficiente para o gerenciamento de vagas de monitoria acadêmica, facilitando o processo de candidatura para alunos e permitindo que professores publiquem oportunidades de forma organizada. A plataforma busca modernizar o sistema atual de monitorias, eliminando processos manuais e oferecendo uma interface intuitiva que conecte de forma eficaz estudantes interessados em atuar como monitores com as oportunidades disponíveis. Além disso, a aplicação visa proporcionar maior transparência no processo seletivo e facilitar o acompanhamento das atividades de monitoria por parte da coordenação acadêmica.
 
<b>Diogo Mota</b> - O principal objetivo da aplicação é ajudar os monitores e a coordenação se comunicarem melhor e atenderem os alunos de forma mais eficiente.
 
<b>Guilherme Viana</b> - A plataforma deve gerenciar as vagas de monitoria, facilitando a candidatura dos alunos, o acompanhamento das atividades pelos monitores e o controle integral do processo pela coordenação.
</p>
 
---
 
### 2. Como será o processo para cadastrar um novo cliente?
 
<p align = "justify">
<b>Cauan Baptista</b> - O cadastro de novos usuários será realizado de forma automática e segura, acionado pela primeira autenticação bem-sucedida na plataforma. Ao acessar o sistema, o usuário deverá utilizar a opção de login com seu e-mail institucional. O sistema então validará o domínio do e-mail para determinar o perfil de acesso: e-mails com o domínio (@alunos.ibmec.edu.br) serão registrados como "Aluno", enquanto e-mails de professores (cujo formato de domínio será definido, como por exemplo @professores.ibmec.edu.br) serão registrados como "Professor". Após a validação positiva e sendo o primeiro acesso, o perfil correspondente será criado automaticamente, liberando o acesso às funcionalidades específicas da central de monitorias, que incluem permissões elevadas para os professores.
 
<b>Bruno Pessoa</b> - O cliente deve realizar o cadastro utilizando seu e-mail institucional através de um processo de autenticação integrada que garante a segurança e legitimidade dos usuários. O sistema automaticamente identificará o tipo de usuário baseado no domínio do e-mail (@alunos.ibmec.edu.br para estudantes e domínios específicos para professores) e criará o perfil apropriado com as permissões correspondentes. Durante o primeiro acesso, o usuário será direcionado para completar seu perfil com informações complementares como curso, período, disciplinas de interesse (para alunos) ou área de atuação (para professores). Este processo automatizado elimina a necessidade de validação manual e agiliza o ingresso na plataforma.
 
<b>Diogo Mota</b> - Com o usuário logado, ele deverá procurar as vagas que tem interesse se for um candidato a monitor, se for aluno poderá ver horario de aulas, bilhetes dos professores entre outras informações e caso seja professor ou da coordenacao poderá ter acesso ao sistema.

<b>João Pedro Ginglass</b> - O cliente (no caso, aluno ou professor) deverá preencher um formulário simples com dados pessoais, acadêmicos e de contato, que será validado pela coordenação antes da ativação no sistema.
 
<b>Guilherme Viana</b> - O novo cliente (aluno ou professor) consistirá no preenchimento de um formulário simples com informações pessoais, acadêmicas e de contato, que passará por validação da coordenação antes da ativação no sistema.

 
---
 
### 3. Como será a forma de adicionar produtos?
 
<p align = "justify">
<b>Cauan Baptista</b> - O cadastro de novas oportunidades de monitoria será uma funcionalidade exclusiva para usuários com perfil de "Professor". Através de um painel de gerenciamento, o professor acessará uma página dedicada onde encontrará um formulário para submeter uma nova vaga. O preenchimento de campos essenciais será obrigatório, incluindo o nome da matéria, código da disciplina, horários, e uma descrição detalhada das atividades e pré-requisitos para a vaga.
</p>
 
<p align = "justify">
<b>Bruno Pessoa</b> - O produto (vaga de monitoria) tem campos obrigatórios como nome da disciplina, descrição das atividades, requisitos necessários, horários disponíveis e informações sobre remuneração, sendo cadastrado exclusivamente por professores através de formulários estruturados. O processo de criação de vagas incluirá também campos para especificar pré-requisitos acadêmicos, como nota mínima na disciplina, período mínimo cursado, e habilidades específicas desejadas. Os professores poderão definir o número de vagas disponíveis, cronograma das atividades, local de atuação e critérios de avaliação dos candidatos. O sistema permitirá também anexar documentos complementares como plano de trabalho detalhado e bibliografia de apoio.
</p>
 
<b>João Pedro Ginglass</b> - O "produto" será tratado como disciplinas e vagas de monitoria. Cada disciplina poderá ter um número definido de vagas, cadastradas pela coordenação, incluindo requisitos e horários.
 
<b>Diogo Mota</b> - O produto sera periodicamente atualizado pela coordenação que tera acesso para criar vagas e processo seletivo.

<b>Guilherme Viana</b> - O produto será representado por disciplinas e suas respectivas vagas de monitoria. Cada disciplina poderá ter um número específico de vagas, definidas pela coordenação, com requisitos e horários previamente estabelecidos. 

</p>
 
---
 
### 4. Outras perguntas pertinentes ao contexto
<p align = "justify">
<b>Cauan Baptista</b> - Os administradores devem preencher campos como, nome da matéria, professor que os monitores vão reportar, remuneração, horários disponíveis para a monitoria, entre outros, e publicar essa vaga na área de "vagas"
 
<b>Bruno Pessoa</b> - O cliente (aluno) poderá navegar pelas vagas disponíveis, filtrar por disciplina ou horário, visualizar detalhes completos das oportunidades e acompanhar o status de suas candidaturas em tempo real.
 
<b>Joao Pedro Ginglass</b> - O cliente (aluno) poderá visualizar as vagas disponíveis, acompanhar o status da sua candidatura e, se aprovado, acessar informações de suas responsabilidades como monitor.
 
<b>Diogo Mota</b> - o aluno poderá ver notificacões como cancelamento e mudanca de horario feitos periodicamente pelos monitores ou administradores.

<b>Guilherme Viana</b> - O cliente (aluno) terá acesso às vagas de monitoria disponíveis, poderá acompanhar o andamento da sua candidatura e, em caso de aprovação, poderá consultar as informações relacionadas às suas atribuições como monitor. 

---
 
### 5. "Outras perguntas pertinentes ao contexto", Como seria a forma de adicionar do cliente adicionar os produtos ?
<p align = "justify">
<b>Cauan Baptista</b> - De forma parecida da alternativa anterior, porém, ao invés dos administradores preencherem campos como o de valores (campos necessários para a publicação de vagas de monitoria) e publicarem na área de "vagas", eles vão preencher todas as informações parecidas (nome, matéria e etc) e publicar na área de Monitorias disponíveis

<b>Bruno Pessoa</b> - Os clientes (alunos) não adicionam produtos diretamente, mas interagem com o sistema através de candidaturas às vagas disponíveis. O processo de candidatura envolve o preenchimento de um formulário específico onde o aluno deve demonstrar sua qualificação para a vaga, incluindo histórico acadêmico na disciplina, experiências relevantes e motivação. O sistema permitirá o upload de documentos comprobatórios como histórico escolar, certificados e carta de apresentação. Após a submissão, a candidatura entrará em um fluxo de avaliação que pode incluir análise curricular, entrevista ou prova prática, dependendo dos critérios estabelecidos pelo professor responsável.

<b>Diogo Motq</b> - Como foi dito os clientes (ALUNOS) nao irao adicionar produtos apenas se candidatarão pras vagas disponiveis.

</p>
 
### 6. Quais informações seriam interessante para o cliente?
<p align = "justify">
   <b>Cauan Baptista</b> - A informação mais relevante para o "cliente" (o aluno) depende fundamentalmente do seu objetivo na plataforma, exigindo uma abordagem direcionada. Para o aluno que está buscando se candidatar a uma vaga de monitoria, as informações cruciais são aquelas que o ajudam a avaliar a oportunidade e a se inscrever, como os detalhes da vaga, incluindo a disciplina, o professor supervisor e a carga horária semanal. Além disso, é essencial que ele tenha acesso claro aos requisitos obrigatórios para a candidatura, à contrapartida de remuneração ou benefícios, a uma descrição detalhada das atividades esperadas e, de forma muito importante, aos prazos finais para a inscrição. Por outro lado, para o aluno que busca atendimento, as necessidades são mais operacionais e imediatas; ele precisa de acesso rápido à grade de horários, com os dias, horários e locais de cada sessão, além da identificação do monitor responsável por cada atendimento e o escopo daquele encontro, seja para um plantão de dúvidas ou para a resolução de exercícios. Como uma funcionalidade adicional para estimular a colaboração, o sistema poderia, mediante consentimento explícito dos usuários para garantir a privacidade, exibir outros alunos que frequentam as mesmas sessões, facilitando assim a formação de grupos de estudo.
   
   <b>João Pedro Ginglass</b> - O cliente usuário poderá acessar informações sobre vagas abertas, status de candidatura, histórico de monitorias, carga horária registrada e relatórios de desempenho.
   
   <b>Bruno Pessoa</b> - As informações mais relevantes incluem detalhes das vagas (disciplina, horários, requisitos), status das candidaturas, histórico de participação em monitorias, dados de contato dos responsáveis e cronogramas das atividades programadas. Para candidatos, são essenciais informações sobre processo seletivo, remuneração e atividades esperadas. Para monitores ativos, o sistema deve oferecer ferramentas de registro de atividades e comunicação com supervisores, além de um calendário integrado com prazos importantes do programa.

<b>Diogo Mota</b> - Além das vagas disponiveis, seria interessante termos um portal entre o aluno e o monitor para que possam trocar informações utéis no dia a dia.
   
</p>
 
### Requisitos elicitados
 
|ID|Descrição|
|----|-------------|
|BS01| O aluno poderá se cadastrar no sistema informando dados pessoais, acadêmicos e de contato.|
|BS02| O aluno poderá visualizar todas as vagas de monitoria disponíveis por disciplina.|
|BS03| O aluno poderá se candidatar a vagas de monitoria, anexando informações e documentos necessários.|
|BS04| O aluno poderá acompanhar o status da candidatura (pendente, aprovado ou recusado).|
|BS05| O aluno aprovado terá acesso ao seu painel de monitoria, com informações de carga horária e atividades.|
|BS06| O aluno poderá registrar relatórios de atividades e horas cumpridas como monitor.|
|BS07| O professor poderá solicitar abertura de novas vagas de monitoria para disciplinas sob sua responsabilidade.|
|BS08| O professor poderá acompanhar os monitores vinculados à sua disciplina.|
|BS09| A coordenação poderá cadastrar, editar ou remover disciplinas e vagas de monitoria.|
|BS10| O sistema deverá permitir que cada vaga seja vinculada a uma disciplina específica.|
|BS11| O sistema deverá controlar o número de vagas por disciplina, evitando excedentes.|
|BS12| O sistema deverá permitir filtros e buscas por disciplina, período ou status da vaga.|
|BS13| O sistema deverá gerar relatórios de monitoria (horas cumpridas, número de candidatos, aprovações).|
|BS14| O sistema deverá enviar notificações aos alunos sobre resultados de candidatura e atualizações de vagas.|
|BS15| O sistema deverá manter histórico de monitorias de cada aluno, permitindo acompanhamento longitudinal.|
 
## Conclusão
<p align = "justify">
Através da aplicação da técnica, foi possível elicitar alguns dos primeiros requisitos do projeto.
</p>

## Autor(es)
| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 10/09/2025 | 1.0 | Criação do documento | Cauan Baptista, João Pedro Ginglass, Bruno Pessoa |
