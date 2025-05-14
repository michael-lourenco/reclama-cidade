# Me Arrume - Transformando Cidades através da Participação Cidadã

## 🌟 Visão Geral

Me Arrume é uma plataforma inovadora que capacita cidadãos a participarem ativamente na melhoria de suas cidades. Através de uma aplicação web intuitiva, os usuários podem reportar problemas de infraestrutura urbana em tempo real, criando uma ponte direta entre a comunidade e os gestores públicos.

A plataforma permite que qualquer cidadão reporte problemas como buracos em vias públicas, problemas de iluminação, alagamentos e outros problemas de infraestrutura urbana, além de acompanhar o status das ocorrências já registradas.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [O Problema](#-o-problema)
- [Nossa Solução](#-nossa-solução)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Como Executar](#-como-executar)
- [Regras de Negócio](#-regras-de-negócio)
- [Padrões de Codificação](#-padrões-de-codificação)
- [Como Contribuir](#-como-contribuir)
- [Recursos e Referências](#-recursos-e-referências)
- [Contato](#-contato)

## 🎯 O Problema

As cidades enfrentam desafios diários com:

- Buracos em vias públicas
- Problemas de iluminação
- Alagamentos
- Demora na identificação de problemas
- Falta de transparência no acompanhamento de soluções

## 💡 Nossa Solução

Me Arrume oferece:

### Para Cidadãos

- Reporte rápido e fácil de problemas
- Mapa interativo com visualização em tempo real
- Acompanhamento do status das ocorrências
- Login simplificado com Google
- Interface intuitiva e amigável

### Para Gestores Públicos

- Dashboard com dados em tempo real
- Mapeamento preciso de áreas problemáticas
- Priorização inteligente de intervenções
- Métricas e análises detalhadas
- Comunicação direta com a população

## 🛠 Tecnologias Utilizadas

O projeto utiliza um stack moderno de desenvolvimento web:

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) - Framework React com SSR e SSG
  - [React 19](https://react.dev/) - Biblioteca para construção de interfaces
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS para estilização
  - [Leaflet](https://leafletjs.com/) - Biblioteca para mapas interativos
  - [Shadcn/UI](https://ui.shadcn.com/) (via Radix UI) - Componentes acessíveis e reutilizáveis
  - [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado para dados assíncronos

- **Backend/Serviços**:
  - [Firebase](https://firebase.google.com/)
    - Authentication - Autenticação de usuários
    - Firestore - Banco de dados NoSQL
  - [Next Auth](https://next-auth.js.org/) - Autenticação para Next.js

- **Ferramentas de Desenvolvimento**:
  - [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para JavaScript
  - [ESLint](https://eslint.org/) - Linting de código
  - [Prettier](https://prettier.io/) - Formatação de código

## 📁 Estrutura do Projeto

```
/
├── .gitignore             # Arquivos e diretórios ignorados pelo Git
├── .prettierrc            # Configuração do formatador Prettier
├── components.json        # Configuração dos componentes shadcn/ui
├── next.config.ts         # Configuração do Next.js
├── package.json           # Dependências e scripts do projeto
├── postcss.config.mjs     # Configuração do PostCSS
├── tsconfig.json          # Configuração do TypeScript
├── src/                   # Código-fonte principal
│   ├── app/               # Diretório de aplicações Next.js
│   │   ├── api/           # Rotas de API
│   │   ├── dashboard/     # Dashboard para gestores
│   │   ├── about/         # Página Sobre
│   │   ├── user/          # Páginas relacionadas ao usuário
│   │   ├── page.tsx       # Página inicial
│   │   └── layout.tsx     # Layout principal da aplicação
│   │
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── common/        # Componentes comuns
│   │   ├── ui/            # Componentes de UI (shadcn)
│   │   ├── map/           # Componentes do mapa
│   │   ├── marker/        # Componentes de marcadores
│   │   ├── problem/       # Componentes relacionados a problemas
│   │   └── ...            # Outros componentes organizados por domínio
│   │
│   ├── lib/               # Bibliotecas e utilitários
│   ├── services/          # Serviços (Firebase, autenticação, etc.)
│   │   └── firebase/      # Configuração e funções do Firebase
│   │
│   ├── hooks/             # React hooks customizados
│   ├── utils/             # Funções utilitárias
│   └── constants/         # Constantes do aplicativo
```

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave_api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_USERS_COLLECTION=users
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_segredo_nextauth
```

## 🚀 Como Executar

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/me-arrume.git
   cd me-arrume
   ```

2. Instale as dependências:
   ```
   npm install
   # ou
   yarn install
   ```

3. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse a aplicação em `http://localhost:3000`

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com turbopack
- `npm run build` - Cria a versão de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar problemas no código

## 📜 Regras de Negócio

- O usuário não seleciona o ponto no mapa, apenas reporta problemas em sua localização atual (capturada automaticamente)
- O usuário pode fazer uma reclamação no ponto em que está
- Usuários podem votar nas reclamações feitas no mapa para validar sua existência
- Após 20 likes no marcador do mapa, ele é considerado verificado
- Quando verificado, o botão de like é substituído pelo botão de confirmação de solucionado
- Quando o número de confirmações for maior ou igual ao de likes, o marcador é considerado solucionado
- Administradores podem marcar problemas como solucionados (status parcial até confirmação por usuários)
- Cada usuário possui limite de uma reclamação por dia
- Marcações idênticas num raio próximo são agrupadas para evitar duplicidades

## 📏 Padrões de Codificação

- **TypeScript**: Utilize tipagem estática para todas as funções, componentes e variáveis
- **Componentes**: Siga a estrutura de pastas por domínio para melhor organização
- **Estilização**: Utilize Tailwind CSS para estilos
- **Formatação**: O código segue as regras definidas no Prettier
- **Hooks**: Separe a lógica de estado em hooks customizados quando possível
- **Firebase**: Todas as interações com o Firestore devem ser feitas através do serviço FirebaseService

## 🤝 Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Fluxo de Desenvolvimento

1. Verifique as issues existentes ou crie uma nova para discutir a funcionalidade
2. Implemente seguindo os padrões de codificação do projeto
3. Adicione testes quando aplicável
4. Atualize a documentação se necessário

## 📚 Recursos e Referências

### Ícones Utilizados

- [Maps and location icons created by afif fudin - Flaticon](https://www.flaticon.com/free-icons/maps-and-location)
- [3d map icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/3d-map)
- [Hole icons created by Paul J. - Flaticon](https://www.flaticon.com/free-icons/hole)
- [Flood icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/flood)
- [Lighting icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/lighting)

## 📊 Métricas e Tração

- 1.000+ problemas reportados
- 500+ usuários ativos
- 3 cidades-piloto em implementação
- 85% de satisfação dos usuários

## 📬 Contato

Para parcerias e demonstrações:

- Email: <kontempler@gmail.com>
- Website: [www.mearrume.com](https://reclama-cidade.vercel.app/)

---

*Me Arrume - Construindo juntos cidades mais inteligentes e participativas.*
