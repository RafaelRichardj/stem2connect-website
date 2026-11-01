const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  const compactNav = matchMedia("(max-width: 1320px)");
  const setMenu = (open, restoreFocus = false) => {
    const isOpen = compactNav.matches && open;
    navLinks.classList.toggle("active", isOpen);
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navLinks.inert = compactNav.matches && !isOpen;
    document.body.classList.toggle("nav-open", isOpen);
    if (restoreFocus) navToggle.focus({ preventScroll: true });
  };
  navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (!navLinks.classList.contains("active")) return;
    if (event.key === "Escape") setMenu(false, true);
    if (event.key === "Tab") {
      const last = navLinks.querySelector(":scope > li:last-child > a");
      if (event.shiftKey && document.activeElement === navToggle) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); navToggle.focus();
      }
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".navbar") && navLinks.classList.contains("active")) setMenu(false);
  });
  compactNav.addEventListener("change", () => setMenu(false));
  setMenu(false);
}

const isResourcesPage = Boolean(document.querySelector(".resources-hero"));

if (isResourcesPage) {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const resetResourcesScroll = () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  resetResourcesScroll();

  window.addEventListener("DOMContentLoaded", resetResourcesScroll);
  window.addEventListener("load", () => {
    resetResourcesScroll();

    setTimeout(resetResourcesScroll, 50);
    setTimeout(resetResourcesScroll, 250);
    setTimeout(resetResourcesScroll, 750);
  });

  window.addEventListener("pageshow", resetResourcesScroll);
}


function extractYouTubeVideoId(embedSrc) {
  if (!embedSrc) return null;

  try {
    const url = new URL(embedSrc, window.location.origin);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const shortId = url.pathname.split("/").filter(Boolean)[0];
      return shortId && shortId.length === 11 ? shortId : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname.includes("/embed/")) {
        const parts = url.pathname.split("/embed/");
        const id = parts[1] ? parts[1].split("/")[0] : "";
        return id && id.length === 11 ? id : null;
      }

      const idFromQuery = url.searchParams.get("v");
      return idFromQuery && idFromQuery.length === 11 ? idFromQuery : null;
    }
  } catch {
    const fallbackMatch = embedSrc.match(/(?:embed\/|youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/);
    return fallbackMatch ? fallbackMatch[1] : null;
  }

  return null;
}

function getYouTubeThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function extractSpeakerName(text) {
  if (!text) return null;

  const patterns = [
    /\bwith\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,4})\b/i,
    /\bby\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,4})\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (!/stem2connect/i.test(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

function getCardText(card, selector) {
  if (!card) return "";
  const element = card.querySelector(selector);
  return element ? element.textContent.trim() : "";
}

function normalizeDateString(rawValue) {
  if (!rawValue) return null;
  const trimmed = rawValue.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function buildVideoObjectFromIframe(iframe, index) {
  const videoId = extractYouTubeVideoId(iframe.getAttribute("src"));
  if (!videoId) return null;

  const card = iframe.closest(".webinar-card, article");
  const title =
    getCardText(card, "h3, h2, h4") ||
    iframe.getAttribute("title") ||
    `STEM2Connect Webinar ${index + 1}`;

  const description =
    getCardText(card, "p") ||
    iframe.getAttribute("aria-label") ||
    `Watch ${title} by STEM2Connect.`;

  const speaker =
    (card && card.getAttribute("data-speaker")) ||
    iframe.getAttribute("data-speaker") ||
    extractSpeakerName(title) ||
    extractSpeakerName(iframe.getAttribute("title"));

  const uploadDate = normalizeDateString(
    (card && card.getAttribute("data-upload-date")) ||
    iframe.getAttribute("data-upload-date") ||
    ""
  );

  const contentUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const videoObject = {
    "@type": "VideoObject",
    "@id": `${contentUrl}#video`,
    name: title,
    description,
    thumbnailUrl: [getYouTubeThumbnailUrl(videoId)],
    embedUrl,
    contentUrl,
    publisher: { "@id": "https://www.stem2connect.org/#organization" }
  };

  if (uploadDate) {
    videoObject.uploadDate = uploadDate;
  }

  if (speaker) {
    videoObject.creator = {
      "@type": "Person",
      name: speaker
    };
  }

  return { videoId, videoObject };
}

function injectWebinarVideoSchema() {
  const existingSchemaNode = document.getElementById("stem2connect-webinar-video-schema");
  const youtubeEmbedIframes = document.querySelectorAll(
    "iframe[src*='youtube.com/embed'], iframe[src*='youtube-nocookie.com/embed']"
  );

  if (!youtubeEmbedIframes.length) {
    if (existingSchemaNode) {
      existingSchemaNode.remove();
    }
    return;
  }

  const seenVideoIds = new Set();
  const videoObjects = [];

  youtubeEmbedIframes.forEach((iframe, index) => {
    const built = buildVideoObjectFromIframe(iframe, index);
    if (!built) return;
    if (seenVideoIds.has(built.videoId)) return;

    seenVideoIds.add(built.videoId);
    videoObjects.push(built.videoObject);
  });

  if (!videoObjects.length) {
    if (existingSchemaNode) {
      existingSchemaNode.remove();
    }
    return;
  }

  const organization = {
    "@type": "Organization",
    "@id": "https://www.stem2connect.org/#organization",
    name: "STEM2Connect",
    url: "https://www.stem2connect.org",
    logo: "https://www.stem2connect.org/assets/logo.jpg"
  };

  const schemaPayload = {
    "@context": "https://schema.org",
    "@graph": [organization, ...videoObjects]
  };

  const schemaNode = existingSchemaNode || document.createElement("script");
  schemaNode.id = "stem2connect-webinar-video-schema";
  schemaNode.type = "application/ld+json";
  schemaNode.textContent = JSON.stringify(schemaPayload, null, 2);

  if (!existingSchemaNode) {
    document.head.appendChild(schemaNode);
  }
}

function createLocalFallback(videoId, title) {
  const link = document.createElement("a");
  link.className = "video-fallback";
  link.href = `https://www.youtube.com/watch?v=${videoId}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${title || "Webinar"} (open on YouTube)`);

  const image = document.createElement("img");
  image.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  image.alt = `${title || "Webinar"} thumbnail`;
  image.loading = "lazy";

  const label = document.createElement("span");
  label.className = "video-fallback-label";
  label.textContent = "Open on YouTube";

  link.append(image, label);
  return link;
}

injectWebinarVideoSchema();

const youtubeIframes = document.querySelectorAll(
  ".video-wrap iframe[src*='youtube.com/embed'], .video-wrap iframe[src*='youtube-nocookie.com/embed']"
);

youtubeIframes.forEach((iframe) => {
  const videoId = extractYouTubeVideoId(iframe.getAttribute("src"));
  if (!videoId) return;

  if (window.location.protocol === "file:") {
    const wrapper = iframe.closest(".video-wrap");
    if (wrapper) {
      wrapper.replaceChildren(createLocalFallback(videoId, iframe.getAttribute("title")));
    }
  }
});

// Entrance animations are provided by motion.js.

// Smooth 'Back to top' behavior: override anchor and scroll to very top.
const backToTopLink = document.querySelector('a[href="#top"]');
if (backToTopLink) {
  backToTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}