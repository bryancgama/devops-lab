// ============ Dados ============
const tools = [
  { name: "Linux", cat: "base", desc: "Sistema operativo onde quase tudo corre. Shell, processos, permissões e redes." },
  { name: "Git", cat: "base", desc: "Controlo de versões. Toda a infra e o código vivem num repositório." },
  { name: "Redes", cat: "base", desc: "TCP/IP, DNS, HTTP, VLANs e firewalls: a base para VPCs e Ingress." },
  { name: "Docker", cat: "containers", desc: "Empacota a aplicação e as dependências numa imagem que corre igual em qualquer lado." },
  { name: "Kubernetes", cat: "containers", desc: "Orquestra contentores: deploy, escala, self-healing e rollback." },
  { name: "Helm", cat: "containers", desc: "Gestor de pacotes do Kubernetes. Templates reutilizáveis por ambiente." },
  { name: "Terraform", cat: "iac", desc: "Infraestrutura como código: cria e destrói recursos de cloud de forma declarativa." },
  { name: "Ansible", cat: "iac", desc: "Configura servidores por SSH com playbooks idempotentes." },
  { name: "AWS", cat: "iac", desc: "Cloud pública: VPC, EC2, RDS, IAM, S3 e serviços geridos." },
  { name: "GitHub Actions", cat: "cicd", desc: "Pipelines de CI/CD: testar, construir imagens e fazer deploy a cada push." },
  { name: "Prometheus", cat: "observabilidade", desc: "Recolhe métricas e avalia regras de alerta." },
  { name: "Grafana", cat: "observabilidade", desc: "Dashboards para métricas, logs e SLOs." },
  { name: "Loki", cat: "observabilidade", desc: "Agregação de logs, consultados lado a lado com as métricas." },
];

const highlights = [
  { tag: "Redes", title: "Rede segmentada em VLANs", desc: "Switches organizados com a rede dividida por setor e um padrão de endereçamento por tipo de dispositivo." },
  { tag: "Monitorização", title: "Monitorização com Zabbix", desc: "Acompanhamento de servidores e serviços para detetar falhas antes dos utilizadores." },
  { tag: "Operação", title: "Servidores Windows e Linux", desc: "Active Directory, utilizadores, impressoras, servidor de ficheiros e partilhas." },
  { tag: "Continuidade", title: "Backups e recuperação", desc: "Rotinas de backup para manter o negócio a funcionar quando algo corre mal." },
  { tag: "Gestão", title: "Supervisão de TI", desc: "Prioridades, incidentes e comunicação com as áreas de negócio." },
  { tag: "Automação", title: "Robôs RPA em Java e Node.js", desc: "Automação de processos repetitivos e scraping em escala." },
  { tag: "Desenvolvimento", title: "Aplicações full stack", desc: "APIs REST com NestJS e TypeScript, PostgreSQL, SQL Server, React e Next.js." },
];

// Camadas de "Como este site corre".
// Mude "active" para true à medida que cada camada estiver a funcionar —
// só as camadas ativas aparecem na página.
const stack = [
  { active: true,  name: "Código",          tool: "Git + GitHub",         desc: "HTML, CSS e JavaScript sem dependências, versionados num repositório." },
  { active: false, name: "Imagem",          tool: "Docker + Nginx",       desc: "Imagem leve baseada em nginx:alpine." },
  { active: false, name: "Pipeline",        tool: "GitHub Actions",       desc: "Cada push valida, constrói a imagem e publica a versão." },
  { active: false, name: "Infraestrutura",  tool: "Terraform + AWS",      desc: "Toda a infraestrutura descrita em código, criada e destruída com um comando." },
  { active: false, name: "Configuração",    tool: "Ansible",              desc: "Servidores configurados de forma idempotente." },
  { active: false, name: "Orquestração",    tool: "Kubernetes + Helm",    desc: "Deploy declarativo com rollback." },
  { active: false, name: "Observabilidade", tool: "Prometheus + Grafana", desc: "Métricas, alertas e um SLO de disponibilidade." },
];

const terminalLines = [
  "$ docker build -t devops-lab .",
  "✔ imagem construída",
  "$ terraform apply -auto-approve",
  "✔ infraestrutura criada",
  "$ kubectl rollout status deploy/devops-lab",
  "✔ deployment disponível",
  "$ curl -s localhost/health",
  "ok",
];

// ============ Utilitários ============
const $ = (sel) => document.querySelector(sel);

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* sem storage */ }
}

// ============ Tema ============
function initTheme() {
  const saved = safeGet("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light");

  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    safeSet("theme", next);
  });
}

// ============ Menu mobile ============
function initMenu() {
  const nav = $("#nav");
  $("#menu-toggle").addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

// ============ Terminal animado ============
function initTerminal() {
  const el = $("#terminal-text");
  let line = 0, char = 0, output = "";

  function type() {
    if (line >= terminalLines.length) {
      el.innerHTML = output + '<span class="cursor">&nbsp;</span>';
      return;
    }
    const current = terminalLines[line];
    if (char < current.length) {
      output += current[char++];
      el.textContent = output;
      setTimeout(type, current.startsWith("$") ? 35 : 10);
    } else {
      output += "\n";
      line++; char = 0;
      setTimeout(type, 350);
    }
  }
  type();
}

// ============ Ferramentas ============
const catLabel = { base: "Base", containers: "Containers", iac: "IaC", cicd: "CI/CD", observabilidade: "Observabilidade" };

function renderTools(filter = "todas") {
  const list = filter === "todas" ? tools : tools.filter((t) => t.cat === filter);
  $("#tools").innerHTML = list.map((t) => `
    <article class="tool">
      <span class="tool-tag">${catLabel[t.cat]}</span>
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
    </article>`).join("");
}

function initFilters() {
  const buttons = document.querySelectorAll("#filters .chip");
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTools(btn.dataset.filter);
  }));
  renderTools();
}

// ============ Experiência ============
function renderHighlights() {
  $("#highlights").innerHTML = highlights.map((h) => `
    <article class="tool">
      <span class="tool-tag">${h.tag}</span>
      <h3>${h.title}</h3>
      <p>${h.desc}</p>
    </article>`).join("");
}

// ============ Como este site corre ============
function renderStack() {
  $("#stack-list").innerHTML = stack.filter((l) => l.active).map((l, i) => `
    <li class="layer">
      <span class="layer-num">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${l.name} <span class="layer-tool">${l.tool}</span></h3>
        <p>${l.desc}</p>
      </div>
      <span class="status">● ativo</span>
    </li>`).join("");
}

// ============ Rodapé / versão ============
// A versão vem de window.APP_VERSION (ficheiro js/version.js gerado pela pipeline).
// Em desenvolvimento local mostra "dev".
function initFooter() {
  $("#year").textContent = new Date().getFullYear();
  if (window.APP_VERSION) $("#build-info").textContent = "versão: " + window.APP_VERSION;
}

// ============ Arranque ============
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initTerminal();
  initFilters();
  renderHighlights();
  renderStack();
  initFooter();
});
