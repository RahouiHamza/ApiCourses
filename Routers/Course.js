const express = require("express");
const router = express.Router();
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const { Coures } = require("../Model/Coures");


//get all coures : 
router.get("/", async (req, res) => {
    const CouresList = await Coures.find();
    res.json(CouresList)
})


/**
 *  @desc Get All Book by id
 *  @methode GET
 *  @route /api/Books/:id
 *  @access Public
 */
router.get("/:id", asyncHandler(
    async (request, response) => {
        const CouresList = await Coures.findById(request.params.id)
        if (CouresList) {
            response.status(200).json(CouresList)
        } else {
            response.status(404).json({ message: "the Coures not found" })
        }
    }
));


/**
 *  @desc Add New Book
 *  @methode POST
 *  @route /api/Books
 *  @access Public
 */
router.post("/", asyncHandler(async (request, response) => {
    const { error } = validateCreateCoures(request.body);
    if (error) {
        return response.status(400).json({ message: error.details[0].message });
    }

    const CouresList = new Coures({
        name: request.body.name,
        author: request.body.author,
        tags: request.body.tags,
        isPublished: request.body.isPublished,
    });

    const result = await CouresList.save();
    response.status(201).json(result); // 201 => created successfully
}));

/**
 *  @desc Update a Book
 *  @methode PUt
 *  @route /api/Books/:id
 *  @access Public
 */

router.put("/:id", asyncHandler(
    async (request, response) => {
        const { error } = validateUpdateCoures(request.body)
        if (error) {
            return response.status(400).json({ message: error.details[0].message })
        }

        const updateCoures = await Coures.findByIdAndUpdate(request.params.id, {
            $set: {
                name: request.body.name,
                author: request.body.author,
                tags: request.body.tags,
                isPublished: request.body.isPublished,
            }
        }, { new: true })
        response.status(200).json(updateCoures);
    }
))


/**
 *  @desc Delete a Book
 *  @methode Delete
 *  @route /api/Books/:id
 *  @access Public
 */

router.delete("/:id", asyncHandler(
    async (request, response) => {
        const CouresList = await Coures.findById(request.params.id);
        if (CouresList) {
            await Coures.findByIdAndDelete(request.params.id)
            response.status(200).json({ message: "the Coures has been Deleted" })
        } else {
            response.status(404).json({ message: "the Coures not found" })
        }
    }
))



function validateCreateCoures(obj) {
    const schema = Joi.object({
        name: Joi.string().required(),
        author: Joi.string().required(),
        tags: Joi.array().required(),
        isPublished: Joi.boolean().required(),
    })

    return schema.validate(obj)
}
function validateUpdateCoures(obj) {
    const schema = Joi.object({
        name: Joi.string(),
        author: Joi.string(),
        tags: Joi.array(),
        isPublished: Joi.boolean(),
    })

    return schema.validate(obj)
}

module.exports = router;