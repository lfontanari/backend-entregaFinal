import { Router } from 'express';

const router = Router();


router.get("/products", (req, res) => {
    res.render('main')
})


router.get("/error", (req, res) => {
    res.render("error");
});

export default router;