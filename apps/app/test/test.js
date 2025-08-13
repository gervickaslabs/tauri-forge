import os from "os";
import path from "path";
import { spawn } from "child_process";
import { Builder, Capabilities, By } from "selenium-webdriver";
import { assert } from "chai";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// create the path to the expected application binary
const application = path.resolve(
  __dirname,
  "..",
  "src-tauri",
  "target",
  "release",
  "tauriforge"
);

// keep track of the webdriver instance we create
export let driver;

// keep track of the tauri-driver process we start
let tauriDriver;
let exit = false;

before(async function () {
  // set timeout to 2 minutes to allow the program to build if it needs to
  this.timeout(120000);

  // ensure the app has been built
  // spawnSync("pnpm", ["build"], {
  //   cwd: path.resolve(__dirname, ".."),
  //   stdio: "inherit",
  //   shell: true,
  // });

  // start tauri-driver
  tauriDriver = spawn(
    path.resolve(os.homedir(), ".cargo", "bin", "tauri-driver"),
    [],
    { stdio: [null, process.stdout, process.stderr] }
  );

  tauriDriver.on("error", (error) => {
    console.error("tauri-driver error:", error);
    process.exit(1);
  });
  tauriDriver.on("exit", (code) => {
    if (!exit) {
      console.error("tauri-driver exited with code:", code);
      process.exit(1);
    }
  });

  const capabilities = new Capabilities();
  capabilities.set("tauri:options", { application });
  capabilities.setBrowserName("wry");

  // start the webdriver client
  driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer("http://127.0.0.1:4444/")
    .build();
});

after(() => {
  // stop the webdriver session
  closeTauriDriver();
});

describe("Hello Tauri Forge", () => {
  it("should be cordial", async () => {
    let title = await driver.findElement(By.id("title")).getText();
    assert.equal("Tauri forge", title);
  });
});

function closeTauriDriver() {
  exit = true;
  // kill the tauri-driver process
  tauriDriver.kill();
  driver.quit();
}

function onShutdown(fn) {
  const cleanup = () => {
    try {
      fn();
    } finally {
      process.exit();
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
  process.on("SIGBREAK", cleanup);
}

onShutdown(() => {
  closeTauriDriver();
});
