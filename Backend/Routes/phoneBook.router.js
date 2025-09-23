const express = require('express');
const router = express.Router();
const phonebookController = require('../Controller/phoneBook.controller');

router.post('/entries', phonebookController.createEntry);
router.get('/entries', phonebookController.getEntries);
router.get('/entries/:id', phonebookController.getEntryById);

router.put('/entries/:id', phonebookController.updateEntry);
router.delete('/entries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Missing entry ID' });
      }
      
      const deletedEntry = await YourModel.findByIdAndDelete(id);
      if (!deletedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      
      res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ message: 'Error deleting entry', error: error.message });
    }
  });

module.exports = router;