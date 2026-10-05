# devops-lab

Página pessoal de Bryan Catani Gama (SRE / DevOps), em HTML, CSS e JavaScript puro, sem dependências.

O conteúdo é simples de propósito: o foco do repositório é o caminho que a página faz do commit até ao browser.

## Estrutura

```
devops-lab/
├── index.html      # página única
├── css/style.css   # estilos, tema claro/escuro
├── js/main.js      # conteúdo (experiência, ferramentas, camadas do site)
└── js/version.js   # versão mostrada no rodapé, gerada no build
```

## Correr localmente

```bash
python3 -m http.server 8080
# ou
npx serve .
```

Abrir http://localhost:8080

## Arquitetura

As camadas ativas aparecem na secção "Como este site corre" da página
(array `stack` em `js/main.js`).

## Contacto

bcatanigama@hotmail.com · [bryancgama.com](https://bryancgama.com)
