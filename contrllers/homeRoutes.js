
const router = require("express").Router();
const { Post, User, Comment } = require("../models");

router.get("/", async (req, res) => {
  // withAuth will send you back to the utils/auth and test if there is a req.session.userId
  // if there is NOT it will redirect you back to the login page
  // if there IS (next in utils/auth) it will move to the route handling below
  console.log(req.session);
  try {
    const postStuff = await Post.findAll({
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "post_id", "user_id", "createdAt"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const posts = postStuff.map((post) => post.get({ plain: true }));
    res.render("homepage", { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  //ask Ta: should I change it to res.redirect?
  res.render("login");
});

router.get("/post/:id", async (req, res) => {
  try {
    const postSingle = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "content", "title", "createdAt"],
      include: [
        {
          model: Comment,
          attributes: ["id", "comment_text", "post_id", "user_id", "createdAt"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const post = postSingle.get({ plain: true });
    if (!post) {
      res.status(404).end();
    }
    res.render("single-post", { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;