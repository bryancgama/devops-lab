# COPY index.html /usr/share/nginx/html/

# Imagem oficial do Nginx preparada para correr sem root (utilizador nginx, uid 101)
FROM nginxinc/nginx-unprivileged:1.29-alpine

LABEL org.opencontainers.image.title="devops-lab" \
      org.opencontainers.image.source="https://github.com/bryancgama/devops-lab"

# Configuração própria do Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Só os ficheiros do site, explicitamente (README, nginx/ e .git ficam de fora)
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/  /usr/share/nginx/html/js/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1