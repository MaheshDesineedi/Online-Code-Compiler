import { spawn, execFile } from "child_process"

export default class CodeRunnerForLanguage {

    dockerArgs = [
        'run', '--rm',
        '--network', 'none',
        '--read-only',
        // '--cpu-period=100000',
        // '--cpu-quota=50000',
        // '--memory=100m',
        // '--cap-drop', 'ALL',
        // '--cap-add', 'NET_RAW',
        '--user', 'nobody'
    ]

    runDocker(dockerArgs) {

        return new Promise((resolve, reject) => {
            const dockerProcess = spawn('docker', dockerArgs)

            let output = ''

            dockerProcess.stdout.on('data', data => {
                output += data.toString()
            })

            dockerProcess.stderr.on('data', data => {
                output += data.toString()
            })

            dockerProcess.stderr.on('error', error => {
                reject(error)
            })

            dockerProcess.stderr.on('close', exitCode => {
                if(exitCode == 0) {
                    resolve({output})
                }else {
                    reject(new Error(`Docker exited with code ${exitCode}`))
                }
            })
        })
    }

    runCPlusPlus(code, args) {
        const cppDockerArgs = [
            'gcc:9.5', // Replace with your custom Docker image for C++
            'bash', '-c',
            `echo "${code}" > code.cpp && g++ -o code code.cpp && ./code`,
        ]
        this.dockerArgs.push(...cppDockerArgs)

        console.log('Executing docker command: docker ', this.dockerArgs)

        return runDocker(this.dockerArgs)
    }

    runPython(code, args) {

        const dockerProcess = spawn('docker', dockerArgs)
    }

    runJava(code, args) {
 
    }

    static runCode(code, language) {
        if(language == 'cpp') {
            return runCPlusPlus(code)
        }
    }
}