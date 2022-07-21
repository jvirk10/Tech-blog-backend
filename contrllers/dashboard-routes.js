const router = require("express").Router();
const withAuth = require("../utils/auth");
const { Post, User, Comment } = require("../models");

router.get("/", withAuth, async (req, res) => {
  // withAuth will send you back to the utils/auth and test if there is a req.session.userId
  // if there is NOT it will redirect you back to the login page
  // if there IS (next in utils/auth) it will move to the route handling below

  try {
    const postStuff = await Post.findAll({
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "createdAt",
          ],
          include: 
            {
              model: User,
              attributes: ["username"],
            },
        },
        {
          model: User,
          attributes: ["username"],
        }
      ]
    });

    const posts = postStuff.map((post) => post.get({ plain: true }));
    res.render("dashboard", { posts, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    res.redirect("login");
  }
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postSingle = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "createdAt",
          ],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    const post = postSingle.get({ plain: true });
    if (!post) {
      res.status(404).end();
    }
    res.render("edit-post", {post, loggedIn: true});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;