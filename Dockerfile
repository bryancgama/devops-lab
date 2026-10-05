FROM nginx:1.29-alpine

LABEL org.opencontainers.image.title="devops-lab" \
org.opencontainers.image.source="https://github.com/bryancgama/devops-lab"

COPY . /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
 CMD wget -qO- http://localhost/ >/dev/null || exit 1
