# Aplicação Web: Quizzes

Desenvolvida por: Zeus Moreira

## Informações de desenvolvimento

Essa aplicação foi desenvolvida utilizando React e CSS Puro para a parte de frontend.

A parte do backend foi utilizada como serviço, com o uso do Firebase, onde possui o Authentication para gerenciamento de usuários, Cloud Firestore para armazenarmos dados pertinentes da aplicação e também Storage para armazenamento de mídia.

## Informações de funcionamento do sistema

Essa aplicação é uma plataforma de resposta de Quizzes, onde temos 2 perfis de usuário:

Usuário Comum: Possui acesso a criação, edição e visualização de sua própria conta. Detem as funcionalidade públicas da aplicação, onde tem acesso a resposta de Quizzes e então ter a possibilidade de acumular pontos e aumentar o seu Score, consegue também acessar o Ranking para ver sua colocação e a de outros usuários.

Administrador: Possui as mesmas possibilidades do usuário comum, mas tem o privilégio de gerenciar os Quizzes da aplicação, é importante ressaltar que usuário administrador é pré-determinado e não forma de cadastrar usuários administradores.
Credenciais Administrador: 
Usuário: admin@quizzes.com
Senha: senha123

## Funcionalidades

Login: Formulário que possui campos validados e interativos com o usuário e permite o acesso a aplicação com uma conta ja criada anteriormente pelo próprio usuário, caso não se lembre da senha há a possibilidade de recuperação utilizando o email de cadastro.

Registro: Formulário que possui campos validados e interativos com o usuário e possui algumas regras para a criação de uma conta, como o limite máximo de 16 dígitos para o nome de usuário, senhas coincidentes com mais de 6 caracteres e o email com formato válido.

HomePage: O guia do usuário, nela ele possui acesso a jogar quizzes apertando no botão Jogar, onde será redirecionado para seleção de quizzes geral ou selecionando uma categoria popular que também redireciona para seleção de quizzes, porém filtrado. Pode também acessar o ranking apertando em "Acesse nosso ranking" e editar e visualizar seus dados acessando a opção "Minha Conta" no header da aplicação, onde também há a opção de Sair da aplicação.

RankingPage: Onde o usuário tem acesso a um ranking TOP 50 atualizado da pontuação dele e de outros usuários, caso recarregue a página e algum outro usuário tenha ganhado mais pontos respondendo quizzes o ranking é atualizado para ele também, a posição do usuário logado aparece na parte de baixo do ranking.

MinhaContaPage: É dividida em 2 abas para o usuário comum e em 3 para usuário administrador.

    - Editar Perfil (ambos usuários): Formulário onde é possível alterar o nome de usuário e senha, as possibilidades são de editar apenas o usuário, usuário e senha ou apenas senha.
    - Gerenciar Quizzes (apenas administrador): Tela que possui um menu lateral que lista os quizzes e pode edita-los ou exclui-los, há também a possibilidade de criar novos quizzes.
    - Meu Perfil (ambos usuários): Mostra dados básicos do usuário como nome, categoria favorita, score atual e da acesso ao ranking.

JogarPage: Onde há uma tela que possui um menu lateral com 2 selects onde é possível filtrar os quizzes por Categoria e Dificuldade, selecionar o quiz desejado e responder, no final gerando uma pontuação e agregando ao usuário.

## Instalação da aplicação

Não tem muitos passos mas aqui estão:

### `npm install`

Será necessário para instalar as dependencias do projeto e possuir o comportamento correto da aplicação.

### `npm start`

Tendo realizado o npm install o próximo será o npm start que startará o sistema em forma de desenvolvimento.
