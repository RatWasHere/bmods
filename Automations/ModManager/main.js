const fs = require("node:fs");
const path = require("node:path");

const REGISTRY_URL =
  "https://raw.githubusercontent.com/RatWasHere/bmods/refs/heads/master/registry.json";
const BASE_DOWNLOAD_URL =
  "https://raw.githubusercontent.com/RatWasHere/bmods/refs/heads/master";
const INSTALLED_PATH = path.join(__dirname, "installed.json");

const TYPE_PATHS = {
  Actions: path.join(__dirname, "..", "..", "AppData", "Actions"),
  Events: path.join(__dirname, "..", "..", "AppData", "Events"),
  Automations: path.join(__dirname, "..", "..", "Automations"),
  Themes: path.join(__dirname, "..", "..", "Themes"),
  Translations: path.join(__dirname, "..", "..", "Translations"),
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Reads and returns the contents of installed.json as an object.
 * @returns {Object} An object representing installed mods/data.
 */
function getInstalledData() {
  try {
    return fs.existsSync(INSTALLED_PATH)
      ? JSON.parse(fs.readFileSync(INSTALLED_PATH, "utf-8"))
      : {};
  } catch (error) {
    console.error("Error reading installed data:", error);
    return {};
  }
}

/**
 * Writes the given data to installed.json.
 * @param {Object} data - The data to be saved for installed mods.
 */
function saveInstalledData(data) {
  try {
    fs.writeFileSync(INSTALLED_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving installed data:", error);
  }
}

/**
 * Fetches and returns the entire registry JSON from a remote URL.
 * @returns {Promise<Object>} The fetched registry JSON.
 */
async function fetchRegistry() {
  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok)
      throw new Error(`Failed to fetch registry: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching registry:", error);
    return {};
  }
}

/**
 * Fetches text content from a given URL.
 * @param {string} url - The file URL to fetch.
 * @returns {Promise<string|null>} The file contents or null on error.
 */
async function fetchFileContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch file: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Checks if a mod is installed based on installed data.
 * @param {string} mod - The mod key or filename.
 * @param {string} type - The mod type (e.g. "Actions", "Themes").
 * @returns {boolean} True if the mod is installed, otherwise false.
 */
function isInstalled(mod, type) {
  const installedData = getInstalledData();
  const normalizedType = capitalizeFirstLetter(type);
  return Boolean(installedData[normalizedType]?.[mod]);
}

/**
 * Determines if a mod is outdated by comparing installed.json md5 with registry md5.
 * @param {string} mod - The mod key or filename.
 * @param {string} type - The mod type (e.g. "Actions", "Themes").
 * @param {Object} registry - The full registry object.
 * @returns {boolean} True if the mod is outdated, otherwise false.
 */
function isOutdated(mod, type, registry) {
  const installedData = getInstalledData();
  const normalizedType = capitalizeFirstLetter(type);

  // Check if mod is installed
  if (!installedData[normalizedType] || !installedData[normalizedType][mod])
    return false;

  const installedMd5 = installedData[normalizedType][mod].md5;
  const registryMd5 = registry[normalizedType]?.[mod]?.md5;

  // If either md5 is missing, not outdated
  if (!installedMd5 || !registryMd5) return false;

  return installedMd5 !== registryMd5;
}

/**
 * Installs a theme by creating/writing theme files.
 * @param {string} mod - The theme key/filename.
 * @param {Object} registry - The full registry object.
 * @returns {Promise<Object>} An empty object.
 */
async function installTheme(mod, registry) {
  try {
    const themeName = mod.replace(/\.[^/.]+$/, "");
    const targetDir = TYPE_PATHS.Themes;
    const themeDir = path.join(targetDir, themeName);
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir, { recursive: true });
    }
    const dataUrl = `${BASE_DOWNLOAD_URL}/Themes/${themeName}/data.json`;
    const dataContent = await fetchFileContent(dataUrl);
    if (!dataContent) throw new Error("Failed to fetch theme data.json");
    fs.writeFileSync(path.join(themeDir, "data.json"), dataContent, "utf-8");
    const cssUrl = `${BASE_DOWNLOAD_URL}/Themes/${themeName}/theme.css`;
    const cssContent = await fetchFileContent(cssUrl);
    if (!cssContent) throw new Error("Failed to fetch theme.css");
    fs.writeFileSync(path.join(themeDir, "theme.css"), cssContent, "utf-8");
    return {};
  } catch (error) {
    console.error(`Error installing theme ${mod}:`, error);
    throw error;
  }
}

/**
 * Installs a translation by creating/writing translation files.
 * @param {string} mod - The translation key/filename.
 * @param {Object} registry - The full registry object.
 * @returns {Promise<Object>} An empty object.
 */
async function installTranslation(mod, registry) {
  try {
    const translationName = mod.replace(/\.[^/.]+$/, "");
    const targetDir = TYPE_PATHS.Translations;
    const translationDir = path.join(targetDir, translationName);
    if (!fs.existsSync(translationDir)) {
      fs.mkdirSync(translationDir, { recursive: true });
    }
    const dataUrl = `${BASE_DOWNLOAD_URL}/Translations/${translationName}/data.json`;
    const dataContent = await fetchFileContent(dataUrl);
    if (!dataContent) throw new Error("Failed to fetch translation data.json");
    fs.writeFileSync(
      path.join(translationDir, "data.json"),
      dataContent,
      "utf-8"
    );
    const stringsUrl = `${BASE_DOWNLOAD_URL}/Translations/${translationName}/strings.json`;
    const stringsContent = await fetchFileContent(stringsUrl);
    if (!stringsContent) throw new Error("Failed to fetch strings.json");
    fs.writeFileSync(
      path.join(translationDir, "strings.json"),
      stringsContent,
      "utf-8"
    );
    return {};
  } catch (error) {
    console.error(`Error installing translation ${mod}:`, error);
    throw error;
  }
}

/**
 * Installs an automation by creating/writing automation files or folder.
 * @param {string} mod - The automation key (file or directory).
 * @param {Object} registry - The full registry object.
 * @returns {Promise<Object>} An empty object.
 */
async function installAutomation(mod, registry) {
  try {
    const automationName = mod.replace(/\.[^/.]+$/, "");
    const targetDir = TYPE_PATHS.Automations;
    const isFolder = !mod.includes(".");
    if (isFolder) {
      const automationDir = path.join(targetDir, automationName);
      if (!fs.existsSync(automationDir)) {
        fs.mkdirSync(automationDir, { recursive: true });
      }
      const commonFiles = ["index.js", "config.json"];
      for (const file of commonFiles) {
        const fileUrl = `${BASE_DOWNLOAD_URL}/Automations/${automationName}/${file}`;
        const fileContent = await fetchFileContent(fileUrl);
        if (fileContent) {
          fs.writeFileSync(
            path.join(automationDir, file),
            fileContent,
            "utf-8"
          );
        }
      }
      return {};
    } else {
      const fileUrl = `${BASE_DOWNLOAD_URL}/Automations/${mod}`;
      const fileContent = await fetchFileContent(fileUrl);
      if (!fileContent) throw new Error(`Failed to fetch automation ${mod}`);
      const targetPath = path.join(targetDir, mod);
      fs.writeFileSync(targetPath, fileContent, "utf-8");
      return {};
    }
  } catch (error) {
    console.error(`Error installing automation ${mod}:`, error);
    throw error;
  }
}

/**
 * Installs a mod by determining type, fetching files, and saving them.
 * Updates installed.json with the registry md5 (no local calculation).
 * @param {string} mod - The mod key or filename.
 * @param {string} type - The mod type (e.g. "Actions", "Themes").
 * @param {Object} registry - The full registry object.
 * @returns {Promise<boolean>} True if install succeeded, otherwise false.
 */
async function installMod(mod, type, registry) {
  try {
    const normalizedType = capitalizeFirstLetter(type);
    switch (normalizedType) {
      case "Themes":
        await installTheme(mod, registry);
        break;
      case "Translations":
        await installTranslation(mod, registry);
        break;
      case "Automations":
        await installAutomation(mod, registry);
        break;
      default: {
        const url = `${BASE_DOWNLOAD_URL}/${normalizedType}/${mod}`;
        const source = await fetchFileContent(url);
        if (!source) throw new Error(`Failed to fetch ${mod}`);
        const targetDir = TYPE_PATHS[normalizedType];
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetPath = path.join(targetDir, mod);
        fs.writeFileSync(targetPath, source, "utf-8");
        break;
      }
    }

    const installedData = getInstalledData();
    if (!installedData[normalizedType]) {
      installedData[normalizedType] = {};
    }
    const modData = registry[normalizedType]?.[mod] || {};
    installedData[normalizedType][mod] = {
      md5: modData.md5,
      name: modData.name || mod,
      category: modData.category || " ",
      author: modData.creator || modData.author || "Unknown",
      description: modData.description || " ",
    };

    saveInstalledData(installedData);
    console.log(`Installed ${mod} to ${normalizedType}`);

    // Mark this mod as installed in the UI without full reload
    const currentTab = document
      .querySelector(".tab-button.active")
      ?.id.replace("-button", "");
    markModAsInstalled(mod, currentTab);

    return true;
  } catch (error) {
    console.error(`Error installing mod ${mod}:`, error);
    return false;
  }
}

/**
 * Marks a mod as installed in the UI without a full reload.
 * @param {string} mod - The mod key or filename.
 * @param {string} currentTab - The current active tab ID.
 */
function markModAsInstalled(mod, currentTab) {
  // Find the card for this mod in the current view
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    if (card.dataset.modId === mod) {
      card.classList.add("installed");
      // Remove outdated class if present
      card.classList.remove("outdated");

      // Update the icon
      const iconElement = card.querySelector(".icon");
      if (iconElement) {
        iconElement.innerHTML = getCheckmarkIcon();
      }
    }
  });
}

/**
 * Creates a card element for a mod, including icon and event listeners.
 * @param {string} key - The mod key or filename.
 * @param {Object} value - The mod data (name, category, etc.).
 * @param {string} type - The mod type (e.g. "Actions", "Themes").
 * @param {boolean} isInstalledMod - True if the mod is installed.
 * @param {boolean} isOutdatedMod - True if the mod is outdated.
 * @returns {HTMLDivElement} The created card element.
 */
function createCard(key, value, type, isInstalledMod, isOutdatedMod) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.modId = key;

  if (isInstalledMod) card.classList.add("installed");
  if (isOutdatedMod) card.classList.add("outdated");

  const name = value.name || key;
  const category = value.category || " ";
  const description = value.description || " ";
  const author = value.creator || value.author || "Unknown";

  let iconHtml = "";
  if (isInstalledMod && !isOutdatedMod) {
    iconHtml = getTrashIcon();
  } else {
    iconHtml = getDownloadIcon();
  }

  card.innerHTML = `
    <p class="title">${name}</p>
    <p class="category">${category}</p>
    <p class="description">${description}</p>
    <p class="author">by ${author}</p>
    <a class="icon">${iconHtml}</a>
  `;

  const iconElement = card.querySelector(".icon");
  if (isInstalledMod && !isOutdatedMod) {
    iconElement.addEventListener("click", () => {
      deleteMod(key, type);
    });
  } else {
    iconElement.addEventListener("click", async () => {
      iconElement.innerHTML = getLoadingIcon();
      const registry = await fetchRegistry();
      const success = await installMod(key, type, registry);
      iconElement.innerHTML = success ? getCheckmarkIcon() : getErrorIcon();
      if (!success)
        setTimeout(() => {
          iconElement.innerHTML = getDownloadIcon();
        }, 3000);
    });
  }

  return card;
}

/**
 * Returns an SVG string for the download icon.
 * @returns {string} SVG string for the download icon.
 */
function getDownloadIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z"/>
  </svg>`;
}

/**
 * Returns an SVG string for the checkmark icon.
 * @returns {string} SVG string for the checkmark icon.
 */
function getCheckmarkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
  </svg>`;
}

/**
 * Returns an SVG string for the loading/spinner icon.
 * @returns {string} SVG string for the loading icon.
 */
function getLoadingIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 loading-icon">
    <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
  </svg>`;
}

/**
 * Returns an SVG string for a trash/delete icon.
 * @returns {string} SVG string for the trash icon.
 */
function getTrashIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="size-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>`;
}

/**
 * Returns an SVG string for an error icon.
 * @returns {string} SVG string for the error icon.
 */
function getErrorIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-red-500">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
  </svg>`;
}

/**
 * Installs all mods from the registry if they are not already installed.
 * @param {Object} registry - The full registry object.
 */
async function installAllMods(registry) {
  // For each known mod type in the registry
  const modTypes = [
    "Actions",
    "Events",
    "Automations",
    "Themes",
    "Translations",
  ];
  for (const type of modTypes) {
    const typeData = registry[type] || {};
    for (const mod in typeData) {
      if (!isInstalled(mod, type.toLowerCase())) {
        console.log(`Installing '${mod}' in ${type}...`);
        await installMod(mod, type.toLowerCase(), registry);
      }
    }
  }
  // Optionally, switch to an existing 'installed' tab if needed
  displayTab("installed", registry);
}

/**
 * Deletes all installed mods by looping through installed.json and calling deleteMod for each entry.
 */
async function deleteAllMods() {
  const installedData = getInstalledData();
  for (const type in installedData) {
    for (const mod in installedData[type]) {
      try {
        deleteMod(mod, type.toLowerCase());
      } catch (err) {
        console.error(`Failed to delete mod '${mod}' in type '${type}':`, err);
      }
    }
  }
}

/**
 * Displays a specific tab of mods (actions, events, installed, etc.).
 * Fetches the installed or registry data, then creates mod cards.
 * @param {string} tabName - The name of the tab to display.
 * @param {Object} registry - The full registry object.
 */
function displayTab(tabName, registry) {
  const content = document.getElementById("mod-content");
  const scrollPosition = content.scrollTop;
  content.innerHTML = "";

  let tabData;

  if (tabName === "installed") {
    const installAllButton = document.createElement("button");
    installAllButton.textContent = "Install All Mods";
    installAllButton.style = `
      position: absolute; bottom: 48px; left: 8px;
      color: #9d9d9d; background: var(--dark-main);
      display: inline-block; backdrop-filter: blur(30px);
    `;
    installAllButton.addEventListener("click", async () => {
      installAllButton.disabled = true;
      installAllButton.textContent = "Installing...";
      await installAllMods(registry);
      installAllButton.disabled = false;
      installAllButton.textContent = "Install All Mods";
    });
    content.appendChild(installAllButton);

    const deleteAllButton = document.createElement("button");
    deleteAllButton.textContent = "Delete All Mods";
    deleteAllButton.style = `
      position: absolute; bottom: 8px; left: 8px;
      color: #9d9d9d; background: var(--dark-main);
      display: inline-block; backdrop-filter: blur(30px);
    `;
    deleteAllButton.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete all mods?")) return;
      deleteAllButton.disabled = true;
      deleteAllButton.textContent = "Deleting...";
      await deleteAllMods();
      deleteAllButton.disabled = false;
      deleteAllButton.textContent = "Delete All Mods";
      // Refresh the installed tab
      displayTab("installed", registry);
    });
    content.appendChild(deleteAllButton);

    // Use installed.json data
    tabData = getInstalledData();
  } else {
    // Use registry data
    const normalizedTabName = capitalizeFirstLetter(tabName);
    tabData = registry[normalizedTabName] || {};
  }

  // If empty, show a message
  if (!tabData || Object.keys(tabData).length === 0) {
    const message = document.createElement("h1");
    message.textContent = "Nothing here...";
    message.style.textAlign = "center";
    message.style.position = "absolute";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "2rem";
    message.style.fontWeight = "bold";
    message.style.color = "white";
    content.appendChild(message);
    return;
  }

  // Create a fragment to improve performance
  const fragment = document.createDocumentFragment();

  if (tabName === "installed") {
      const sortedMods = [];

      Object.entries(tabData).forEach(([type, mods]) => {
          Object.entries(mods).forEach(([modKey, modValue]) => {
              const isOutdatedMod = isOutdated(modKey, type, registry);
              sortedMods.push({
                  modKey,
                  modValue,
                  type,
                  isOutdatedMod,
              });
          });
      });

      sortedMods.sort((a, b) => {
          if (a.isOutdatedMod && !b.isOutdatedMod) return -1;
          if (!a.isOutdatedMod && b.isOutdatedMod) return 1;
          return 0;
      });

      sortedMods.forEach(({
          modKey,
          modValue,
          type,
          isOutdatedMod
      }) => {
          const card = createCard(modKey, modValue, type, true, isOutdatedMod);
          fragment.appendChild(card);
      });
  } else {
      Object.entries(tabData).forEach(([key, value]) => {
          const isInstalledMod = isInstalled(key, tabName);
          const isOutdatedMod = isOutdated(key, tabName, registry);
          const card = createCard(
              key,
              value,
              tabName,
              isInstalledMod,
              isOutdatedMod
          );
          fragment.appendChild(card);
      });
  }

  content.appendChild(fragment);
  content.scrollTop = scrollPosition;
  }

/**
 * Initializes the mod manager UI, sets up tab switching and search.
 * @param {Object} registry - The fetched registry data.
 */
function initializeModManager(registry) {
  // Set up tab switching
  const tabs = [
    "actions",
    "events",
    "automations",
    "themes",
    "translations",
    "installed",
  ];

  tabs.forEach((tab) => {
    const button = document.getElementById(`${tab}-button`);
    if (button) {
      button.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach((t) => {
          document.getElementById(`${t}-button`)?.classList.remove("active");
        });

        // Add active class to clicked tab
        button.classList.add("active");

        // Display content for the selected tab
        displayTab(tab, registry);
      });
    }
  });

  // Initialize search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const title =
          card.querySelector(".title")?.textContent.toLowerCase() || "";
        const author =
          card.querySelector(".author")?.textContent.toLowerCase() || "";
        const category =
          card.querySelector(".category")?.textContent.toLowerCase() || "";

        const isVisible =
          title.includes(query) ||
          author.includes(query) ||
          category.includes(query);

        card.style.display = isVisible ? "" : "none";
      });
    });
  }

  // Set up close button
  const closeButton = document.getElementById("closeModManager");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      document.getElementById("modManagerWindow")?.remove();
    });
  }

  // Default to first tab
  displayTab("actions", registry);
}

/**
 * Creates and displays the main UI window for the mod manager.
 * @returns {boolean} True if the window was created, otherwise false.
 */
function createModManagerWindow() {
  if (document.getElementById("modManagerWindow")) return;

  const modManagerWindow = document.createElement("div");
  modManagerWindow.id = "modManagerWindow";
  modManagerWindow.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    font-family: Arial, sans-serif;
    color: white;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
    background: var(--dark-main);
    backdrop-filter: blur(30px);
  `;

  try {
    modManagerWindow.innerHTML = fs.readFileSync(
      path.join(__dirname, "modManager.html"),
      "utf-8"
    );
    document.body.parentNode.appendChild(modManagerWindow);
  } catch (error) {
    console.error("Error loading mod manager HTML:", error);
    modManagerWindow.remove();
    return false;
  }

  return true;
}

/**
 * Deletes an installed mod (files/folders and removes from installed.json).
 * Updates the UI to allow reinstallation without removing the card completely.
 * @param {string} mod - The mod key or filename.
 * @param {string} type - The mod type (e.g. "Actions", "Themes").
 */
function deleteMod(mod, type) {
  const normalizedType = capitalizeFirstLetter(type);
  const installedData = getInstalledData();

  // Remove from installed.json
  if (installedData[normalizedType] && installedData[normalizedType][mod]) {
    delete installedData[normalizedType][mod];
    saveInstalledData(installedData);
  }

  // Remove the file(s) or folder(s) from disk
  const targetDir = TYPE_PATHS[normalizedType];
  const modPath = path.join(targetDir, mod);

  try {
    if (fs.existsSync(modPath)) {
      const stat = fs.lstatSync(modPath);
      if (stat.isDirectory()) {
        fs.rmSync(modPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(modPath);
      }
    }
    // Optionally, handle folders for themes/translations/automations
    const folderPath = path.join(targetDir, mod.replace(/\.[^/.]+$/, ""));
    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Error deleting mod ${mod}:`, error);
  }

  // Remove only the 'installed' class from the card, do not remove the card
  const card = document.querySelector(`.card[data-mod-id="${mod}"]`);
  if (card) {
    card.classList.remove("installed");
    // Optionally, update the icon to download
    const iconElement = card.querySelector(".icon");
    if (iconElement) {
      iconElement.innerHTML = getDownloadIcon();
      // Remove old event listeners by replacing the node
      const newIcon = iconElement.cloneNode(true);
      iconElement.parentNode.replaceChild(newIcon, iconElement);
      // Attach install event
      newIcon.addEventListener("click", async () => {
        newIcon.innerHTML = getLoadingIcon();
        const registry = await fetchRegistry();
        const success = await installMod(mod, type, registry);
        newIcon.innerHTML = success ? getCheckmarkIcon() : getErrorIcon();
        if (!success)
          setTimeout(() => {
            newIcon.innerHTML = getDownloadIcon();
          }, 3000);
      });
    }
  }
}

module.exports = {
  run: async (options) => {
    try {
      // Create and setup UI
      const success = createModManagerWindow();
      if (!success) return;

      // Fetch registry data
      const registry = await fetchRegistry();

      // Initialize the mod manager UI and functionality
      initializeModManager(registry);
    } catch (error) {
      console.error("Error running mod manager:", error);
      document.getElementById("modManagerWindow")?.remove();
    }
  },
};
