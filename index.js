const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')
const semver = require("semver")

async function execCommand(command, options = {}) {
    const projectPath = core.getInput('project-path')
    options.cwd = projectPath
    return exec.exec(command, [], options)
}

async function run() {
    let version = core.getInput('version')
    const buildNumber = core.getInput('build-number')
    const versionPath = core.getInput('version-path')

    if (versionPath) {
        const content = fs.readFileSync(versionPath, 'utf8')
        version = content.trim()
    }

    let parsedVersion = semver.parse(version)
    let newVersion = `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`

    if (version) {
        core.setOutput('version', newVersion)

        const command = `agvtool new-marketing-version ${newVersion}`
        console.log(command)
        await execCommand(command).catch(error => {
            core.setFailed(error.message)
        })
    } else {
        await execCommand(`agvtool what-marketing-version -terse1`, {
            listeners: { stdout: (data) => {
                console.log(data)
                core.setOutput('version', data.toString().trim())
            }}
        })
    }

    if (!buildNumber) {
        const command = `agvtool next-version -all`
        console.log(command)
        await execCommand(command).catch(error => {
            core.setFailed(error.message)
        })
    } else {
        const command = `agvtool new-version -all ${buildNumber}`
        console.log(command)
        await execCommand(command).catch(error => {
            core.setFailed(error.message)
        })
    }

    await execCommand(`agvtool what-version -terse`, {
        listeners: { stdout: (data) => {
            console.log(data)
            core.setOutput('build-number', data.toString().trim())
        }}
    })
}

run()