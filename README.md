# BMAdesivos — Frontend

O projeto tem como objetivo principal desenvolver um sistema web de gestão de estoque e produção para a empresa BM Adesivo, buscando centralizar e otimizar operações relacionadas à organização de adesivos, insumos e clientes além de organizar informações de estoque em um _dashboard_.
 
> Este repositório contém apenas o **frontend**. O backend (Java/Spring Boot) está em um repositório separado: [BMAdesivos](https://github.com/VictorMHB/BMAdesivos)

🔗 **Deploy:** https://bm-adesivos-frontend.vercel.app/

---

## Sobre o projeto

O sistema visa solucionar a necessidade de melhorar a organização e o controle do estoque da empresa. A maioria dos processos eram
realizados de forma manual, utilizando planilhas e ferramentas descentralizadas, dificultando o acompanhamento de insumos e suas movimentações. O sistema permite:

- **Ordens de produção** — abertura, acompanhamento e transição de status (Pendente → Em Produção → Concluído) em um _board_ com _drag-and-drop_, além de cancelamento e arquivamento.
- **Estoque de insumos** — controle de substratos (vinil, papel), tintas e resinas, com cálculo automático de área (m²) e outros valores.
- **Clientes** — cadastro e vínculo com as ordens de produção.
- **Funcionários** — cadastro e gestão de responsáveis pela produção.
- **Autenticação** — acesso protegido via JWT.

## Tecnologias

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) — navegação entre páginas
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [dnd-kit](https://dndkit.com/) — drag-and-drop do board de ordens
- [react-toastify](https://fkhadra.github.io/react-toastify/) — notificações
- [lucide-react](https://lucide.dev/) — ícones

## Autor

Desenvolvido por [Victor MHB](https://github.com/VictorMHB).
