import { body, param, query } from "express-validator";

export const createNotebookSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is require in req body")
      .isString()
      .withMessage("title must be a string"),
    body("content")
      .notEmpty()
      .withMessage("content is require in req body")
      .isString()
      .withMessage("content must be a string"),
    
  ];
};

export const notebookByIdSchema = () => {
  return [param("id").notEmpty().withMessage("id param is required")];
};

export const updateNotebookSchma = () => {
  return [
    param("id").notEmpty().withMessage("id param is required"),

    body("title").optional().isString().withMessage("title must be a string"),

    body("content")
      .optional()
      .isString()
      .withMessage("content must be a string"),
  ];
};

export const shareNotebookSchema = () => {
  return [
    body("userIds").notEmpty().withMessage("Please provide your first name"
    ).isArray().withMessage('userIds is an array of userIds'),
    param("notebookId").notEmpty().withMessage("Please provide your last name"),
  ]
}