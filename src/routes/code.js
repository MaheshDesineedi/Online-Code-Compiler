import express from "express"

const router = express.Router()

/**
 * 1. save/update
 * 2. 
 */

//save code 
router.post('/save', async (req, res) => {
    const { code, language, codeID } = req.body

    try {
        // Insert code and logs into the database

        if(!codeID) {
            // insert
        }else {
            // update
        }

        res.status(201).json({message: `code saved successfully`, codeID: codeID})
    } catch (error) {
        console.error('Error saving code... ', error)
        res.status(500).json({error: 'unable to save code'})
    }
});

// get code from codeId
router.get('/:codeID', async (req, res) => {
    const userId = req.params.codeID

    try {
        // Fetch code from the database using codeId

        res.status(200).json(codeHistory);
    } catch (error) {
        console.error('Error fetching user code history... ', error)
        res.status(500).json({error: 'unable to fetch user code history'})
    }
});

module.exports = router