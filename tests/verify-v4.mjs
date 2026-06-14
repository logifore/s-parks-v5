import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const projectRoot = "/Users/ylfy/Desktop/workspace/sparks-v4";
const jsRoot = path.join(projectRoot, "assets/js");
const cssPath = path.join(projectRoot, "assets/css/styles.css");
const appPath = path.join(jsRoot, "app.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadRuntime() {
  const context = { window: {}, console };
  vm.createContext(context);
  ["content.js", "utils.js", "renderers.js"].forEach((file) => {
    const source = fs.readFileSync(path.join(jsRoot, file), "utf8");
    vm.runInContext(source, context, { filename: file });
  });
  context.window.SparksRouter = {
    hrefFor(route, value) {
      if (!value) return `#${route}`;
      return `#${route}?id=${encodeURIComponent(value)}`;
    }
  };
  return {
    content: context.window.SPARKS_CONTENT,
    renderers: context.window.SparksRenderers.renderers
  };
}

function countOccurrences(text, pattern) {
  return (text.match(new RegExp(pattern, "g")) || []).length;
}

function checkHome(renderers, content, state, css) {
  const html = renderers.home(content, state);
  assert(html.includes("home-vision-stack"), "首页缺少右侧卡片容器");
  assert(countOccurrences(html, "home-vision-card home-vision-card-") === 3, "首页右侧卡片数量不是 3");
  assert(css.includes(".home-vision-stack {\n  display: grid;"), "首页右侧卡片容器未使用网格布局");
  const homeCardBlock = css.slice(css.indexOf(".home-vision-card {"), css.indexOf(".home-vision-card-1"));
  assert(!homeCardBlock.includes("position: absolute"), "首页右侧卡片仍然是 absolute 布局");
}

function checkCreatorMenu(appSource, css) {
  assert(appSource.includes("浏览创作者"), "导航中缺少浏览创作者入口");
  assert(appSource.includes("成为创作者"), "导航中缺少成为创作者入口");
  assert(appSource.includes("#creator-onboarding"), "导航分流没有链接到成为创作者页面");
  assert(appSource.includes("setCreatorMenuOpen(false, true)"), "导航下拉缺少 1 秒暂留逻辑");
  assert(css.includes('.nav-item-with-submenu[data-open="true"] .nav-submenu'), "导航下拉缺少持久展开状态样式");
}

function checkAssets(renderers, content, state, css) {
  const html = renderers.assets(content, state);
  const sparseHtml = renderers.assets(content, { ...state, selectedCategory: "分镜脚本" });
  assert(content.assets.items.length >= 10, "素材数量仍然过少");
  assert(html.includes("asset-library-grid"), "素材页缺少新版素材网格");
  assert(countOccurrences(html, "asset-library-card") >= 8, "素材页展示的素材卡片数量过少");
  assert(html.includes("新建分类"), "素材页缺少左侧新版操作区");
  assert(sparseHtml.includes("Asset Render Pending"), "素材不足时缺少占位卡片");
  assert(css.includes("position: sticky;"), "素材页左侧导航未固定");
  assert(css.includes(".asset-toolbar-button"), "素材页筛选按钮未限制统一尺寸");
}

function checkLightPages(renderers, content, state, css) {
  const accountHtml = renderers.account(content, state);
  assert(accountHtml.includes("account-creator-frame"), "个人主页缺少居中的创作者入口边框");
  assert(accountHtml.includes("account-entry-actions"), "个人主页缺少双入口区域");
  assert(accountHtml.includes("进入创作者主页"), "个人主页缺少进入创作者主页入口");
  assert(accountHtml.includes("立即申请"), "个人主页缺少申请成为创作者入口");
  assert(css.includes(".account-panel strong span"), "个人主页优惠券数字与说明未单独处理字号");
  assert(css.includes('body[data-page-tone="light"] #particle-canvas'), "浅色页面未处理粒子层隐藏");
  assert(css.includes('body[data-page-tone="light"] .site-nav a'), "浅色页面未处理导航文字颜色");
}

function checkCreatorVariants(renderers, content, state) {
  const darkHtml = renderers.creator(content, { ...state, activeCreatorId: "marcus-thorne", creatorTab: "works" });
  const studioHtml = renderers.creator(content, { ...state, activeCreatorId: "aria-jin", creatorTab: "works" });
  const galleryHtml = renderers.creator(content, { ...state, activeCreatorId: "elena-voss", creatorTab: "works" });
  assert(darkHtml.includes("creator-tools-banner"), "暗色创作者主页结构缺失");
  assert(studioHtml.includes("creator-studio-shell"), "专业创作者主页结构缺失");
  assert(galleryHtml.includes("creator-gallery-shell"), "白底创作者主页结构缺失");
}

function checkOnboarding(renderers, content, state) {
  const html = renderers["creator-onboarding"](content, state);
  assert(html.includes("onboarding-shell"), "成为创作者页面未接入");
  assert(html.includes("开始申请流程"), "成为创作者页 CTA 缺失");
}

function main() {
  const { content, renderers } = loadRuntime();
  const css = fs.readFileSync(cssPath, "utf8");
  const appSource = fs.readFileSync(appPath, "utf8");
  const state = {
    query: "",
    selectedCategory: "全部",
    sceneTime: "day",
    creatorTab: "works",
    projects: content.projects,
    downloadRecords: content.downloads.records,
    downloadActivity: content.downloads.activity,
    downloadQueue: content.downloads.queue,
    pointsBalance: 10000,
    detailAssetId: content.assets.items[0].id,
    activeCreatorId: "marcus-thorne"
  };

  checkHome(renderers, content, state, css);
  checkCreatorMenu(appSource, css);
  checkAssets(renderers, content, state, css);
  checkLightPages(renderers, content, state, css);
  checkCreatorVariants(renderers, content, state);
  checkOnboarding(renderers, content, state);

  console.log("verify-v4: ok");
}

main();
