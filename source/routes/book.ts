import express from 'express';
import controller from '../controllers/book';

const router = express.Router();

router.get('/', controller.getAllBooks);
router.post('/', controller.createBook);

export = router;
