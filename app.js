const bookmarks = [
  { title: "ChatGPT", href: "https://chatgpt.com/", category: "AI 与模型", tags: ["AI", "OpenAI", "对话"] },
  { title: "Gemini", href: "https://gemini.google.com/", category: "AI 与模型", tags: ["AI", "Google"] },
  { title: "扣子编程", href: "https://code.coze.cn/home", category: "AI 与模型", tags: ["AI", "智能体", "开发"] },
  { title: "DeepSeek 登录", href: "https://platform.deepseek.com/sign_in", category: "AI 与模型", tags: ["AI", "模型", "平台"] },
  { title: "DeepSeek API Keys", href: "https://platform.deepseek.com/api_keys", category: "AI 与模型", tags: ["AI", "API", "密钥"] },
  { title: "DeepSeek 用量", href: "https://platform.deepseek.com/usage", category: "AI 与模型", tags: ["AI", "用量", "平台"] },
  { title: "OpenAI API", href: "https://platform.openai.com/home", category: "AI 与模型", tags: ["AI", "API", "OpenAI"] },
  { title: "OpenAI", href: "https://openai.com/zh-Hans-CN/?utm_source=chatgpt.com", category: "AI 与模型", tags: ["AI", "OpenAI"] },
  { title: "ChatGPT Learn", href: "https://learn.chatgpt.com/docs/developers", category: "AI 与模型", tags: ["AI", "文档", "开发"] },
  { title: "ChatGPT 下载", href: "https://chatgpt.com/zh-Hans-CN/download/?utm_source=chatgpt.com", category: "AI 与模型", tags: ["AI", "桌面端", "OpenAI"] },
  { title: "百炼控制台", href: "https://bailian.console.aliyun.com/cn-beijing?tab=model#/model-market", category: "AI 与模型", tags: ["AI", "阿里云", "模型"] },
  { title: "New API", href: "https://besai.top/login", category: "AI 与模型", tags: ["AI", "API", "服务"] },
  { title: "QweApi", href: "https://qweapi.com/console/token", category: "AI 与模型", tags: ["API", "令牌", "服务"] },

  { title: "GitHub Skills Catalog", href: "https://github.com/openai/skills", category: "开发工具", tags: ["GitHub", "Codex", "OpenAI"] },
  { title: "Node.js 中文下载", href: "https://nodejs.org/zh-cn/download", category: "开发工具", tags: ["Node.js", "运行环境"] },
  { title: "Node.js Download", href: "https://nodejs.org/en/download", category: "开发工具", tags: ["Node.js", "Runtime"] },
  { title: "腾讯云 TCCLI", href: "https://cloud.tencent.com/document/product/440/34011", category: "开发工具", tags: ["腾讯云", "CLI", "文档"] },
  { title: "机遇屋 SQL Server", href: "https://www.jiyuwu.com/Article/SOSOList?myKey=SQL%20SERVER%20", category: "开发工具", tags: ["SQL Server", "数据库"] },
  { title: "Codex 中文语言包", href: "https://github.com/XQNODE/CODEX-ZH-CN", category: "开发工具", tags: ["Codex", "GitHub", "中文"] },
  { title: "Codex 中文版 Release", href: "https://github.com/xqnode/codex-zh-CN/releases/tag/v0.1.2", category: "开发工具", tags: ["Codex", "GitHub", "下载"] },
  { title: "Codex Desktop 汉化", href: "https://github.com/FOMO-RUN/codex-desktop-zh-cn-portable", category: "开发工具", tags: ["Codex", "GitHub", "工具"] },
  { title: "OpenAI Codex", href: "https://openai.com/zh-Hans-CN/codex/", category: "开发工具", tags: ["Codex", "OpenAI", "工程"] },

  { title: "汽水音乐合作平台", href: "https://music.douyin.com/?pop-login=true&business_home_login_redirect=%2Fconsole%2Fpublish-video", category: "创作与效率", tags: ["音乐", "抖音", "创作"] },
  { title: "抖音音乐创作实验室", href: "https://music.douyin.com/studio/create", category: "创作与效率", tags: ["音乐", "AI", "抖音"] },
  { title: "CC Switch", href: "https://ccswitch.io/zh/", category: "创作与效率", tags: ["AI", "编程", "管理"] },

  { title: "Google Workspace", href: "https://workspace.google.com/intl/zh-CN/gmail/", category: "常用服务", tags: ["Google", "邮箱", "办公"] },
  { title: "2FA Auth", href: "https://2fa.fun/", category: "常用服务", tags: ["验证器", "工具", "安全"] },
  { title: "China-Nav", href: "https://china-nav.app/", category: "常用服务", tags: ["学习", "导航", "工具"] },
];

const categories = ["全部", "AI 与模型", "开发工具", "创作与效率", "常用服务", "常用"];
const initialPinned = bookmarks
  .filter(({ title }) => ["ChatGPT", "扣子编程", "DeepSeek 登录", "OpenAI API", "GitHub Skills Catalog"].includes(title))
  .map(({ href }) => href);
const palette = ["#d96748", "#176a59", "#4169a9", "#985b80", "#bd842f", "#4b7984"];

const state = {
  category: "全部",
  query: "",
  pinned: new Set(loadPinned()),
};

const filterBar = document.querySelector("#filter-bar");
const linksArea = document.querySelector("#links-area");
const favoritesSection = document.querySelector("#favorites-section");
const favoritesGrid = document.querySelector("#favorites-grid");
const favoritesCount = document.querySelector("#favorites-count");
const searchInput = document.querySelector("#search-input");
const cardTemplate = document.querySelector("#link-card-template");

function loadPinned() {
  try {
    const saved = JSON.parse(localStorage.getItem("my-nav-pinned"));
    return Array.isArray(saved) ? saved : initialPinned;
  } catch {
    return initialPinned;
  }
}

function savePinned() {
  localStorage.setItem("my-nav-pinned", JSON.stringify([...state.pinned]));
}

function getHost(href) {
  return new URL(href).hostname.replace(/^www\./, "");
}

function iconUrl(href) {
  const localIcon = globalThis.bookmarkIcons?.[getHost(href)];
  return localIcon || `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(href)}`;
}

function colorFor(host) {
  let value = 0;
  for (const char of host) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return palette[value % palette.length];
}

function initialFor(bookmark) {
  const ascii = bookmark.title.match(/[A-Za-z0-9]/);
  return ascii ? ascii[0].toUpperCase() : bookmark.title[0];
}

function createCard(bookmark) {
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".link-card");
  const link = fragment.querySelector(".link-card-main");
  const image = fragment.querySelector("img");
  const fallback = fragment.querySelector(".icon-fallback");
  const title = fragment.querySelector("strong");
  const host = getHost(bookmark.href);
  const pinButton = fragment.querySelector(".pin-button");

  link.href = bookmark.href;
  link.title = `${bookmark.title} · ${host}`;
  image.src = iconUrl(bookmark.href);
  image.addEventListener("error", () => image.remove());
  fallback.textContent = initialFor(bookmark);
  fallback.style.setProperty("--icon-color", colorFor(host));
  title.textContent = bookmark.title;
  fragment.querySelector("small").textContent = host;

  const isPinned = state.pinned.has(bookmark.href);
  pinButton.classList.toggle("is-pinned", isPinned);
  pinButton.textContent = isPinned ? "★" : "☆";
  pinButton.setAttribute("aria-label", isPinned ? "从常用移除" : "添加到常用");
  pinButton.title = pinButton.getAttribute("aria-label");
  pinButton.addEventListener("click", () => {
    if (state.pinned.has(bookmark.href)) state.pinned.delete(bookmark.href);
    else state.pinned.add(bookmark.href);
    savePinned();
    render();
  });

  return card;
}

function createSection(category, items) {
  const section = document.createElement("section");
  section.className = "bookmark-section";
  section.setAttribute("aria-labelledby", `heading-${category}`);
  section.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${category === "AI 与模型" ? "INTELLIGENCE" : category === "开发工具" ? "BUILD" : category === "创作与效率" ? "CREATE" : "ESSENTIALS"}</p>
        <h2 id="heading-${category}">${category}</h2>
      </div>
      <span class="section-count">${items.length} 个链接</span>
    </div>
    <div class="link-grid"></div>
  `;
  const grid = section.querySelector(".link-grid");
  items.forEach((bookmark) => grid.append(createCard(bookmark)));
  return section;
}

function matches(bookmark) {
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  return [bookmark.title, bookmark.category, getHost(bookmark.href), ...bookmark.tags]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function renderFilters() {
  filterBar.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category;
    button.classList.toggle("is-active", state.category === category);
    button.setAttribute("aria-pressed", String(state.category === category));
    button.addEventListener("click", () => {
      state.category = category;
      render();
    });
    filterBar.append(button);
  });
}

function renderFavorites() {
  const favorites = bookmarks.filter((bookmark) => state.pinned.has(bookmark.href));
  const shouldShow = favorites.length > 0 && state.category !== "常用" && !state.query;
  favoritesSection.hidden = !shouldShow;
  if (!shouldShow) return;
  favoritesCount.textContent = `${favorites.length} 个链接`;
  favoritesGrid.replaceChildren(...favorites.map(createCard));
}

function render() {
  renderFilters();
  renderFavorites();
  linksArea.replaceChildren();

  const filtered = bookmarks.filter((bookmark) => {
    const categoryMatches = state.category === "全部" || bookmark.category === state.category || (state.category === "常用" && state.pinned.has(bookmark.href));
    return categoryMatches && matches(bookmark);
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = "<strong>没有找到匹配的链接</strong><span>换个关键词试试</span>";
    linksArea.append(empty);
    return;
  }

  if (state.category === "全部" && !state.query) {
    ["AI 与模型", "开发工具", "创作与效率", "常用服务"].forEach((category) => {
      const items = filtered.filter((bookmark) => bookmark.category === category);
      if (items.length) linksArea.append(createSection(category, items));
    });
  } else {
    const label = state.category === "全部" ? "搜索结果" : state.category;
    linksArea.append(createSection(label, filtered));
  }
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelector("#bookmark-count").textContent = `${bookmarks.length} 个链接`;
document.querySelector("#current-date").textContent = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "short",
}).format(new Date());

render();
