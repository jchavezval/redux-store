const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
        as: 'tagged_products'
      },
    ],
    order: [['id', 'DESC']]
  })
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        through: ProductTag,
        as: 'tagged_products'
      }
    ]
  }).then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: "No Tag found with that id" });
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create({
    name: req.body.name
  })
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    name: req.body.name
  },
  {
    where: {
      id: req.params.id,
    }
  })
    .then(dbTagData => {
      if (!dbTagData[0]) {
        res.status(404).json({ message: "There is no tag with this name" });
        return;
      }
      res.status(200).json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: "No tags found with this id" });
        return;
      }
      res.status(404).json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
