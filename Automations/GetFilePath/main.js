// Behavior:
// - If the selected file is INSIDE the project folder -> copy a SHORT relative path
//   using forward slashes: "file.ext" or "folder/file.ext".
// - If the selected file is OUTSIDE the project folder -> copy the FULL absolute path.

module.exports = {
  run: async (options) => {
    const { exec } = require("child_process");
    const fs = require("fs");
    const path = require("path");

    if (process.platform !== "win32") {
      options.result("This automation works on Windows only.");
      return;
    }

    const readJSON = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };
    const dirIfExists = (p) => {
      try {
        if (!p) return "";
        const st = fs.existsSync(p) ? fs.statSync(p) : null;
        if (st && st.isDirectory()) return path.normalize(p);
      } catch {}
      return "";
    };
    const run = (cmd) => new Promise((res, rej) =>
      exec(cmd, { windowsHide: true }, (e, so, se) => e ? rej(e) : res(String(so || "")))
    );
    const escapePS = (s) => String(s).replace(/'/g, "''");
    async function copyToClipboard(text) {
      const ps = "$t = @'\\n" + escapePS(text) + "\\n'@; Set-Clipboard -Value $t";
      try { await run('powershell -NoProfile -Command "' + ps + '"'); return; } catch (e) {}
      const esc = String(text).replace(/([&|<>^])/g, "^$1");
      await run("cmd /c echo " + esc + " | clip");
    }

    const toNorm = (p) => path.normalize(path.resolve(String(p || "")));
    const withSep = (p) => (p.endsWith(path.sep) ? p : p + path.sep);
    const isInside = (parent, child) => {
      const P = withSep(toNorm(parent)).toLowerCase();
      const C = toNorm(child).toLowerCase();
      return C.startsWith(P);
    };

    const appDataJsonPath = path.join(process.cwd(), "AppData", "data.json");
    const botData = readJSON(appDataJsonPath);
    const projectDir = dirIfExists(botData && botData.prjSrc);

    if (!projectDir) {
      const msg = [
        "Failed to open picker: could not detect project folder.",
        "Tried: " + appDataJsonPath,
        botData ? "Reason: prjSrc missing/invalid or directory does not exist."
                : "Reason: data.json is missing or unreadable.",
        "Make sure a project is opened in BMD (Settings shows a valid Project Path), then try again."
      ].join("\n");
      options.result(msg);
      return;
    }

    try {
      if (options && typeof options.burstInform === "function") {
        options.burstInform("Opening file picker…");
      }

      const psScript = [
        "Add-Type -AssemblyName System.Windows.Forms;",
        "[System.Windows.Forms.Application]::EnableVisualStyles();",
        "$f = New-Object System.Windows.Forms.OpenFileDialog;",
        "$f.InitialDirectory = '" + escapePS(projectDir) + "';",
        "$f.Filter = 'All files (*.*)|*.*';",
        "$res = $f.ShowDialog();",
        "if ($res -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Output $f.FileName }"
      ].join(" ");

      const psOpen = 'powershell -NoProfile -STA -ExecutionPolicy Bypass -Command "' + psScript + '"';

      const out = await run(psOpen);
      const filePath = String(out || "").trim();

      if (!filePath) {
        options.result("Selection canceled.\nProject folder: " + projectDir);
        return;
      }

      let outputPath;
      if (isInside(projectDir, filePath)) {
        let rel = path.relative(projectDir, filePath);
        rel = rel.split(path.sep).join("/");
        outputPath = rel || path.basename(filePath);
      } else {
        outputPath = filePath;
      }

      await copyToClipboard(outputPath);
      const mode = (outputPath === filePath) ? "absolute (outside project)" : "relative (inside project)";
      const resMsg = [
        "Path copied to clipboard:",
        outputPath,
        "",
        "Project folder: " + projectDir,
        "Source: AppData/data.json",
        "Mode: " + mode
      ].join("\n");
      options.result(resMsg);
    } catch (e) {
      options.result("Couldn't open dialog: " + (e && e.message ? e.message : String(e)));
    }
  }
};
