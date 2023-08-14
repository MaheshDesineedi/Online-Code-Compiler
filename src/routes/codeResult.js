import express from "express"
import CodeRunnerForLanguage from "../controllers/codeRunner"

const router = express.Router()

router.get('/run/:codeID', (req, res) => {
    const codeID = req.params.codeID

    if(!codeID) {
        res.status(404).json({error: 'codeID not present'})
        return
    }

    // get code, language
    const {code, language} = getCodeAndLang(codeID)

    // execute code
    CodeRunnerForLanguage.runCode(code, language)
        .then(result => {
            console.log('Execution success')
            
            // save execution log for codeID
            
            // send result/execution log
            res.status(200).json({message: result.output})
        })
        .catch(error => {
            console.error('Execution error: ', error)
            res.status(500).json({error: 'Error execution the code'})
        })
})

module.exports = router