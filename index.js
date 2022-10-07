const core = require("@actions/core");
const exec = require("@actions/exec");
const fs = require("fs");
const semver = require("semver");
const glob = require("glob");
const { parse, build } = require("xcparse");

function updateVersion(projectFile, nextVersion, nextBuildNumber) {
  // go through each key value pair in the project file
  core.startGroup("Updating Version");
  for (const key in projectFile.objects) {
    const value = projectFile.objects[key];
    const buildSettings = value?.buildSettings;
    const marketingVer = buildSettings?.MARKETING_VERSION;
    const projectVer = buildSettings?.CURRENT_PROJECT_VERSION;

    if (marketingVer !== undefined) {
      buildSettings.MARKETING_VERSION = nextVersion;
      core.info(`Updated MARKETING_VERSION to ${nextVersion}`);
    }

    if (projectVer !== undefined) {
      buildSettings.CURRENT_PROJECT_VERSION = nextBuildNumber;
      core.info(`Updated CURRENT_PROJECT_VERSION to ${nextBuildNumber}`);
    }
  }
  core.endGroup();
}

async function run() {
  let version = core.getInput("version");
  const buildNumber = core.getInput("build-number");
  core.startGroup("Setup");
  core.info(`Setting Version: ${version}, Build Number: ${buildNumber}`);

  const projFilePath = glob.sync("**/*.pbxproj")[0];
  core.info(`Found Project File Path: ${projFilePath}`);
  core.endGroup();

  const projFile = fs.readFileSync(projFilePath, "utf8");
  const proj = parse(projFile);
  updateVersion(proj, version, buildNumber);

  const newProjFile = build(proj);
  fs.writeFileSync(projFilePath, newProjFile);
}

run();
